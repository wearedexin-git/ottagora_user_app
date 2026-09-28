import type { BrandIconProps } from "./types";

export function IconProfile({ size = 20, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96.61 97.96"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <polygon points="84.54 97.96 76.54 97.96 76.54 64.25 66.61 54.32 30 54.32 20.06 64.25 20.06 97.96 12.06 97.96 12.06 60.94 26.69 46.32 69.92 46.32 84.54 60.94 84.54 97.96" />
      <path d="M55.79,36.14h-14.97l-10.59-10.59v-14.97L40.82,0h14.97l10.59,10.59v14.97l-10.59,10.59ZM44.63,26.96h7.36l5.2-5.2v-7.36l-5.2-5.2h-7.36l-5.2,5.2v7.36l5.2,5.2Z" />
    </svg>
  );
}
