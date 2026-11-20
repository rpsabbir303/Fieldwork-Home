import "server-only";
import { SignJWT, importPKCS8 } from "jose";

export const ga4Configured = Boolean(process.env.GA4_PROPERTY_ID && process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY);
let tokenCache: { token: string; expires: number } | null = null;

async function accessToken() {
  if (tokenCache && tokenCache.expires > Date.now() + 60_000) return tokenCache.token;
  const email = process.env.GA4_CLIENT_EMAIL!;
  const key = await importPKCS8(process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, "\n"), "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/analytics.readonly" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" }).setIssuer(email)
    .setAudience("https://oauth2.googleapis.com/token").setIssuedAt(now).setExpirationTime(now + 3600).sign(key);
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }), cache: "no-store" });
  if (!response.ok) throw new Error(`GA4 authentication failed (${response.status}).`);
  const data = await response.json() as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
export async function runGa4Report(dimensions: string[], metrics: string[], startDate: string, endDate: string, limit = 100) {
  if (!ga4Configured) throw new Error("GA4 is not configured.");
  const token = await accessToken();
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(process.env.GA4_PROPERTY_ID!)}:runReport`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ dateRanges: [{ startDate, endDate }], dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })), limit }),
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`GA4 Data API returned ${response.status}. Check property access and credentials.`);
  return await response.json() as { rows?: GaRow[]; rowCount?: number; metadata?: { timeZone?: string } };
}

export function analyticsDates(period: string) {
  const days = ({ today: 0, "7d": 6, "14d": 13, "30d": 29, "90d": 89 } as Record<string, number>)[period] ?? 29;
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10), days };
}
