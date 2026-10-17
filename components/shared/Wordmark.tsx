// TODO: replace with the official logo SVG once supplied.
/** Pass a tracking class to override the default wide letter spacing. */
export function Wordmark({ className = "tracking-[0.22em]" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap uppercase ${className}`}>
      <span className="font-normal">House of </span>
      <span className="font-bold">Bread</span>
    </span>
  );
}
