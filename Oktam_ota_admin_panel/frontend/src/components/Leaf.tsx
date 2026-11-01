export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`leaf ${className}`}
      viewBox="0 0 100 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M16 144C45 105 65 68 78 8M26 128C5 115 8 95 8 95s25 7 18 33Zm10-16c3-25 30-24 30-24s-6 25-30 24Zm10-23c-24-12-23-33-23-33s25 12 23 33Zm10-20c4-26 33-27 33-27s-9 26-33 27Zm10-27C48 29 54 9 54 9s17 9 12 33ZM78 8c-5 13 2 26 2 26S96 10 91 1Z" />
    </svg>
  );
}
