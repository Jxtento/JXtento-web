import React from 'react';

const STATIC_DATA = [
  // =========================
  // Existing
  // =========================
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "$BONK",

  "So11111111111111111111111111111111111111112",
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  "$WIF",

  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  "$SOL",

  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  "$ETH",

  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "$USDC",

  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "$PEPE",

  "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",
  "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  "$POPCAT",

  "7BGVGTRHRjzLyYJ3c6k18G4h2fR3gBw6a2VnEbxm8z3D",
  "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "$LINK",

  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  "$RAY",

  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "$JUP",

  // =========================
  // Solana
  // =========================

  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  "$USDT",

  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  "$BTC",

  "7vfCXTUXx5WZsM4QXWjK7P1NQ7A3r7J5jX7NwYgQ8sP",
  "$ETH",

  "orcaEKTdKb5J6v6Lh8rN2j6fQ6D7hLr9P5M9vQwL5Y",
  "$ORCA",

  "mSoLzYCxHdYgdzU2i3xQ6fJmM4w2d9LJ8h3n5F5vL9",
  "$MSOL",

  "bSo13r4TkiE4wM8R3JQJ1vX4S9uN8gL4K8M5M8s8V7",
  "$BSOL",

  "KMNo1XqfP4rJz4p4VwD7t3v4mM9Q4W4W8k5L5M4R3Y",
  "$KMNO",

  "MEW1gQW3S7F6XQ9Q8T5J6M7N8P9A2B3C4D5E6F7G8H",
  "$MEW",

  "PENGU11111111111111111111111111111111111",
  "$PENGU",

  "FWOG111111111111111111111111111111111111",
  "$FWOG",

  "FART111111111111111111111111111111111111",
  "$FARTCOIN",

  "AI16111111111111111111111111111111111111",
  "$AI16Z",

  // =========================
  // Robinhood Chain
  // =========================

  "$HOOD",
  "0x000000000000000000000000000000000000800A",

  "$RHBTC",
  "0xB5D85CBF2D0a9C97a3A1b4E4F51D33F8f6A6E7A1",

  "$RHETH",
  "0x4200000000000000000000000000000000000006",

  "$RHUSDC",
  "0x078D782b760474a361dDA0AF3839290b0EF57AD6",

  "$RHUSDT",
  "0x74b7F16337b8972027f6196a17A631ac6De26d22",

  "$RHBONK",
  "0x4D13E3F6A3fB2dBA6c4f7f7D4b8F93E15dD2E5A0",

  "$RHPEPE",
  "0x6982508145454Ce325dDbE47a25d4ec3d2311933"
];

export function AddressBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1] flex justify-center">
      <style>{`
        @keyframes scroll-bg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-bg {
          animation: scroll-bg linear infinite;
        }
      `}</style>

      {/* Container for scrolling rows */}
      <div className="flex flex-col gap-3 opacity-25 text-[var(--ink)] font-mono text-[12px] leading-none whitespace-nowrap min-w-[200vw] rotate-[-2deg] scale-110 -translate-y-12">
        {Array.from({ length: 40 }).map((_, i) => {
          // Shuffle slightly based on index so rows look different
          const offset = i * 7;
          const rowData = [
            ...STATIC_DATA.slice(offset % STATIC_DATA.length), 
            ...STATIC_DATA.slice(0, offset % STATIC_DATA.length),
            ...STATIC_DATA
          ];
          
          return (
            <div 
              key={i} 
              className="flex gap-4 animate-scroll-bg"
              style={{
                animationDuration: `${120 + (i % 5) * 30}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
              }}
            >
              {rowData.map((item, j) => (
                <span key={j}>{item}</span>
              ))}
              {/* Duplicate for seamless scrolling */}
              {rowData.map((item, j) => (
                <span key={`dup-${j}`}>{item}</span>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* Gradient masks to fade out the edges slightly without hiding too much */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--paper)] via-transparent to-[var(--paper)] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--paper)] via-transparent to-[var(--paper)] opacity-50" />
      <div className="absolute inset-0 bg-[var(--paper)] opacity-30" />
    </div>
  );
}
