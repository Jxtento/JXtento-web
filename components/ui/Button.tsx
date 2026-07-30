import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'fill' | 'ghost';
  size?: 'default' | 'lg';
  href: string;
}

export function Button({ variant = 'fill', size = 'default', href, className = '', children, ...props }: ButtonProps) {
  const baseClasses = "font-mono tracking-[.08em] border border-[var(--ink)] transition-all duration-[.18s] cursor-pointer inline-flex items-center justify-center gap-2";
  
  const variants = {
    fill: "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--accent)] hover:border-[var(--accent)]",
    ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
  };

  const sizes = {
    default: "text-xs px-[18px] py-[9px]",
    lg: "text-[13px] px-[22px] py-[13px]"
  };

  return (
    <Link href={href} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
