import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const els = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            const idx = Number(target.dataset.revealIndex || 0);
            target.style.transitionDelay = `${Math.min(idx, 8) * 80}ms`;
            target.classList.add("is-visible");
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((node, i) => {
      node.dataset.revealIndex = String(i);
      io.observe(node);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}
