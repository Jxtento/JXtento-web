import { useEffect, useRef, useState } from "react"
import { createChart, HistogramSeries, IChartApi, ISeriesApi, Time } from "lightweight-charts"

type LiveVolumeChartProps = {
  mintAddress: string;
}

export function LiveVolumeChart({ mintAddress }: LiveVolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [intervalLabel, setIntervalLabel] = useState<string>("1m")
  const [loading, setLoading] = useState(false)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  const intervalSecondsRef = useRef<number>(60)

  // Parse interval string to seconds
  const parseInterval = (val: string) => {
    if (val.endsWith('s')) return parseInt(val.replace('s', ''));
    if (val.endsWith('m')) return parseInt(val.replace('m', '')) * 60;
    return 60;
  }

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 200,
      layout: {
        background: { type: 'solid' as any, color: 'transparent' },
        textColor: '#888',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true, // Enable seconds for smaller intervals
      }
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0,
      },
    });

    chartRef.current = chart
    seriesRef.current = volumeSeries

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    }
  }, [])

  useEffect(() => {
    let active = true;
    intervalSecondsRef.current = parseInterval(intervalLabel);

    async function loadData() {
      setLoading(true);
      try {
        if (!seriesRef.current) return;

        // If it's a seconds interval, GT doesn't support it historically. Start fresh.
        if (intervalLabel.endsWith('s')) {
          seriesRef.current.setData([]);
          if (active) setLoading(false);
          return;
        }

        // Minutes logic
        const agg = parseInt(intervalLabel.replace('m', ''));
        const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);
        const dexData = await dexRes.json();
        if (!active || !dexData.pairs || dexData.pairs.length === 0) return;
        
        const poolAddress = dexData.pairs[0].pairAddress;
        const gtRes = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolAddress}/ohlcv/minute?aggregate=${agg}&limit=100`);
        const gtData = await gtRes.json();

        if (!active || !gtData.data || !gtData.data.attributes || !gtData.data.attributes.ohlcv_list) return;

        const ohlcvList = gtData.data.attributes.ohlcv_list.reverse();

        const volumeData = ohlcvList.map((item: any) => {
          const time = item[0] as Time;
          const open = item[1];
          const close = item[4];
          const volume = item[5];
          const color = close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)';
          
          return {
            time,
            value: volume,
            color
          };
        });

        seriesRef.current.setData(volumeData);
        chartRef.current?.timeScale().fitContent();

      } catch (err) {
        console.error("Failed to load volume chart data", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => { active = false; }
  }, [mintAddress, intervalLabel]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let active = true;

    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080").replace(/\/+$/, "")
    const wsUrl = backendUrl.replace(/^http/, "ws") + "/ws/kol-alerts"
    ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      if (active) ws?.send(JSON.stringify({ action: "subscribe", mint: mintAddress }))
    }
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === "smart_money" && msg.data.mint === mintAddress) {
          if (!seriesRef.current) return;
          
          const rawAmountStr = msg.data.amount.replace(/[^0-9.]/g, '');
          const tradeVolume = parseFloat(rawAmountStr) || 0;
          if (tradeVolume === 0) return;
          
          const nowSeconds = Math.floor(Date.now() / 1000);
          const intervalSec = intervalSecondsRef.current;
          const bucketTime = (Math.floor(nowSeconds / intervalSec) * intervalSec) as Time;
          
          const dataList = seriesRef.current.data();
          const lastBar = dataList.length > 0 ? (dataList[dataList.length - 1] as any) : null;
          
          const color = msg.data.action.toUpperCase() === 'BUY' ? 'rgba(38, 166, 154, 0.8)' : 'rgba(239, 83, 80, 0.8)';

          if (lastBar && lastBar.time === bucketTime) {
            // Update current bar
            seriesRef.current.update({
              time: bucketTime,
              value: lastBar.value + tradeVolume,
              color: color // Takes color of latest trade, or we could leave it
            });
          } else {
            // Append new bar
            seriesRef.current.update({
              time: bucketTime,
              value: tradeVolume,
              color: color
            });
          }
        }
      } catch (e) {}
    }

    return () => {
      active = false;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: "unsubscribe", mint: mintAddress }))
        ws.close()
      }
    }
  }, [mintAddress]);

  return (
    <div className="rounded-sm border border-axiom-border bg-axiom-panel p-4 flex flex-col gap-2">
       <div className="flex items-center justify-between">
         <p className="text-xs font-bold uppercase text-axiom-muted">Real-Time Volume</p>
         <div className="flex gap-2">
            <select 
              value={intervalLabel} 
              onChange={(e) => setIntervalLabel(e.target.value)}
              className="bg-axiom-bg border border-axiom-border text-axiom-text text-xs rounded px-2 py-1 outline-none focus:border-axiom-accent"
            >
              <option value="1m">1m</option>
              <option value="3m">3m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="30m">30m</option>
            </select>
         </div>
       </div>
       <div className="relative w-full h-[200px]">
         {loading && (
           <div className="absolute inset-0 flex items-center justify-center bg-axiom-panel/80 z-10">
             <span className="text-xs text-axiom-muted animate-pulse">Loading chart data...</span>
           </div>
         )}
         <div ref={chartContainerRef} className="w-full h-full" />
       </div>
    </div>
  )
}
