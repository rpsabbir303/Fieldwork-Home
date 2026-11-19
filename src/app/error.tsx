"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container page-content">
      <div className="empty-state" role="alert">
        <p className="eyebrow">Temporary problem</p>
        <h1>This resource is unavailable.</h1>
        <p>
          Please try again. If the problem continues, the site owner should check the database
          connection.
        </p>
        <button type="button" className="button button-primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
