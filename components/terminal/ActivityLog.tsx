import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { playNotificationSound } from "@/lib/sound";

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

export function saveActivityEntry(entry: Omit<ActivityEntry, "id">) {
  if (typeof window === "undefined") return;
  try {
    const existing: ActivityEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newEntry: ActivityEntry = { ...entry, id: `${entry.type}_${Date.now()}_${Math.random().toString(36).slice(2)}` };
    const updated = [newEntry, ...existing].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  } catch {}
}

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
  return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortAddr(addr?: string): string {
  if (!addr) return "—";
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function TypeBadge({ type }: { type: ActivityEntry["type"] }) {
  const map: Record<ActivityEntry["type"], { label: string; cls: string; icon: string }> = {
    token_deployed: { label: "Launch", icon: "🚀", cls: "bg-green-500/10 text-green-400 border border-green-500/20" },
    dev_buy: { label: "Dev Buy", icon: "💰", cls: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
    wallet_connected: { label: "Connected", icon: "🔗", cls: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    wallet_disconnected: { label: "Disconnected", icon: "🔌", cls: "bg-red-500/10 text-red-400 border border-red-500/20" },
  };
  const { label, icon, cls } = map[type] || { label: type, icon: "•", cls: "" };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>
      {icon} {label}
    </span>
  );
}

export function ActivityLog() {
  // Initialize directly from localStorage to avoid blank flash on refresh
  const [entries, setEntries] = useState<ActivityEntry[]>(() => getActivityLog());
  const [loading, setLoading] = useState(false);
  const { publicKey, connected, wallet } = useWallet();
  const prevConnected = useRef<boolean | null>(null); // null = not yet determined

  // Fetch from database, merge with and update localStorage cache
  const loadFromDB = useCallback(async (walletAddr?: string) => {
    try {
      const url = walletAddr
        ? `/api/launch-history?wallet=${encodeURIComponent(walletAddr)}`
        : '/api/launch-history';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('DB fetch failed');
      const dbRows: any[] = await res.json();
      // Map DB rows to ActivityEntry format
      const dbEntries: ActivityEntry[] = dbRows.map((row) => ({
        id: row.id,
        type: 'token_deployed' as const,
        timestamp: new Date(row.createdAt).getTime(),
        publicKey: row.deployerAddress,
        mintAddress: row.mintAddress,
        ticker: row.ticker,
        name: row.name,
        txSignature: row.txHash !== row.mintAddress ? row.txHash : undefined,
      }));
      // Merge: DB entries take precedence; keep local-only entries (wallet_connected etc)
      const localEntries = getActivityLog().filter(
        (e) => e.type !== 'token_deployed'
      );
      const merged = [...dbEntries, ...localEntries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 200);
      // Update localStorage cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setEntries(merged);
    } catch {
      // Fallback: just load from localStorage
      setEntries(getActivityLog());
    }
  }, []);

  const load = useCallback(() => {
    setEntries(getActivityLog());
  }, []);

  const previousCountRef = useRef(entries.length);


  // Load from database on mount (with current wallet if available)
  useEffect(() => {
    loadFromDB(publicKey?.toBase58());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    // Sync if storage was updated from another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const currentCount = previousCountRef.current;
        load();
        setTimeout(() => {
          const newData = getActivityLog();
          if (newData.length > currentCount) playNotificationSound();
          previousCountRef.current = newData.length;
        }, 100);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [load]);

  // Track wallet connect/disconnect events — skip duplicate on page refresh
  useEffect(() => {
    // prevConnected.current === null means first render; skip to avoid spam on refresh
    if (prevConnected.current === null) {
      prevConnected.current = connected;
      return;
    }
    if (connected && !prevConnected.current && publicKey) {
      // Load from DB filtered by this wallet
      loadFromDB(publicKey.toBase58());
      // Avoid duplicate: skip if last entry is wallet_connected within 30s
      const recent = getActivityLog();
      const last = recent[0];
      const tooRecent = last?.type === "wallet_connected" && Date.now() - last.timestamp < 30_000;
      if (!tooRecent) {
        saveActivityEntry({
          type: "wallet_connected",
          timestamp: Date.now(),
          publicKey: publicKey.toBase58(),
          provider: wallet?.adapter.name || "Unknown",
        });
        load();
      }
    } else if (!connected && prevConnected.current) {
      saveActivityEntry({
        type: "wallet_disconnected",
        timestamp: Date.now(),
      });
      load();
    }
    prevConnected.current = connected;
  }, [connected, publicKey, wallet, load, loadFromDB]);

  const handleClear = () => {
    clearActivityLog();
    setEntries([]);
  };

  const launches = entries.filter(e => e.type === "token_deployed");

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Wallet Info Banner */}
      {connected && publicKey && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-green-500/5 border border-green-500/20">
          <span className="text-green-400 text-lg">🔗</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-axiom-muted">Connected Wallet</span>
            <span className="text-xs font-mono text-green-400 font-semibold">{publicKey.toBase58()}</span>
          </div>
          <span className="ml-auto text-[10px] text-axiom-muted capitalize">{wallet?.adapter.name}</span>
        </div>
      )}

      {/* Stats row */}
      {launches.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-axiom-bg border border-axiom-border/30 text-center">
            <div className="text-lg font-bold text-axiom-text">{launches.length}</div>
            <div className="text-[10px] text-axiom-muted">Tokens Launched</div>
          </div>
          <div className="p-3 rounded-lg bg-axiom-bg border border-axiom-border/30 text-center">
            <div className="text-lg font-bold text-axiom-text">
              {entries.filter(e => e.type === "dev_buy").reduce((acc, e) => acc + (e.devBuySol || 0), 0).toFixed(3)}
            </div>
            <div className="text-[10px] text-axiom-muted">SOL Dev Bought</div>
          </div>
          <div className="p-3 rounded-lg bg-axiom-bg border border-axiom-border/30 text-center">
            <div className="text-lg font-bold text-axiom-text">
              {new Set(launches.map(e => e.publicKey).filter(Boolean)).size}
            </div>
            <div className="text-[10px] text-axiom-muted">Wallets Used</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-axiom-text">Launch History</h2>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[10px] text-axiom-muted hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-axiom-border/20 bg-axiom-bg">
        {loading ? (
          <div className="text-center py-10 text-axiom-muted text-xs">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-axiom-muted text-xs flex flex-col items-center gap-2">
            <span className="text-4xl">📋</span>
            <p>No activity yet. Launch a token to see history here.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-axiom-border/20 text-axiom-muted">
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Token</th>
                <th className="text-left px-3 py-2 font-medium">Wallet</th>
                <th className="text-left px-3 py-2 font-medium">Details</th>
                <th className="text-right px-3 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-axiom-border/10 hover:bg-axiom-panel/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <TypeBadge type={entry.type} />
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    {entry.ticker ? (
                      <span className="flex items-center gap-1.5">
                        <span className="font-bold text-axiom-text">${entry.ticker}</span>
                        {entry.name && <span className="text-axiom-muted text-[10px]">{entry.name}</span>}
                      </span>
                    ) : entry.devBuySol ? (
                      <span className="text-yellow-400">{entry.devBuySol} SOL</span>
                    ) : (
                      <span className="text-axiom-muted">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-axiom-muted">
                    {entry.publicKey ? (
                      <a
                        href={`https://solscan.io/account/${entry.publicKey}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-axiom-text transition-colors"
                      >
                        {shortAddr(entry.publicKey)} ↗
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    {entry.mintAddress ? (
                      <a
                        href={`https://pump.fun/coin/${entry.mintAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-axiom-muted hover:text-axiom-text transition-colors"
                      >
                        {shortAddr(entry.mintAddress)} ↗
                      </a>
                    ) : entry.provider ? (
                      <span className="text-axiom-muted capitalize">{entry.provider}</span>
                    ) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right text-axiom-muted whitespace-nowrap">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-[9px] text-axiom-muted/50 text-center">
        Stored locally only · Never sent to any server
      </p>
    </div>
  );
}
