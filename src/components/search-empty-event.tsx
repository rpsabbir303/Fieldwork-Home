"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
export function SearchEmptyEvent({ query }: { query: string }) {
  useEffect(() => {
    trackEvent("search_no_results", { query });
  }, [query]);
  return null;
}
