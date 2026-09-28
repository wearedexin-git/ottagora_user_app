import type { BrandIconProps } from "./types";

export function IconCourses({ size = 20, ...props }: BrandIconProps) {
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
      <rect
        x="23.44"
        y="19.36"
        width="5.67"
        height="23.62"
        transform="translate(-11.79 45.77) rotate(-70.86)"
      />
      <rect
        x="23.44"
        y="38.36"
        width="5.67"
        height="23.62"
        transform="translate(-29.74 58.55) rotate(-70.87)"
      />
      <path d="M82.44,5.42l-34.13,13.56L14.18,5.42.08,16.15v58.2l6.73,10.08,41.5,13.91,41.5-13.91,6.73-10.08V16.15l-14.1-10.73ZM8.08,71.92V20.12l7.35-5.59,29.98,11.91v62.49l-33.46-11.22-3.87-5.79ZM88.54,71.92l-3.87,5.79-33.6,11.27V26.5l30.12-11.97,7.35,5.59v51.81Z" />
      <rect
        x="57.73"
        y="28.33"
        width="23.62"
        height="5.67"
        transform="translate(-6.37 24.5) rotate(-19.12)"
      />
      <rect
        x="57.73"
        y="66.34"
        width="23.62"
        height="5.67"
        transform="translate(-18.83 26.61) rotate(-19.13)"
      />
      <rect
        x="57.73"
        y="47.33"
        width="23.62"
        height="5.67"
        transform="translate(-12.6 25.56) rotate(-19.13)"
      />
    </svg>
  );
}
