import React from "react";

import { XIcon } from "@/components/assets/icons/XIcon";
import { TerminalIcon } from "@/components/assets/icons/TerminalIcon";
import { AxiomIcon } from "@/components/assets/icons/AxiomIcon";
import { GmgnIcon } from "@/components/assets/icons/GmgnIcon";

const PLATFORMS = [
  { id: "axiom", name: "Axiom", label: "Analytics & Data", Icon: AxiomIcon, noFrame: true },
  { id: "gmgn", name: "GMGN.ai", label: "Onchain Intel", Icon: GmgnIcon },
  { id: "x", name: "X (Twitter)", label: "Social Graph", Icon: XIcon },
  { id: "terminal", name: "Pump.fun", label: "Trading Terminal", Icon: TerminalIcon, noFrame: true },
];

export function PlatformShowcase() {
  return (
    <div className="relative w-full h-full flex flex-col justify-center min-h-[400px]">
      <style>{`
        @keyframes float-tilt {
          0%, 100% { transform: translateY(0px) rotate(var(--start-rot, -2deg)); }
          50% { transform: translateY(var(--float-y, -12px)) rotate(var(--end-rot, 2deg)); }
        }
        .animate-float-tilt {
          animation: float-tilt var(--float-dur, 4s) ease-in-out infinite;
        }
      `}</style>

      {/* Header label */}
      <p className="font-mono text-[10px] tracking-[.18em] uppercase text-[var(--muted)] mb-8 text-center md:text-left" style={{ textShadow: '0 0 4px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff' }}>
        Scan anywhere you trade
      </p>

      {/* Platform cards */}
      <div className="flex flex-col gap-5 relative">
        {PLATFORMS.map((platform, i) => {
          // Generate pseudo-random styles based on index for the floating effect
          const rotations = ["-4deg", "3deg", "-2deg", "5deg"];
          const endRotations = ["1deg", "-2deg", "4deg", "-1deg"];
          const margins = ["ml-[10%]", "ml-0", "ml-[5%]", "ml-[15%]"];
          const durations = ["4s", "5s", "4.5s", "5.5s"];
          const delays = ["0s", "-1s", "-2s", "-3s"];

          const customStyle = {
            "--start-rot": rotations[i % 4],
            "--end-rot": endRotations[i % 4],
            "--float-dur": durations[i % 4],
            "--float-y": i % 2 === 0 ? "-12px" : "-16px",
            animationDelay: delays[i % 4]
          } as React.CSSProperties;

          return (
            <div
              key={platform.id}
              className={`animate-float-tilt ${margins[i % 4]} w-[85%] sm:w-[75%] md:w-[85%] group flex items-center gap-4 p-4 border border-[#2A2825] bg-[#161513] hover:border-[#3A3835] hover:bg-[#1E1D1A] transition-colors duration-200 shadow-lg`}
              style={customStyle}
            >
              {/* Platform icon */}
              <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center ${platform.noFrame ? '' : 'border border-[#3A3835] bg-[#22201D] text-white'}`}>
                <platform.Icon className={platform.noFrame ? "w-8 h-8" : "w-5 h-5 text-white"} aria-hidden="true" />
              </div>

              {/* Platform info */}
              <div className="flex-1 min-w-0">
                <span className="block font-mono text-[13px] font-semibold text-white leading-tight">
                  {platform.name}
                </span>
                <span className="block font-mono text-[10px] tracking-[.08em] uppercase text-[#8B867D] mt-[2px]">
                  {platform.label}
                </span>
              </div>

              {/* Live badge */}
              <span className="flex-shrink-0 inline-flex items-center gap-[5px] font-mono text-[9px] tracking-[.14em] uppercase text-[var(--accent)]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] animate-pulse" />
                live
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="font-mono text-[9.5px] tracking-[.1em] uppercase text-[var(--muted)] mt-10 text-center md:text-left" style={{ textShadow: '0 0 4px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff' }}>
        No wallet connection required — read-only intelligence
      </p>
    </div>
  );
}
