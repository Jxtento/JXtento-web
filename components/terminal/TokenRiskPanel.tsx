export type TokenIntelligence = any;

interface TokenRiskPanelProps {
  intelligence: TokenIntelligence
}

export function TokenRiskPanel({ intelligence }: TokenRiskPanelProps) {
  return (
    <div className="space-y-2">
      <Metric label="Risk score" value={`${intelligence.score || 0}/100`} />
      


      <Metric label="Fresh wallets" value={intelligence.details?.freshWalletActivity || "Unknown"} />
      <Metric label="Whales" value={intelligence.details?.whaleActivity || "Unknown"} />
      
      {intelligence.details?.top10Concentration !== undefined && (
         <Metric label="Top 10 Hold" value={`${intelligence.details.top10Concentration}%`} />
      )}

      <p className="rounded-sm border border-axiom-border bg-axiom-bg p-2 text-xs leading-5 text-axiom-muted mt-2">
        {intelligence.warnings && intelligence.warnings.length > 0 ? (
           <span className="text-red-400 font-bold block mb-1">Warnings:</span>
        ) : null}
        {intelligence.warnings?.map((w: string, i: number) => (
          <span key={i} className="block mb-1">• {w}</span>
        ))}
        {(!intelligence.warnings || intelligence.warnings.length === 0) && "No critical warnings detected."}
      </p>
    </div>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value)
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-axiom-muted">{label}</span>
      <span className="font-semibold text-axiom-text">{value}</span>
    </div>
  )
}
