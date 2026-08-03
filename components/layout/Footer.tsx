import Link from "next/link";
import { FOOTER_LINKS } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-[38px] pb-[46px]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex justify-between items-center flex-wrap gap-[18px]">
        <div className="font-mono font-semibold text-[14px] tracking-[.34em] pl-[.34em]">
          JXTENT<span className="text-[var(--accent)]">O</span>
        </div>
        <div className="flex flex-wrap gap-[26px] font-mono text-[11.5px] tracking-[.06em] text-[var(--muted)]">
          {FOOTER_LINKS.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-[var(--ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="font-mono text-[11px] text-[var(--muted)] tracking-[.03em]">
          Not affiliated with any exchange. Intelligence only.
        </div>
      </div>
    </footer>
  );
}
