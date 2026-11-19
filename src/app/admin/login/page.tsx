import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { getAdmin } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const ready =
    databaseConfigured &&
    Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
  return (
    <main className="admin-login">
      <div className="login-card">
        <p className="eyebrow">Fieldwork Home / Editorial</p>
        <h1>Admin sign in</h1>
        <p>Access the content workspace with an administrator account.</p>
        {!ready ? (
          <div className="admin-error">
            <strong>CMS setup required.</strong> Configure PostgreSQL, run the database migration
            and admin creation command, and set a 32-character SESSION_SECRET. See README.md for
            exact steps.
          </div>
        ) : (
          <form action={loginAction}>
            <label>
              Email
              <input type="email" name="email" required autoComplete="username" />
            </label>
            <label>
              Password
              <input type="password" name="password" required autoComplete="current-password" />
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error === "setup"
                  ? "CMS configuration is incomplete."
                  : "Email or password was not accepted."}
              </p>
            )}
            <button className="button button-primary" type="submit">
              Sign in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
