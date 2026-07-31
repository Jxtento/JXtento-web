import Link from "next/link";
import Image from "next/image";
import { NAVIGATION_LINKS } from "@/constants";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(251,250,247,.82)] backdrop-blur-[10px] border-b border-[var(--line)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo-jxtento.png" alt="JXtento Logo" fill className="object-contain" />
          </div>
          <div className="font-mono font-semibold text-base tracking-[.34em]">
            JXTENT<span className="text-[var(--accent)]">O</span>
          </div>
        </Link>
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
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-mono tracking-widest uppercase rounded-full border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              SOL Access
            </span>
            <Button href="/terminal">Launch terminal</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
