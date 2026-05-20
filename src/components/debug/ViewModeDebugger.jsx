// TEMPORARY DEBUG COMPONENT — remove when no longer needed.
// Shows the active Tailwind breakpoint plus the live viewport width.

import { useEffect, useState } from 'react';

export default function ViewModeDebugger() {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setWidth(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-3 right-3 z-[9999] flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 font-mono text-xs font-semibold text-white shadow-lg backdrop-blur"
    >
      <span className="inline-block sm:hidden">xs (&lt;640)</span>
      <span className="hidden sm:inline-block md:hidden">sm (640–767)</span>
      <span className="hidden md:inline-block lg:hidden">md (768–1023)</span>
      <span className="hidden lg:inline-block xl:hidden">lg (1024–1279)</span>
      <span className="hidden xl:inline-block 2xl:hidden">xl (1280–1535)</span>
      <span className="hidden 2xl:inline-block">2xl (≥1536)</span>
      <span className="opacity-60">·</span>
      <span>{width}px</span>
    </div>
  );
}
