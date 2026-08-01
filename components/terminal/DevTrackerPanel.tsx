import { useEffect, useState } from "react"

export function DevTrackerPanel({ mintAddress }: { mintAddress: string }) {
  const [forensic, setForensic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  // Fetch initial state
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    async function init() {
      try {
        const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080").replace(/\/+$/, "")
        const res = await fetch(`${backendUrl}/api/dev-tracker/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mint: mintAddress })
        })

        if (!res.ok) throw new Error("Failed to scan launch forensics")
        const data = await res.json()
        if (active) setForensic(data)
      } catch (err: any) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    
    void init()
    return () => { active = false }
  }, [mintAddress])

  // WebSocket Subscription
  useEffect(() => {
    if (!forensic) return
    let active = true
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080").replace(/\/+$/, "")
    const wsUrl = backendUrl.replace(/^http/, "ws") + "/ws/kol-alerts" // Using the same port/ws handler
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      if (active) {
        setWsConnected(true)
        ws.send(JSON.stringify({ action: "subscribe", mint: `dev-tracker:${mintAddress}` }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === "actor_update" && msg.mint === mintAddress) {
          setForensic((prev: any) => {
             if (!prev) return prev;
             const newActors = prev.actors.map((a: any) => 
               a.wallet === msg.wallet 
                 ? { ...a, soldFraction: msg.soldFraction, sellLabel: msg.sellLabel } 
                 : a
             );
             return { ...prev, actors: newActors };
          })
        } else if (msg.type === "dev_sell" && msg.mint === mintAddress) {
          setForensic((prev: any) => {
             if (!prev) return prev;
             return { ...prev, devSoldFraction: msg.devSoldFraction, devAlert: msg.alert };
          })
        }
      } catch (e) {}
    }

    ws.onclose = () => { if (active) setWsConnected(false) }

    return () => {
      active = false
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: "unsubscribe", mint: `dev-tracker:${mintAddress}` }))
        ws.close()
      }
    }
  }, [mintAddress, forensic !== null])

  if (loading) return <div className="text-center text-axiom-muted text-sm py-4">Reconstructing launch...</div>
  if (error) return <div className="text-axiom-bad text-sm py-4">Error: {error}</div>
  if (!forensic) return null

  // Computed Stats
  const devActor = forensic.actors?.find((a: any) => a.role === 'dev') || { sellLabel: 'holding', soldFraction: forensic.devSoldFraction || 0 }
  const bundleActors = forensic.actors?.filter((a: any) => a.role === 'bundle') || []
  const snipersCount = forensic.actors?.filter((a: any) => a.role === 'sniper').length || 0
  const supplyBundled = (bundleActors.reduce((sum: number, a: any) => sum + (a.supplyPct || 0), 0) * 100).toFixed(1)
  const bundleHolding = bundleActors.filter((a: any) => (a.soldFraction || 0) < 0.5).length

  // Dev Alert State
  const isDevAlert = devActor.soldFraction >= 0.5 || forensic.devAlert

  const getLabelColor = (label: string) => {
    if (label.includes("holding")) return "text-axiom-good";
    if (label.includes("fully exited") || label.includes("half")) return "text-axiom-bad font-bold";
    return "text-amber-400"; // partially sold
  }

  return (
    <div className="flex flex-col gap-4 font-mono text-sm">
      {/* Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-axiom-border bg-axiom-panel p-3 rounded-sm text-xs">
        <div>
          <div className="text-axiom-muted uppercase">Bundle Wallets</div>
          <div className="text-white font-bold">{bundleActors.length}</div>
        </div>
        <div>
          <div className="text-axiom-muted uppercase">Supply Bundled</div>
          <div className="text-white font-bold">{supplyBundled}%</div>
        </div>
        <div>
          <div className="text-axiom-muted uppercase">Snipers</div>
          <div className="text-white font-bold">{snipersCount}</div>
        </div>
        <div>
          <div className="text-axiom-muted uppercase">Bundle Status</div>
          <div className="text-white font-bold">{bundleHolding} / {bundleActors.length} Holding</div>
        </div>
      </div>

      {/* Deployer Panel */}
      <div className={`p-4 rounded-sm border ${isDevAlert ? 'border-axiom-bad bg-red-900/20' : 'border-axiom-border bg-axiom-panel'}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-bold uppercase ${isDevAlert ? 'text-axiom-bad' : 'text-axiom-muted'}`}>Deployer Intel</h3>
          <span className="text-[10px] text-axiom-muted flex items-center gap-1">
             <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-axiom-good animate-pulse' : 'bg-axiom-bad'}`}></span>
             Live
          </span>
        </div>
        <div className="flex justify-between items-center bg-axiom-bg border border-axiom-border p-2 rounded">
           <span className="text-white truncate pr-4">{forensic.deployer}</span>
           <span className={`whitespace-nowrap ${getLabelColor(devActor.sellLabel)}`}>
             {isDevAlert ? `Dev ${devActor.sellLabel}` : devActor.sellLabel}
           </span>
        </div>
      </div>

      {/* Cluster Callout */}
      {bundleActors.length > 0 && (
         <div className="p-3 border border-amber-500/30 bg-amber-900/10 rounded-sm">
            <h4 className="text-amber-500 font-bold uppercase mb-1 text-xs">Cluster Detected</h4>
            <p className="text-axiom-muted text-xs">
              Evidence: Shared funder trace from dev + bought within 2 slots of liquidity + tight buy variance.
            </p>
         </div>
      )}

      {/* Genesis Table */}
      <div className="border border-axiom-border rounded-sm overflow-hidden bg-axiom-panel">
         <div className="bg-axiom-bg px-3 py-2 text-xs font-bold text-axiom-muted uppercase border-b border-axiom-border grid grid-cols-12 gap-2">
            <div className="col-span-2">Role</div>
            <div className="col-span-5">Wallet</div>
            <div className="col-span-2 text-right">Supply</div>
            <div className="col-span-3 text-right">Status</div>
         </div>
         <div className="flex flex-col divide-y divide-axiom-border max-h-64 overflow-y-auto">
            {forensic.actors?.map((actor: any) => (
               <div key={actor.id} className="px-3 py-2 text-xs grid grid-cols-12 gap-2 items-center hover:bg-axiom-bg/50">
                  <div className={`col-span-2 font-bold uppercase ${actor.role === 'dev' ? 'text-purple-400' : actor.role === 'bundle' ? 'text-amber-500' : actor.role === 'sniper' ? 'text-blue-400' : 'text-axiom-muted'}`}>
                    {actor.role}
                  </div>
                  <div className="col-span-5 text-white truncate">{actor.wallet}</div>
                  <div className="col-span-2 text-right text-axiom-muted">
                    {((actor.supplyPct || 0) * 100).toFixed(1)}%
                  </div>
                  <div className={`col-span-3 text-right ${getLabelColor(actor.sellLabel)}`}>
                    {actor.sellLabel}
                  </div>
               </div>
            ))}
            {(!forensic.actors || forensic.actors.length === 0) && (
               <div className="px-3 py-4 text-center text-axiom-muted text-xs">No genesis actors found.</div>
            )}
         </div>
      </div>
    </div>
  )
}
