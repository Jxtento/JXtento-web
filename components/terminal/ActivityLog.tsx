import { useState, useEffect, useCallback } from "react";

export type ActivityEntry = {
  id: string;
  type: "token_deployed" | "dev_buy" | "wallet_connected" | "wallet_disconnected";
  timestamp: number;
  publicKey?: string;
  provider?: string;
  mintAddress?: string;
  ticker?: string;
  name?: string;
  txSignature?: string;
  devBuySol?: number;
};

const STORAGE_KEY = "jxtento_activity_log";

function getActivityLog(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function clearActivityLog() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function formatTimestamp(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const date = new Date(ts);

  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function shortAddr(addr?: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function EntryIcon({ type }: { type: ActivityEntry["type"] }) {
  if (type === "token_deployed") return <span>🚀</span>;
  if (type === "dev_buy") return <span>💰</span>;
  if (type === "wallet_connected") return <span>🔗</span>;
  if (type === "wallet_disconnected") return <span>🔌</span>;
  return <span>•</span>;
}

function EntryLabel({ entry }: { entry: ActivityEntry }) {
  if (entry.type === "token_deployed") {
    return (
      <span className="text-xs font-semibold text-axiom-text">
        Token Deployed{" "}
        {entry.ticker && (
          <span className="px-1.5 py-0.5 rounded bg-axiom-warn/20 text-axiom-warn text-[10px] font-bold">
            ${entry.ticker}
          </span>
        )}
        {entry.name && (
          <span className="text-axiom-muted font-normal ml-1">{entry.name}</span>
        )}
      </span>
    );
  }
  if (entry.type === "dev_buy") {
    return (
      <span className="text-xs font-semibold text-axiom-text">
        Dev Buy{" "}
        {entry.devBuySol && (
          <span className="text-axiom-muted font-normal">{entry.devBuySol} SOL</span>
        )}
      </span>
    );
  }
  if (entry.type === "wallet_connected") {
    return (
      <span className="text-xs font-semibold text-axiom-text">
        Wallet Connected{" "}
        {entry.provider && (
          <span className="text-axiom-muted font-normal capitalize">{entry.provider}</span>
        )}
      </span>
    );
  }
  if (entry.type === "wallet_disconnected") {
    return <span className="text-xs font-semibold text-axiom-text">Wallet Disconnected</span>;
  }
  return null;
}

export function ActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setEntries(getActivityLog());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    
    // Listen for storage changes in other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [load]);

  const handleClear = () => {
    clearActivityLog();
    setEntries([]);
  };

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-axiom-border/10">
        <h2 className="text-sm font-semibold text-axiom-text">Activity Log</h2>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[10px] text-axiom-muted hover:text-axiom-bad transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 mt-2">
        {loading ? (
          <div className="text-center py-10 text-axiom-muted text-xs">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-axiom-muted text-xs">
            No activity yet. Actions you take (launch, connect wallet) will appear here.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg border bg-axiom-bg border-axiom-border/20"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <EntryIcon type={entry.type} />
                  <EntryLabel entry={entry} />
                </div>
                <span className="text-[10px] text-axiom-muted whitespace-nowrap ml-2">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>

              {entry.publicKey && entry.type === "wallet_connected" && (
                <p className="text-[10px] text-axiom-muted font-mono mt-1">
                  {shortAddr(entry.publicKey)}
                </p>
              )}

              {(entry.mintAddress || entry.txSignature) && (
                <div className="flex items-center gap-3 mt-1.5">
                  {entry.mintAddress && (
                    <a
                      href={`https://pump.fun/coin/${entry.mintAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-axiom-muted font-mono hover:text-axiom-text transition-colors"
                    >
                      Mint: {shortAddr(entry.mintAddress)} ↗
                    </a>
                  )}
                  {entry.txSignature && (
                    <a
                      href={`https://solscan.io/tx/${entry.txSignature}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-axiom-muted font-mono hover:text-axiom-text transition-colors"
                    >
                      Tx: {shortAddr(entry.txSignature)} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className="text-[9px] text-axiom-muted/50 text-center mt-auto">
        Stored locally only · Never sent to any server
      </p>
    </div>
  );
}
