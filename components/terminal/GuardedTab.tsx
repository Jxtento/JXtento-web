import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type GuardedPosition = {
  id: string;
  mint: string;
  amount: number;
  enabled: boolean;
};

export function GuardedTab() {
  const [positions, setPositions] = useState<GuardedPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<string>("8G8q4gNwqb3CpsV4V9tL7kQd3Bw9o2nF2R5KzL3tN6a1"); // Mock connected wallet for now
  const [newMint, setNewMint] = useState("");
  
  useEffect(() => {
    if (wallet) {
      fetchPositions();
    }
  }, [wallet]);

  const fetchPositions = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/v1/guard/positions?wallet=${wallet}`);
      const data = await res.json();
      if (data.success) {
        setPositions(data.positions);
      }
    } catch (e) {
      console.error("Failed to fetch guarded positions", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleGuard = async (mint: string, enabled: boolean) => {
    if (!wallet) return;
    try {
      const res = await fetch(`${API_URL}/v1/guard/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, mint, enabled })
      });
      const data = await res.json();
      if (data.success) {
        fetchPositions(); // refresh list
      } else {
        alert(data.error || 'Failed to toggle guard');
      }
    } catch (e) {
      console.error(e);
      alert('Error toggling guard');
    }
  };

  return (
    <div className="flex flex-col gap-4 text-axiom-text p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Exit Guard</h2>
        <button onClick={fetchPositions} className="text-xs bg-axiom-panel border border-axiom-border hover:bg-axiom-border px-2 py-1 rounded text-white transition-colors">
          Refresh
        </button>
      </div>
      
      <p className="text-xs text-axiom-muted">
        Active positions are monitored 24/7 for danger signals (Dev Sell, Smart Money Exit, LP drops, etc).
      </p>

      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="Paste Token Address..."
          className="flex-1 bg-axiom-panel border border-axiom-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-axiom-accent"
          value={newMint}
          onChange={e => setNewMint(e.target.value)}
        />
        <button 
          onClick={() => { if(newMint) { toggleGuard(newMint, true); setNewMint(""); } }}
          className="bg-axiom-accent hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-axiom-muted text-sm mt-4 text-center animate-pulse">Syncing positions...</div>
      ) : positions.length === 0 ? (
        <div className="text-axiom-muted text-sm italic p-6 mt-4 bg-axiom-panel rounded border border-axiom-border text-center">
          No guarded positions found. Add a token address above to start monitoring.
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {positions.map(pos => (
            <div key={pos.id} className="bg-axiom-panel border border-axiom-border rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-white font-mono">{pos.mint.substring(0, 12)}...</div>
                <div className="text-xs text-axiom-muted mt-1">Bal: {pos.amount}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${pos.enabled ? 'bg-axiom-good/20 text-axiom-good border border-axiom-good/30' : 'bg-axiom-border text-axiom-muted border border-axiom-muted/30'}`}>
                  {pos.enabled ? 'Guarded' : 'Disabled'}
                </span>
                <button 
                  onClick={() => toggleGuard(pos.mint, !pos.enabled)}
                  className="text-xs text-axiom-accent hover:text-blue-400 underline"
                >
                  {pos.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
