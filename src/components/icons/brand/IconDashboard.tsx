import type { BrandIconProps } from "./types";

export function IconDashboard({ size = 20, ...props }: BrandIconProps) {
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
      <path d="M85.93,97.96H10.68L0,87.33v-49.11l3.87-8.08L41.11.09,54.32,0l38.31,30.1,3.98,8.17v49.06l-10.68,10.63ZM13.99,89.96h68.64l5.99-5.96v-43.89l-2.36-4.85L51.58,8.02l-7.62.05L10.3,35.23l-2.3,4.81v43.97l5.99,5.96Z" />
      <rect x="19.04" y="70.76" width="58.86" height="5.67" />
    </svg>
  );
}
