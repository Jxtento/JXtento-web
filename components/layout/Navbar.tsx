import Link from "next/link";
import { NAVIGATION_LINKS } from "@/constants";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(251,250,247,.82)] backdrop-blur-[10px] border-b border-[var(--line)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="font-mono font-semibold text-base tracking-[.34em] pl-[.34em]">
          JXTENT<span className="text-[var(--accent)]">O</span>
        </div>
        <div className="flex items-center gap-[34px]">
          {NAVIGATION_LINKS.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              className="hidden max-[860px]:hidden min-[861px]:inline-block font-mono text-xs tracking-[.08em] text-[var(--muted)] transition-colors duration-[.18s] hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
          <Button href="#">Launch terminal</Button>
        </div>
      </div>
    </nav>
  );
}
