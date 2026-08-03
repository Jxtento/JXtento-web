import { useState, useEffect } from "react";
import { Connection, SystemProgram, Transaction, PublicKey, Keypair, VersionedTransaction } from "@solana/web3.js";

export type FastLaunchDraft = { name: string; symbol: string; description: string; image: string; website?: string; telegram?: string; twitter?: string; };
export type LaunchSettings = { ipfsProvider: string; pinataJwt: string; devBuySol: number | string; slippage: number | string; priorityFee: number | string; };

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return await response.blob();
}

async function uploadMetadata(draft: FastLaunchDraft, settings: LaunchSettings): Promise<string> {
  if (settings.ipfsProvider === "pinata" && settings.pinataJwt) {
    try {
      const blob = await dataUrlToBlob(draft.image);
      const formData = new FormData();
      formData.append("file", blob, "image.png");
      
      const imgRes = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: { "Authorization": `Bearer ${settings.pinataJwt}` },
        body: formData
      });
      
      if (!imgRes.ok) throw new Error("Failed to upload image to Pinata");
      const imgData = await imgRes.json();
      const imageUri = `https://ipfs.io/ipfs/${imgData.data.cid}`;
      
      const metadata = {
        name: draft.name,
        symbol: draft.symbol,
        description: draft.description,
        image: imageUri,
        showName: true,
        ...(draft.twitter ? { twitter: draft.twitter } : {}),
        ...(draft.telegram ? { telegram: draft.telegram } : {}),
        ...(draft.website ? { website: draft.website } : {}),
      };
      
      const metaBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const metaFormData = new FormData();
      metaFormData.append("file", metaBlob, "metadata.json");
      
      const metaRes = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: { "Authorization": `Bearer ${settings.pinataJwt}` },
        body: metaFormData
      });
      
      if (!metaRes.ok) throw new Error("Failed to upload metadata to Pinata");
      const metaData = await metaRes.json();
      return `https://ipfs.io/ipfs/${metaData.data.cid}`;
    } catch (err) {
      console.warn("Pinata upload failed, falling back to pump.fun", err);
    }
  }

  // Fallback to Pump.fun api
  const blob = await dataUrlToBlob(draft.image);
  const formData = new FormData();
  formData.append("file", blob, "image.png");
  formData.append("name", draft.name);
  formData.append("symbol", draft.symbol);
  formData.append("description", draft.description);
  formData.append("showName", "true");
  if (draft.twitter) formData.append("twitter", draft.twitter);
  if (draft.telegram) formData.append("telegram", draft.telegram);
  if (draft.website) formData.append("website", draft.website);

  const res = await fetch("https://pump.fun/api/ipfs", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Pump.fun IPFS upload failed: ${errText || res.statusText}`);
  }
  const data = await res.json();
  return data.metadataUri;
}

const fastLaunch = async (draft: FastLaunchDraft, settings: LaunchSettings): Promise<{ success: boolean; error?: string; mint?: string }> => {
  try {
    const { solana } = window as any;
    if (!solana || !solana.isPhantom) {
      return { success: false, error: "Phantom wallet is required. Please install it." };
    }
    
    await solana.connect();
    const publicKey = solana.publicKey;
    if (!publicKey) return { success: false, error: "Failed to connect to Phantom." };

    if (!draft.image || !draft.name || !draft.symbol) {
      return { success: false, error: "Image, name, and symbol are required." };
    }

    const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");

    // 1. Upload metadata
    const metadataUri = await uploadMetadata(draft, settings);

    // 2. Build Create Transaction via PumpPortal
    const mintKeypair = Keypair.generate();
    
    const reqBody = {
      publicKey: publicKey.toBase58(),
      action: "create",
      tokenMetadata: {
        name: draft.name,
        symbol: draft.symbol,
        uri: metadataUri
      },
      mint: mintKeypair.publicKey.toBase58(),
      denominatedInSol: true,
      amount: Number(String(settings.devBuySol || 0).replace(',', '.')), // combining create + dev buy if pumpportal supports it (it does)
      slippage: Number(String(settings.slippage || 5).replace(',', '.')),
      priorityFee: Number(String(settings.priorityFee || 0.0005).replace(',', '.')),
      pool: "pump"
    };

    const response = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`PumpPortal failed: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`PumpPortal returned JSON error: ${errorData.error || errorData.message || JSON.stringify(errorData)}`);
    }

    const txBytes = new Uint8Array(await response.arrayBuffer());
    const tx = VersionedTransaction.deserialize(txBytes);
    
    // 3. Sign with mint keypair
    tx.sign([mintKeypair]);
    
    // 4. Sign with Phantom wallet
    const signedTx = await solana.signTransaction(tx);
    
    // 5. Send transaction
    const txid = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });
    
    return { success: true, mint: mintKeypair.publicKey.toBase58() };
  } catch (err: any) {
    return { success: false, error: err.message || "Launch failed" };
  }
};

const getLaunchSettings = async () => ({ ipfsProvider: "pumpfun", pinataJwt: "", devBuySol: 0, slippage: 5, priorityFee: 0.0005 });
const saveLaunchSettings = async (settings: any) => {};
const getSelectedLaunchContext = async () => null;
const createLaunchDraft = (ctx: any) => ({ tokenName: "", ticker: "", description: "", sourceUrl: "" });

export function FastLaunch({ initialDraft }: { initialDraft?: Partial<FastLaunchDraft> } = {}) {
  const [draft, setDraft] = useState<FastLaunchDraft>({
    name: initialDraft?.name || "",
    symbol: initialDraft?.symbol || "",
    description: initialDraft?.description || "",
    image: initialDraft?.image || ""
  });
  
  const [settings, setSettings] = useState<LaunchSettings>({
    ipfsProvider: "pumpfun",
    pinataJwt: "",
    devBuySol: 0,
    slippage: 5,
    priorityFee: 0.0005
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successLink, setSuccessLink] = useState("");

  useEffect(() => {
    getLaunchSettings().then(setSettings);
    if (!initialDraft) {
      getSelectedLaunchContext().then(ctx => {
        if (ctx) {
          const generatedDraft = createLaunchDraft(ctx);
          setDraft(d => ({ ...d, name: generatedDraft.tokenName, symbol: generatedDraft.ticker, description: generatedDraft.description, twitter: generatedDraft.sourceUrl }));
        }
      });
    }

    return () => {};
  }, [initialDraft]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft(d => ({ ...d, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleLaunch = async () => {
    setLoading(true);
    setError("");
    setSuccessLink("");
    
    // Save settings
    await saveLaunchSettings(settings);

    if (!draft.name || !draft.symbol || !draft.description || !draft.image) {
      setError("Please fill all required fields and upload an image.");
      setLoading(false);
      return;
    }

    const res = await fastLaunch(draft, settings);
    if (res.success && res.mint) {
      setSuccessLink(`https://pump.fun/${res.mint}`);
      // If token was created but dev buy failed, show as warning
      if (res.error) {
        setError(`⚠️ ${res.error}`);
      }
    } else {
      console.error("[FastLaunch Frontend] Launch failed:", res.error);
      setError(res.error || "Failed to launch");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 mt-4 text-axiom-text">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-axiom-muted">Name</label>
        <input className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-axiom-muted">Ticker</label>
        <input className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none" value={draft.symbol} onChange={e => setDraft(d => ({ ...d, symbol: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-axiom-muted">Description</label>
        <textarea className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none min-h-[60px]" value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-axiom-muted">Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs" />
        {draft.image && <img src={draft.image} className="w-16 h-16 object-cover rounded mt-1" alt="Preview" />}
      </div>
      
      <details className="mt-2 text-sm border-t border-axiom-border pt-2">
        <summary className="cursor-pointer text-axiom-muted">Social Links (Optional)</summary>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-axiom-muted">Website</label>
            <input className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none" placeholder="https://" value={draft.website || ""} onChange={e => setDraft(d => ({ ...d, website: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-axiom-muted">Twitter/X</label>
            <input className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none" placeholder="https://x.com/..." value={draft.twitter || ""} onChange={e => setDraft(d => ({ ...d, twitter: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-axiom-muted">Telegram</label>
            <input className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-sm text-axiom-text focus:outline-none" placeholder="https://t.me/..." value={draft.telegram || ""} onChange={e => setDraft(d => ({ ...d, telegram: e.target.value }))} />
          </div>
        </div>
      </details>
      
      <details className="mt-2 text-sm border-t border-axiom-border pt-2">
        <summary className="cursor-pointer text-axiom-muted">Advanced Settings</summary>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-axiom-muted">IPFS Provider</label>
            <input disabled className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-xs text-axiom-text focus:outline-none opacity-50 cursor-not-allowed" value="Pump.fun (Default)" />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-axiom-muted">Dev Buy (SOL)</label>
              <input type="text" inputMode="decimal" className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-xs text-axiom-text focus:outline-none" value={settings.devBuySol} onChange={e => setSettings(s => ({ ...s, devBuySol: e.target.value.replace(/[^0-9.,]/g, '') }))} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-axiom-muted">Slippage (%)</label>
              <input type="text" inputMode="decimal" className="px-2 py-1 bg-axiom-bg border border-axiom-border rounded text-xs text-axiom-text focus:outline-none" value={settings.slippage} onChange={e => setSettings(s => ({ ...s, slippage: e.target.value.replace(/[^0-9.,]/g, '') }))} />
            </div>
          </div>
        </div>
      </details>

      {error && <div className="text-xs text-axiom-bad mt-2 p-2 rounded bg-axiom-bad/10 border border-axiom-bad/20">{error}</div>}
      
      {successLink ? (
        <div className="mt-3 flex flex-col gap-2 p-3 rounded bg-axiom-good/10 border border-axiom-good/20">
          <div className="text-sm font-medium text-axiom-good">Launched successfully!</div>
          <a href={successLink} target="_blank" rel="noreferrer" className="text-xs underline text-axiom-text">View on pump.fun</a>
        </div>
      ) : (
        <button
          onClick={handleLaunch}
          disabled={loading}
          className="mt-3 w-full py-2 rounded bg-[#00E599] text-black font-medium hover:opacity-90 transition-opacity"
        >
          {loading ? "Launching..." : "Launch on pump.fun"}
        </button>
      )}
    </div>
  );
}
