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
  const [wallet, setWallet] = useState<string>(""); 
  const [newMint, setNewMint] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  
  useEffect(() => {
    // Attempt to connect phantom automatically
    const connectWallet = async () => {
      try {
        const solana = (window as any).solana;
        if (solana && solana.isPhantom) {
          const resp = await solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            setWallet(resp.publicKey.toString());
            return;
          }
        }
      } catch (err) {
        console.log("Phantom auto-connect failed or not trusted yet");
      }

      // If Phantom is not connected, use or create an anonymous UUID for tracking
      const storedAnon = localStorage.getItem('anonGuardWallet');
      if (storedAnon) {
        setWallet(storedAnon);
      } else {
        const newAnon = 'anon_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('anonGuardWallet', newAnon);
        setWallet(newAnon);
      }
    };
    connectWallet();
  }, []);

  useEffect(() => {
    if (wallet) {
      fetchPositions();
    }
  }, [wallet]);

  const showModal = (msg: string) => setModalMessage(msg);

  const handleConnect = async () => {
    const solana = (window as any).solana;
    if (solana && solana.isPhantom) {
      try {
        const resp = await solana.connect();
        setWallet(resp.publicKey.toString());
      } catch (err) {
        showModal("Failed to connect wallet.");
      }
    } else {
      showModal("Phantom wallet not found!");
    }
  };

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
    if (!wallet) return; // Wait for wallet or anon string
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
        showModal(data.error || 'Failed to toggle guard');
      }
    } catch (e) {
      console.error(e);
      showModal('Error toggling guard');
    }
  };

  return (
    <div className="flex flex-col gap-4 text-axiom-text p-2 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Exit Guard</h2>
        <div className="flex gap-2">
          {wallet && wallet.startsWith("anon_") && (
             <button onClick={handleConnect} className="text-xs bg-[#AB9FF2] hover:bg-[#9281f0] text-black px-2 py-1 rounded font-bold transition-colors">
               Connect Wallet
             </button>
          )}
          <button onClick={fetchPositions} className="text-xs bg-axiom-panel border border-axiom-border hover:bg-axiom-border px-2 py-1 rounded text-white transition-colors">
            Refresh
          </button>
        </div>
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

      {/* Custom Modal Popup */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-axiom-panel border border-axiom-border rounded-xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-white font-bold text-lg mb-2">Notice</h3>
            <p className="text-axiom-muted text-sm mb-6">{modalMessage}</p>
            <button 
              onClick={() => setModalMessage("")}
              className="w-full bg-[#AB9FF2] hover:bg-[#9281f0] text-black font-bold py-2 px-4 rounded transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
