"use client";
import { useEffect, useRef } from "react";

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const COL = { ink: "#0A0A0A", accent: "#E0210F", wallet: "#B7B1A6", edge: "#DAD5CA", paper: "#FBFAF7" };
    
    let nodes: any[] = [];
    let links: any[] = [];
    
    function build() {
      nodes = [];
      links = [];
      const N = 34;
      const centers = [[.30,.34], [.68,.40], [.46,.72]];
      for (let i = 0; i < N; i++) {
        const c = centers[i % centers.length];
        let type = "wallet";
        const roll = Math.random();
        if (i % centers.length === 0 && i < 3) type = "dev";
        else if (roll > 0.86) type = "smart";
        else if (roll > 0.80) type = "dev";
        
        const base = type === "dev" ? 11 : type === "smart" ? 8 : (4 + Math.random() * 6);
        nodes.push({
          cluster: i % centers.length,
          x: c[0] * W + (Math.random() - .5) * W * 0.22,
          y: c[1] * H + (Math.random() - .5) * H * 0.22,
          vx: 0, vy: 0,
          r: base,
          type: type
        });
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].cluster === nodes[j].cluster && Math.random() > 0.72) links.push([i, j]);
        }
      }
      for (let k = 0; k < 4; k++) {
        const a = Math.floor(Math.random() * nodes.length);
        const b = Math.floor(Math.random() * nodes.length);
        if (nodes[a].cluster !== nodes[b].cluster) links.push([a, b]);
      }
    }

    function step(settle: boolean) {
      const iters = settle ? 260 : 1;
      for (let it = 0; it < iters; it++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy || 0.01;
            const d = Math.sqrt(d2);
            const force = (a.cluster === b.cluster ? 900 : 1500) / d2;
            const fx = (dx / d) * force, fy = (dy / d) * force;
            a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
          }
        }
        for (const [i, j] of links) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const rest = a.cluster === b.cluster ? 58 : 150;
          const f = (d - rest) * 0.006;
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
        for (const n of nodes) {
          n.vx += ((W * 0.5) - n.x) * 0.0009;
          n.vy += ((H * 0.5) - n.y) * 0.0009;
          n.vx *= 0.86; n.vy *= 0.86;
          n.x += n.vx; n.y += n.vy;
          const pad = n.r + 8;
          n.x = Math.max(pad, Math.min(W - pad, n.x));
          n.y = Math.max(pad + 30, Math.min(H - pad, n.y));
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.lineWidth = 1;
      for (const [i, j] of links) {
        const a = nodes[i], b = nodes[j];
        const cross = a.cluster !== b.cluster;
        ctx!.strokeStyle = cross ? "rgba(224,33,15,.22)" : COL.edge;
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }
      for (const n of nodes) {
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.type === "dev") {
          ctx!.fillStyle = COL.paper; ctx!.fill();
          ctx!.lineWidth = 2; ctx!.strokeStyle = COL.accent; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(n.x, n.y, 2.4, 0, Math.PI * 2); ctx!.fillStyle = COL.accent; ctx!.fill();
        } else if (n.type === "smart") {
          ctx!.fillStyle = COL.ink; ctx!.fill();
        } else {
          ctx!.fillStyle = "rgba(251,250,247,.9)"; ctx!.fill();
          ctx!.lineWidth = 1.4; ctx!.strokeStyle = COL.wallet; ctx!.stroke();
        }
      }
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) { step(true); draw(); }
    }

    let raf: number;
    function loop() {
      step(false); draw(); raf = requestAnimationFrame(loop);
    }

    function onResize() {
      cancelAnimationFrame(raf);
      resize();
      if (!reduce) loop();
    }

    window.addEventListener("resize", onResize);
    resize();
    if (!reduce) { step(true); loop(); }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>;
}
