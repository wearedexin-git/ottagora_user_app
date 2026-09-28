import type { BrandIconProps } from "./types";

export function IconEvents({ size = 20, ...props }: BrandIconProps) {
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
      <path d="M77.88,6.99h-10.4V0h-5.67v6.99h-27.79V0h-5.67v6.99h-9.83L-.09,24.02v56.91l18.63,17.03h59.35l18.63-17.03V24.02l-18.63-17.03ZM21.64,14.99h6.72v9.11h5.67v-9.11h27.79v10.74h5.67v-10.74h7.29l13.73,12.56v11.56H7.91v-11.56l13.73-12.56ZM74.78,89.96H21.64l-13.73-12.56v-32.63h80.61v32.63l-13.73,12.56Z" />
    </svg>
  );
}
