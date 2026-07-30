import { useState } from "react";
import { AxiomProPanel } from "./AxiomProPanel";

export function AxiomProTab() {
  const [address, setAddress] = useState("");
  const [inspectedAddress, setInspectedAddress] = useState("");
  const [error, setError] = useState("");

  const handleInspect = () => {
    setError("");
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a valid address or URL.");
      return;
    }

    // Basic extraction logic
    let finalMint = trimmed;
    const pumpFunMatch = trimmed.match(/pump\.fun\/(?:coin\/)?([1-9A-HJ-NP-Za-km-z]{32,44})/);
    if (pumpFunMatch && pumpFunMatch[1]) {
      finalMint = pumpFunMatch[1];
    }

    if (finalMint.length < 32 || finalMint.length > 44) {
      setError("Invalid Solana token address.");
      return;
    }

    setInspectedAddress(finalMint);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-axiom-border/10">
        <h2 className="text-sm font-semibold text-axiom-text">Axiom Pro</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-axiom-good animate-pulse shadow-[0_0_8px_rgba(11,122,59,0.6)]" />
          <span className="text-xs text-axiom-muted">Flow Radar Active</span>
        </div>
      </div>

      {!inspectedAddress ? (
        <div className="p-6 text-center mt-8 border border-axiom-border border-dashed rounded-lg">
          <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 mx-auto text-axiom-muted mb-4">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-lg font-bold text-axiom-text">Inspect a Token</h2>
          <p className="mt-2 text-sm text-axiom-muted">
            Use the manual inspector below to view Axiom Pro Intel.
          </p>
        </div>
      ) : null}

      <div className="rounded-sm border border-axiom-border bg-axiom-panel p-4">
        <label className="text-xs font-semibold text-axiom-muted uppercase" htmlFor="address">
          Manual Inspector
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="address"
            className="w-full rounded-sm border border-axiom-border bg-axiom-bg px-3 py-2 text-sm text-axiom-text outline-none focus:border-axiom-accent font-mono placeholder:font-sans"
            value={address}
            placeholder="Paste Solana token address or pump.fun URL"
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInspect()}
          />
          <button
            onClick={handleInspect}
            className="rounded-sm bg-axiom-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-axiom-muted whitespace-nowrap"
          >
            Inspect
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-axiom-bad">{error}</p>}
      </div>

      {inspectedAddress && (
        <div className="flex-1 mt-4">
          <AxiomProPanel mintAddress={inspectedAddress} />
        </div>
      )}
    </div>
  );
}
