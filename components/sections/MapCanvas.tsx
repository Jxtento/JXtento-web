"use client";
import { useEffect, useRef } from "react";

type NodeType = "dev" | "smart" | "wallet";

interface MapNode {
  cluster: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  type: NodeType;
  floatAngle: number;
  floatSpeed: number;
  floatRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
}

// Single neon accent color: red
const NEON_RED: [number, number, number] = [224, 33, 15];

interface Photon {
  linkIdx: number;
  progress: number; // 0 → 1
  speed: number;
  isCross: boolean;
}

type MapLink = [number, number];

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const COL = { ink: "#0A0A0A", accent: "#E0210F", wallet: "#B7B1A6", edge: "#DAD5CA", paper: "#FBFAF7" };

    let nodes: MapNode[] = [];
    let links: MapLink[] = [];
    let photons: Photon[] = [];

    function build() {
      nodes = [];
      links = [];
      photons = [];
      const N = 40;
      const centers = [[0.30, 0.34], [0.68, 0.40], [0.46, 0.72]];
      const devNodes: Record<number, number> = {};

      for (let i = 0; i < N; i++) {
        const clusterId = i % centers.length;
        const c = centers[clusterId];
        let type: NodeType = "wallet";
        const roll = Math.random();
        if (devNodes[clusterId] === undefined) { type = "dev"; }
        else if (roll > 0.8) { type = "smart"; }
        const base = type === "dev" ? 11 : type === "smart" ? 8 : (4 + Math.random() * 6);
        nodes.push({
          cluster: clusterId,
          x: c[0] * W + (Math.random() - 0.5) * W * 0.22,
          y: c[1] * H + (Math.random() - 0.5) * H * 0.22,
          vx: 0, vy: 0,
          r: base, type,
          floatAngle: Math.random() * Math.PI * 2,
          floatSpeed: 0.008 + Math.random() * 0.012,
          floatRadius: 1.5 + Math.random() * 2.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03 + Math.random() * 0.02,
        });
        if (type === "dev" && devNodes[clusterId] === undefined) {
          devNodes[clusterId] = i;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const devIdx = devNodes[nodes[i].cluster];
        if (i !== devIdx) links.push([i, devIdx]);
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].cluster === nodes[j].cluster && Math.random() > 0.65) {
            links.push([i, j]);
          }
        }
      }
      const devIndices = Object.values(devNodes);
      for (let i = 0; i < devIndices.length; i++) {
        links.push([devIndices[i], devIndices[(i + 1) % devIndices.length]]);
      }
      for (let k = 0; k < 8; k++) {
        const a = Math.floor(Math.random() * nodes.length);
        const b = Math.floor(Math.random() * nodes.length);
        if (nodes[a].cluster !== nodes[b].cluster) links.push([a, b]);
      }

      // Spawn a small, fixed number of photons on random links
      spawnPhotons();
    }

    function spawnPhotons() {
      while (photons.length < 7) {
        const linkIdx = Math.floor(Math.random() * links.length);
        const [a, b] = links[linkIdx];
        const isCross = nodes[a].cluster !== nodes[b].cluster;
        photons.push({
          linkIdx,
          progress: Math.random(),
          speed: isCross ? 0.004 + Math.random() * 0.003 : 0.006 + Math.random() * 0.004,
          isCross,
        });
      }
    }

    function settle() {
      for (let it = 0; it < 300; it++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy || 0.01;
            const d = Math.sqrt(d2);
            const force = (a.cluster === b.cluster ? 1200 : 1800) / d2;
            const fx = (dx / d) * force, fy = (dy / d) * force;
            a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
          }
        }
        for (const [i, j] of links) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const rest = a.cluster === b.cluster ? 65 : 160;
          const f = (d - rest) * 0.005;
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
        for (const n of nodes) {
          n.vx += ((W * 0.5) - n.x) * 0.0025;
          n.vy += ((H * 0.5) - n.y) * 0.0025;
          n.vx *= 0.82; n.vy *= 0.82;
          n.x += n.vx; n.y += n.vy;
          const pad = n.r + 40;
          n.x = Math.max(pad, Math.min(W - pad, n.x));
          n.y = Math.max(pad + 40, Math.min(H - pad, n.y));
        }
      }
      for (const n of nodes) { n.vx = 0; n.vy = 0; }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // --- Advance nodes' float & pulse ---
      for (const n of nodes) {
        n.floatAngle += n.floatSpeed;
        n.pulsePhase += n.pulseSpeed;
      }

      // Helper to get current visual position of a node
      const pos = (n: MapNode) => ({
        x: n.x + Math.cos(n.floatAngle) * n.floatRadius,
        y: n.y + Math.sin(n.floatAngle) * n.floatRadius,
      });

      // --- Draw static edges ---
      ctx!.setLineDash([]);
      for (const [i, j] of links) {
        const a = pos(nodes[i]), b = pos(nodes[j]);
        const cross = nodes[i].cluster !== nodes[j].cluster;
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = cross ? "rgba(224,33,15,.12)" : "rgba(228,224,216,.75)";
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }

      // --- Advance and draw photons (neon cyber bubble effect) ---
      const deadIndices: number[] = [];
      for (let p = 0; p < photons.length; p++) {
        const ph = photons[p];
        ph.progress += ph.speed;

        if (ph.progress > 1) {
          deadIndices.push(p);
          continue;
        }

        const [ai, bi] = links[ph.linkIdx];
        const a = pos(nodes[ai]), b = pos(nodes[bi]);
        const t = ph.progress;
        const [r, g, b2] = NEON_RED;

        // Fade in/out near the endpoints
        const edgeFade = Math.min(1, Math.min(t, 1 - t) * 8);

        // Current position
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;

        // Layer 1: Wide soft bloom (neon haze)
        const bloom = ctx!.createRadialGradient(px, py, 0, px, py, 22);
        bloom.addColorStop(0,   `rgba(${r},${g},${b2},${(0.28 * edgeFade).toFixed(2)})`);
        bloom.addColorStop(0.5, `rgba(${r},${g},${b2},${(0.09 * edgeFade).toFixed(2)})`);
        bloom.addColorStop(1,   `rgba(${r},${g},${b2},0)`);
        ctx!.fillStyle = bloom;
        ctx!.beginPath(); ctx!.arc(px, py, 22, 0, Math.PI * 2); ctx!.fill();

        // Layer 2: Medium glow ring
        const mid = ctx!.createRadialGradient(px, py, 0, px, py, 9);
        mid.addColorStop(0,   `rgba(${r},${g},${b2},${(0.9 * edgeFade).toFixed(2)})`);
        mid.addColorStop(0.5, `rgba(${r},${g},${b2},${(0.45 * edgeFade).toFixed(2)})`);
        mid.addColorStop(1,   `rgba(${r},${g},${b2},0)`);
        ctx!.fillStyle = mid;
        ctx!.beginPath(); ctx!.arc(px, py, 9, 0, Math.PI * 2); ctx!.fill();

        // Layer 3: Bright neon core bubble
        const core = ctx!.createRadialGradient(px, py, 0, px, py, 3.5);
        core.addColorStop(0,   `rgba(255,255,255,${(1.0 * edgeFade).toFixed(2)})`);
        core.addColorStop(0.4, `rgba(${r},${g},${b2},${(1.0 * edgeFade).toFixed(2)})`);
        core.addColorStop(1,   `rgba(${r},${g},${b2},0)`);
        ctx!.fillStyle = core;
        ctx!.beginPath(); ctx!.arc(px, py, 3.5, 0, Math.PI * 2); ctx!.fill();
      }

      // Remove finished photons (in reverse order) and respawn
      for (let k = deadIndices.length - 1; k >= 0; k--) {
        photons.splice(deadIndices[k], 1);
      }
      spawnPhotons();

      // --- Draw nodes ---
      ctx!.setLineDash([]);
      for (const n of nodes) {
        const { x, y } = pos(n);
        const pulseScale = 1 + Math.sin(n.pulsePhase) * 0.07;
        const r = n.r * pulseScale;

        ctx!.beginPath(); ctx!.arc(x, y, r, 0, Math.PI * 2);
        if (n.type === "dev") {
          ctx!.fillStyle = COL.paper; ctx!.fill();
          ctx!.lineWidth = 2; ctx!.strokeStyle = COL.accent; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(x, y, 2.4 * pulseScale, 0, Math.PI * 2);
          ctx!.fillStyle = COL.accent; ctx!.fill();
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
      if (!reduce) settle();
      draw();
    }

    let raf: number;
    function loop() { draw(); raf = requestAnimationFrame(loop); }

    function onResize() {
      cancelAnimationFrame(raf);
      resize();
      if (!reduce) loop();
    }

    window.addEventListener("resize", onResize);
    resize();
    if (!reduce) loop();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>;
}
