"use client";

import { useId } from "react";

/**
 * Pattern brand 1/2 (da Pattern.pdf del cliente, pagina 1): strisce diagonali.
 * Geometria esatta estratta dal vettoriale del PDF (pdftocairo), tile 75x117.
 * Colori legati ai token: ink = marrone, primary = arancio.
 */
export function DiagonalPattern({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const patternId = `diagonal-pattern-${id}`;

  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="75" height="117">
          <path fill="var(--ink)" d="M 51.550781 117 L 0 117 L 0 0 L 75 0 L 75 59.148438 Z" />
          <path fill="var(--primary)" d="M 75 117 L 51.550781 117 L 75 59.148438 Z" />
          <path fill="var(--primary)" d="M 0 0 L 23.976562 0 L 0 59.148438 Z" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
