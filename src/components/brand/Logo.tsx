import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="10" className="fill-primary" />
      <path
        d="M6 20.5v-7.2c0-.6.5-1.1 1.1-1.1h8.4c.6 0 1.1.5 1.1 1.1v7.2H6Z"
        className="fill-primary-foreground"
        opacity="0.95"
      />
      <path
        d="M17.6 14.6h4.1c.4 0 .8.2 1 .5l2.1 3c.1.2.2.4.2.6v1.8h-7.4v-5.9Z"
        className="fill-primary-foreground"
        opacity="0.6"
      />
      <circle cx="11" cy="21.6" r="2.2" className="fill-primary-foreground" />
      <circle cx="21.5" cy="21.6" r="2.2" className="fill-primary-foreground" />
      <circle cx="11" cy="21.6" r="0.9" className="fill-primary" />
      <circle cx="21.5" cy="21.6" r="0.9" className="fill-primary" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="font-display text-[1.0625rem] font-bold tracking-[-0.03em] text-foreground">
          MoveGrid
        </span>
      )}
    </span>
  );
}
