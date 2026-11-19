"use client";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
export function TrackedLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("guide_clicked", { path: href })}
    >
      {children}
    </Link>
  );
}
