"use client";

import { useId } from "react";

/**
 * Pattern brand 2/2 (da Pattern.pdf del cliente, pagina 2): chevron/zigzag.
 * Geometria esatta estratta dal vettoriale del PDF (pdftocairo), tile 250x156.
 * Colori legati ai token: accent = giallo, background = neutro chiaro.
 */
export function ChevronPattern({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const p = (s: string) => `${s}-${id}`;

  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={p("clip-1")}>
          <path d="M 125 136 L 250 136 L 250 156 L 125 156 Z M 125 136" />
        </clipPath>
        <clipPath id={p("clip-2")}>
          <path d="M 125 155 L 250 155 L 250 156 L 125 156 Z M 125 155" />
        </clipPath>
        <clipPath id={p("clip-3")}>
          <path d="M 0 136 L 1 136 L 1 156 L 0 156 Z M 0 136" />
        </clipPath>
        <clipPath id={p("clip-4")}>
          <path d="M 0 155 L 1 155 L 1 156 L 0 156 Z M 0 155" />
        </clipPath>
        <clipPath id={p("clip-5")}>
          <path d="M 249 19 L 250 19 L 250 98 L 249 98 Z M 249 19" />
        </clipPath>
        <clipPath id={p("clip-6")}>
          <path d="M 249 19 L 250 19 L 250 79 L 249 79 Z M 249 19" />
        </clipPath>
        <clipPath id={p("clip-7")}>
          <path d="M 249 97 L 250 97 L 250 156 L 249 156 Z M 249 97" />
        </clipPath>
        <clipPath id={p("clip-8")}>
          <path d="M 125 58 L 250 58 L 250 137 L 125 137 Z M 125 58" />
        </clipPath>
        <clipPath id={p("clip-9")}>
          <path d="M 125 78 L 250 78 L 250 137 L 125 137 Z M 125 78" />
        </clipPath>
        <clipPath id={p("clip-10")}>
          <path d="M 125 0 L 250 0 L 250 59 L 125 59 Z M 125 0" />
        </clipPath>
        <clipPath id={p("clip-11")}>
          <path d="M 0 19 L 125 19 L 125 98 L 0 98 Z M 0 19" />
        </clipPath>
        <clipPath id={p("clip-12")}>
          <path d="M 0 19 L 125 19 L 125 79 L 0 79 Z M 0 19" />
        </clipPath>
        <clipPath id={p("clip-13")}>
          <path d="M 0 97 L 125 97 L 125 156 L 0 156 Z M 0 97" />
        </clipPath>
        <clipPath id={p("clip-14")}>
          <path d="M 0 58 L 1 58 L 1 137 L 0 137 Z M 0 58" />
        </clipPath>
        <clipPath id={p("clip-15")}>
          <path d="M 0 78 L 1 78 L 1 137 L 0 137 Z M 0 78" />
        </clipPath>
        <clipPath id={p("clip-16")}>
          <path d="M 0 0 L 1 0 L 1 59 L 0 59 Z M 0 0" />
        </clipPath>
        <clipPath id={p("clip-17")}>
          <path d="M 249 0 L 250 0 L 250 20 L 249 20 Z M 249 0" />
        </clipPath>
        <clipPath id={p("clip-18")}>
          <path d="M 249 0 L 250 0 L 250 1 L 249 1 Z M 249 0" />
        </clipPath>
        <clipPath id={p("clip-19")}>
          <path d="M 0 0 L 125 0 L 125 20 L 0 20 Z M 0 0" />
        </clipPath>
        <clipPath id={p("clip-20")}>
          <path d="M 0 0 L 125 0 L 125 1 L 0 1 Z M 0 0" />
        </clipPath>
        <pattern id={p("chevron-pattern")} patternUnits="userSpaceOnUse" width="250" height="156">
          <g clipPath={`url(#${p("clip-1")})`}>
            <path fill="var(--accent)" d="M 125 136.414062 L 250.691406 136.414062 L 250.691406 214.480469 L 125 155.941406 Z M 125 136.414062" />
          </g>
          <g clipPath={`url(#${p("clip-2")})`}>
            <path fill="var(--background)" d="M 125 175.449219 L 125 155.941406 L 250.691406 214.480469 L 125 214.480469 Z M 125 175.449219" />
          </g>
          <g clipPath={`url(#${p("clip-3")})`}>
            <path fill="var(--accent)" d="M -125 136.414062 L 0.691406 136.414062 L 0.691406 214.480469 L -125 155.941406 Z M -125 136.414062" />
          </g>
          <g clipPath={`url(#${p("clip-4")})`}>
            <path fill="var(--background)" d="M -125 175.449219 L -125 155.941406 L 0.691406 214.480469 L -125 214.480469 Z M -125 175.449219" />
          </g>
          <g clipPath={`url(#${p("clip-5")})`}>
            <path fill="var(--accent)" d="M 375 97.515625 L 249.308594 97.515625 L 249.308594 19.449219 L 375 78.007812 Z M 375 97.515625" />
          </g>
          <g clipPath={`url(#${p("clip-6")})`}>
            <path fill="var(--background)" d="M 375 78.007812 L 249.308594 19.449219 L 375 19.449219 Z M 375 78.007812" />
          </g>
          <g clipPath={`url(#${p("clip-7")})`}>
            <path fill="var(--accent)" d="M 375 175.582031 L 249.308594 175.582031 L 249.308594 97.515625 L 375 156.074219 Z M 375 175.582031" />
            <path fill="var(--background)" d="M 375 156.074219 L 249.308594 97.515625 L 375 97.515625 Z M 375 156.074219" />
          </g>
          <g clipPath={`url(#${p("clip-8")})`}>
            <path fill="var(--accent)" d="M 125 58.480469 L 250.691406 58.480469 L 250.691406 136.550781 L 125 78.007812 Z M 125 58.480469" />
          </g>
          <g clipPath={`url(#${p("clip-9")})`}>
            <path fill="var(--background)" d="M 125 136.550781 L 125 78.007812 L 250.691406 136.550781 Z M 125 136.550781" />
          </g>
          <g clipPath={`url(#${p("clip-10")})`}>
            <path fill="var(--accent)" d="M 125 -19.585938 L 250.691406 -19.585938 L 250.691406 58.480469 L 125 -0.0585938 Z M 125 -19.585938" />
            <path fill="var(--background)" d="M 125 19.449219 L 125 -0.0585938 L 250.691406 58.480469 L 125 58.480469 Z M 125 19.449219" />
          </g>
          <g clipPath={`url(#${p("clip-11")})`}>
            <path fill="var(--accent)" d="M 125 97.515625 L -0.691406 97.515625 L -0.691406 19.449219 L 125 78.007812 Z M 125 97.515625" />
          </g>
          <g clipPath={`url(#${p("clip-12")})`}>
            <path fill="var(--background)" d="M 125 78.007812 L -0.691406 19.449219 L 125 19.449219 Z M 125 78.007812" />
          </g>
          <g clipPath={`url(#${p("clip-13")})`}>
            <path fill="var(--accent)" d="M 125 175.582031 L -0.691406 175.582031 L -0.691406 97.515625 L 125 156.074219 Z M 125 175.582031" />
            <path fill="var(--background)" d="M 125 156.074219 L -0.691406 97.515625 L 125 97.515625 Z M 125 156.074219" />
          </g>
          <g clipPath={`url(#${p("clip-14")})`}>
            <path fill="var(--accent)" d="M -125 58.480469 L 0.691406 58.480469 L 0.691406 136.550781 L -125 78.007812 Z M -125 58.480469" />
          </g>
          <g clipPath={`url(#${p("clip-15")})`}>
            <path fill="var(--background)" d="M -125 136.550781 L -125 78.007812 L 0.691406 136.550781 Z M -125 136.550781" />
          </g>
          <g clipPath={`url(#${p("clip-16")})`}>
            <path fill="var(--accent)" d="M -125 -19.585938 L 0.691406 -19.585938 L 0.691406 58.480469 L -125 -0.0585938 Z M -125 -19.585938" />
            <path fill="var(--background)" d="M -125 19.449219 L -125 -0.0585938 L 0.691406 58.480469 L -125 58.480469 Z M -125 19.449219" />
          </g>
          <g clipPath={`url(#${p("clip-17")})`}>
            <path fill="var(--accent)" d="M 375 19.582031 L 249.308594 19.582031 L 249.308594 -58.484375 L 375 0.0742188 Z M 375 19.582031" />
          </g>
          <g clipPath={`url(#${p("clip-18")})`}>
            <path fill="var(--background)" d="M 375 0.078125 L 249.308594 -58.484375 L 375 -58.484375 Z M 375 0.078125" />
          </g>
          <g clipPath={`url(#${p("clip-19")})`}>
            <path fill="var(--accent)" d="M 125 19.582031 L -0.691406 19.582031 L -0.691406 -58.484375 L 125 0.0742188 Z M 125 19.582031" />
          </g>
          <g clipPath={`url(#${p("clip-20")})`}>
            <path fill="var(--background)" d="M 125 0.078125 L -0.691406 -58.484375 L 125 -58.484375 Z M 125 0.078125" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${p("chevron-pattern")})`} />
    </svg>
  );
}
