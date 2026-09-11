import { cn } from "@/lib/utils";

/**
 * Presentation-only Scentlyn wordmark.
 * Business/legal naming stays in shop-data and metadata.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.6rem] font-medium italic leading-none tracking-[0.06em] text-brand sm:text-[1.9rem]",
        className,
      )}
    >
      Scentlyn
    </span>
  );
}
