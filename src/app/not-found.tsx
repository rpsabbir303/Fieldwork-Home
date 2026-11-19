import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container page-content">
      <div className="empty-state">
        <p className="eyebrow">Page not found</p>
        <h1>That resource is not here.</h1>
        <p>It may have moved or be a draft. Search the library or start from the homepage.</p>
        <Link className="button button-primary" href="/">
          Go home
        </Link>{" "}
        <Link className="button button-quiet" href="/search">
          Search resources
        </Link>
      </div>
    </main>
  );
}
