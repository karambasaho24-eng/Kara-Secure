import Link from "next/link";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border"
        style={{ borderColor: "var(--color-gold)" }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "var(--color-gold)" }}
        />
      </span>
      <span
        className="font-display text-[15px] tracking-[0.04em]"
        style={{ color: "var(--color-text)" }}
      >
        KARA <span style={{ color: "var(--color-gold)" }}>SECURE</span>
      </span>
    </Link>
  );
}
