import { Button } from "@/components/ui/Button";
import { MapCanvas } from "./MapCanvas";

export function Hero() {
  return (
    <header className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 md:py-[72px] pb-[60px] md:pb-[84px] grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-10 md:gap-[56px] items-center">
      <div>
        <span className="font-mono text-[11px] font-medium tracking-[.22em] uppercase text-[var(--muted)]">
          Solana trade intelligence
        </span>
        <h1 className="font-serif font-normal text-[clamp(48px,6.4vw,84px)] leading-[.98] tracking-[-.01em] my-[22px] mb-6">
          Read the <em className="italic text-[var(--accent)] not-italic">trench.</em>
        </h1>
        <p className="text-[18px] leading-[1.55] text-[#39352F] max-w-[44ch] mb-[32px]">
          JXTENTO maps every wallet, funding trail, and bundle on Solana in realtime. Trace where the money came from before you enter. Pure intelligence, zero execution.
        </p>
        <div className="flex gap-[14px] flex-wrap mb-[40px]">
          <Button href="#" size="lg">Launch terminal</Button>
          <Button href="#map" variant="ghost" size="lg">How it reads the chain</Button>
        </div>
        <div className="flex gap-0 border-t border-[var(--line)]">
          <div className="flex-1 py-4 border-r border-[var(--line)]">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">{"<400ms"}</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Funding trace</span>
          </div>
          <div className="flex-1 py-4 border-r border-[var(--line)] pl-4 md:pl-[24px]">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">Genesis</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Full chain index</span>
          </div>
          <div className="flex-1 py-4 pl-4 md:pl-[24px]">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">0</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Wallet connect</span>
          </div>
        </div>
      </div>

      <div className="relative border border-[var(--line-strong)] map-panel-bg aspect-[1/1.02] overflow-hidden w-full max-w-[460px] md:max-w-none mx-auto md:mx-0">
        <div className="absolute top-0 left-0 right-0 z-[3] flex justify-between items-center py-[12px] px-[14px] font-mono text-[10.5px] tracking-[.12em] uppercase text-[var(--muted)] border-b border-[var(--line)] bg-[rgba(251,250,247,.72)]">
          <span>funding_graph.live</span>
          <span className="inline-flex items-center gap-[7px] text-[var(--ink)] before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-[var(--accent)] before:animate-[pulse_1.6s_ease-in-out_infinite]">
            tracing
          </span>
        </div>
        <MapCanvas />
        <div className="absolute left-[14px] bottom-[12px] z-[3] flex gap-4 font-mono text-[10px] tracking-[.06em] text-[var(--muted)]">
          <span className="flex items-center"><i className="w-[9px] h-[9px] inline-block mr-[6px] rounded-full align-middle bg-transparent border-[1.5px] border-[var(--accent)] not-italic"></i>Dev / rugger</span>
          <span className="flex items-center"><i className="w-[9px] h-[9px] inline-block mr-[6px] rounded-full align-middle bg-[var(--ink)] not-italic"></i>Smart money</span>
          <span className="flex items-center"><i className="w-[9px] h-[9px] inline-block mr-[6px] rounded-full align-middle bg-transparent border-[1.5px] border-[#B7B1A6] not-italic"></i>Wallet</span>
        </div>
      </div>
    </header>
  );
}
