// TODO: replace with the official logo SVG once supplied.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`uppercase tracking-[0.22em] ${className}`}>
      <span className="font-normal">House of </span>
      <span className="font-bold">Bread</span>
    </span>
  );
}
