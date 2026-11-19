"use client";
import { Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
export function SearchForm({ query }: { query: string }) {
  return (
    <form
      action="/search"
      className="search-form"
      role="search"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const value = new FormData(form).get("q");
        trackEvent("search_submitted", { query: String(value ?? "").slice(0, 100) });
      }}
    >
      <label className="sr-only" htmlFor="site-search">
        Search resources
      </label>
      <Search size={22} />
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Try “paint”, “tile”, or “drywall”"
        maxLength={100}
      />
      <button type="submit">Search</button>
    </form>
  );
}
