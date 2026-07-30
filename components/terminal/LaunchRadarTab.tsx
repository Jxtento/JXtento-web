import { LaunchPanel } from "./LaunchPanel";

export function LaunchRadarTab() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-axiom-border/10">
        <h2 className="text-sm font-semibold text-axiom-text">Launch Radar</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-axiom-good animate-pulse shadow-[0_0_8px_rgba(11,122,59,0.6)]" />
          <span className="text-xs text-axiom-muted">Ready</span>
        </div>
      </div>

      <div className="-mx-4 border-b border-axiom-border pb-4 mb-4">
        <LaunchPanel />
      </div>
    </div>
  );
}
