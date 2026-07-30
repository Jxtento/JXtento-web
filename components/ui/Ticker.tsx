"use client";
import { useEffect, useState } from "react";
import { TICKERS, FLAGS } from "@/constants";

export function Ticker() {
  const [items, setItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const rand = (n: number) => Math.floor(Math.random() * n);
    const hex = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const ca = () => {
      let s = "";
      for (let i = 0; i < 4; i++) s += hex[rand(hex.length)];
      let t = "";
      for (let i = 0; i < 4; i++) t += hex[rand(hex.length)];
      return `${s}…${t}`;
    };

    const newItems = [];
    for (let i = 0; i < 26; i++) {
      const t = TICKERS[rand(TICKERS.length)];
      const f = FLAGS[rand(FLAGS.length)];
      const danger = f.includes("rug") || f.includes("bundle");
      
      newItems.push(
        <span key={i} className="mx-[22px]">
          <b className="text-[var(--ink)] font-semibold">${t}</b> {ca()} {danger ? <i className="text-[var(--accent)] not-italic">{f}</i> : f}
        </span>
      );
    }
    setItems(newItems);
  }, []);

  if (items.length === 0) return <div className="border-b border-[var(--line)] bg-[var(--paper)] h-[34px] overflow-hidden" aria-hidden="true"></div>;

  return (
    <div className="border-b border-[var(--line)] bg-[var(--paper)] overflow-hidden whitespace-nowrap" aria-hidden="true">
      <div className="inline-block py-[9px] font-mono text-[11.5px] tracking-[.02em] text-[var(--muted)] animate-scroll motion-reduce:animate-none">
        {items}
        {items}
      </div>
    </div>
  );
}
