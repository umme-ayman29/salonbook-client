type LogoProps = {
  size?: number;
  textClassName?: string;
};

export default function Logo({
  size = 40,
  textClassName = "text-rose-600",
}: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* background circle */}
        <circle cx="32" cy="32" r="30" fill="#e11d48" />
        <circle cx="32" cy="32" r="26" stroke="#fecdd3" strokeWidth="1.5" />

        {/* scissor blades */}
        <path
          d="M20 14 L36 38"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M44 14 L28 38"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* pivot */}
        <circle cx="32" cy="29" r="2.2" fill="#e11d48" />

        {/* scissor handles */}
        <circle
          cx="25"
          cy="46"
          r="6.5"
          stroke="#ffffff"
          strokeWidth="3.5"
        />
        <circle
          cx="39"
          cy="46"
          r="6.5"
          stroke="#ffffff"
          strokeWidth="3.5"
        />

        {/* sparkle */}
        <path
          d="M50 10 L51.6 14.4 L56 16 L51.6 17.6 L50 22 L48.4 17.6 L44 16 L48.4 14.4 Z"
          fill="#fde68a"
        />
      </svg>
      <span className={`text-2xl font-bold tracking-tight ${textClassName}`}>
        SalonBook
      </span>
    </span>
  );
}