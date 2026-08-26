export function BrandMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="dasomel connected D mark">
      <rect width="64" height="64" rx="14" fill="#111c2e" />
      <path d="M22 16v32" stroke="#55b8db" strokeWidth="7" strokeLinecap="round" />
      <path d="M25 17c16 0 25 6 25 15s-9 15-25 15" fill="none" stroke="#72e3c3" strokeWidth="7" strokeLinecap="round" />
      <circle cx="49" cy="18" r="4.5" fill="#f0a35a" />
      <circle cx="49" cy="46" r="4" fill="#72e3c3" />
    </svg>
  );
}
