# Fieldwork Home Admin Dashboard

## Current implementation

This repository now includes a database-backed admin console at `/admin`. The existing bcrypt and signed, HTTP-only, SameSite Strict session architecture remains in place. Every new admin page calls `requireAdmin`; the CSV endpoint checks `getAdmin` and returns 401 without a valid session. The content editor, public catalog, seed records and calculator formulas were preserved. No database migration or production data write was made for this phase.

The console includes an overview with live content counts; a searchable, filtered, paginated content library; editing for the six existing content sections; private preview of saved drafts; category create, rename and safe delete (only empty categories); an SEO metadata audit; GA4 overview and page reporting; on-demand PageSpeed Insights tests for published pages; settings status; and a database-backed content CSV report. Articles now use the Phase 2 rich editor and draft autosave described below; other content types retain the original structured plain-text editor.

### Admin routes

- `/admin`: overview and connection status.
- `/admin/content`: all content, with search, section and status filters; 25 rows per page.
- `/admin/new`, `/admin/edit/[id]`, `/admin/preview/[id]`: editing and authenticated preview.
- `/admin/categories`: category management.
- `/admin/analytics`, `/admin/analytics/pages`: GA4 Data API reporting when configured.
- `/admin/performance`: Google PageSpeed Insights lab test when configured.
- `/admin/seo`: local CMS metadata audit.
- `/admin/reports`, `/admin/reports/export`: content inventory and CSV export.
- `/admin/settings`: environment-based integration status; no secrets displayed.

### Content workflow

Create a draft, save it, and use the private preview link to inspect its public layout. Publishing makes it available to the public catalog. Content status changes and edits require an active admin session. Existing publish timestamps survive edits. The editor supports headings and bullet lists through its existing plain-text syntax. SEO title and description overrides are optional; public pages use title and summary fallbacks.

Categories retain seeded records. Renaming a category updates its assigned content labels in one transaction. Changing section is blocked while the category has assigned content. A category can only be deleted when it has no assigned records. The content editor can create categories implicitly from entered names, as it did before this phase.

### Analytics and performance

GA4 reporting uses a service account JWT to obtain a short-lived OAuth access token on the server, then calls the GA4 Data API. Set `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, and `GA4_PRIVATE_KEY` only in the admin deployment. Grant the service account Viewer access to the GA4 property. The overview reports users, new users, sessions, page views, engagement rate and average session duration. Page analytics reports GA4 page path/title, views, users, sessions and engagement rate. Reports show the property timezone when returned. Queries support 7, 14, 30 and 90 day windows; overview also offers today. Provider errors and empty results are shown explicitly. The UI does not manufacture metrics.

Set `PAGESPEED_API_KEY` and an HTTPS `NEXT_PUBLIC_SITE_URL` to test a published CMS page on mobile or desktop. The selected page URL is constructed server-side from published database content and the configured public origin. API responses are cached for one hour to reduce repeated tests. Tests are only started by an admin's action. This phase displays Lighthouse lab score, LCP, FCP, CLS and TBT; field INP appears only when the provider returns it. Historical measurements are not stored.

The existing `src/lib/analytics.ts` events remain local browser events with no network adapter. GA4 public tracking is not yet installed. Thus GA4 reports will be empty until public tracking is configured in the GA4 property. Search Console is not connected and no Search Console metrics are displayed. The SEO page checks CMS metadata only; it does not claim indexing or search ranking health.

### Independent Admin Subdomain Deployment

Use two deployment projects connected to the same repository and commit. Both use the same existing Neon schema and database, with independent environment variables. No domain is hardcoded.

1. Configure the public project with `APP_MODE=public`, `DATABASE_URL`, `DIRECT_URL` (for controlled migrations only), `NEXT_PUBLIC_SITE_URL` set to the real public HTTPS origin, and any public contact email. Do not configure an admin session secret or analytics API credentials in this project. `src/proxy.ts` returns 404 for `/admin` and all nested admin routes, including their server-action POST requests.
2. Configure the admin project with `APP_MODE=admin`, `ADMIN_HOSTNAME` set to the assigned admin hostname (without scheme or port), `DATABASE_URL`, a unique `SESSION_SECRET` of at least 32 random characters, and the same public `NEXT_PUBLIC_SITE_URL`. Configure GA4 and PageSpeed secrets only here. The proxy serves the admin route tree; `/` rewrites to `/admin` and `/login` rewrites to `/admin/login`. It returns 404 for public pages. The root layout omits public header/footer in this build. The admin session cookie is host-only; no shared cookie domain or cross-origin browser API is required.
3. Connect the public domain to the public project and admin subdomain to the admin project in the hosting provider. Confirm the provider's exact DNS records before creating DNS records. Enable HTTPS on both. Set `ADMIN_HOSTNAME` to the verified hostname before launching the admin project. Preview deployments need their own hostname setting or a separate preview configuration.
4. Apply any reviewed, additive Prisma migrations once through a controlled process, not from both deployments. Do not run seed against existing production content to resolve deployment issues.
5. Create the first admin account through the private `npm run admin:create` command with temporary `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment values. Remove `ADMIN_PASSWORD` afterwards. No admin account is created by deploy or web signup.
6. Verify public routes, sitemap and calculators on the public domain. Verify `/admin` returns 404 on the public domain. Verify the admin root and login on the admin subdomain, wrong-host 404, successful/failed login, private preview, content writes, CSV authorization, logout and HTTPS cookie flags. Verify GA4 and PageSpeed separately after credentials are supplied.

The host check supplements app-mode routing and session authorization; it is not a replacement for them. Build each project with its own environment variables because `APP_MODE` also controls layout and robots output at build time. Use independent deployment settings in Vercel if selected; both projects can point to the same Git repository and root directory. Actual DNS and hosting setup remain pending domain ownership and platform configuration.

### Environment variables

| Variable | Public | Admin | Purpose |
| --- | --- | --- | --- |
| `APP_MODE` | `public` | `admin` | Route surface and layout mode |
| `ADMIN_HOSTNAME` | No | Yes | Admin host allowlist |
| `DATABASE_URL` | Yes | Yes | Neon pooled application connection |
| `DIRECT_URL` | Migration job | Migration job | Direct Prisma migration connection |
| `SESSION_SECRET` | No | Yes | Signed admin cookie |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Real public HTTPS origin |
| `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, `GA4_PRIVATE_KEY` | No | Optional | GA4 Data API |
| `PAGESPEED_API_KEY` | No | Optional | PageSpeed Insights |

Never expose a database URL, private key, or session secret via a `NEXT_PUBLIC_` variable. `.env.example` contains names and placeholders only.

### Remaining phases

The requested full platform is larger than the current implementation. Remaining work includes revision history, scheduling plus a verified job runner, durable media storage and uploads, tag taxonomy management, homepage and calculator CMS fields, comprehensive content-specific structured editors, GA4 public tracking and consent handling, real-time/acquisition/device/geography reports, Search Console OAuth/data, performance history and controlled batch tests, analytics CSV/PDF reports, website health checks, login rate limiting, and end-to-end authenticated tests. No scheduling or media upload is claimed to work yet.

### Verification

`npm.cmd run typecheck`, `npm.cmd run lint`, both production build modes, and all five existing calculator tests passed on November 20, 2026. The calculator test runner required the permitted execution setting because the restricted Windows sandbox makes `tsx` fail at Node's `os.userInfo`. Local HTTP smoke checks verified the public/admin route boundary and unauthenticated export response. Authenticated CMS and provider calls were not exercised because no admin account/session or provider credentials were available. The restricted sandbox could not reach the configured Neon host, so database-backed public routes remain unverified here. No production database records were modified.



## Phase 2 — Article editor and publishing workflow

### Managing articles

`/admin/articles` lists only the `guides` section, which is the existing public learning-library article type. Search by title or slug, filter Published/Draft, sort by updated date, publish date or title, and page through 20 results at a time. Each row shows a featured-image thumbnail when present, category, status, publish/updated dates, SEO override state, and actions to edit, preview, duplicate, publish/unpublish, or delete. Publish/unpublish and deletion require a browser confirmation. Duplicates are private drafts with unique copy slugs; the source is preserved.

Use `/admin/articles/new` to write an article. Existing articles open at `/admin/articles/edit/[id]`; old `/admin/edit/[id]` links for guides redirect to the article editor. Other content types keep their existing editor. The article editor uses Tiptap with paragraph and H2/H3 headings (the page title is H1), bold/italic/underline, ordered and unordered lists, links, quotes, tables, images with alt text and captions, and inserted callout, FAQ, checklist and CTA blocks. Related internal paths feed the public related-content sidebar. Special blocks are inserted through prompted fields; select a block and use **Edit block** to change its fields. Tables can add rows or columns from the toolbar.

### Saving and publishing

Draft changes autosave to the real `/admin/articles/save` database endpoint after two seconds of inactivity. New articles get a private draft record once they have a title and category. The editor displays saving, saved, pending and error messages. It also keeps a local browser recovery copy for unsaved edits and prompts before leaving. Published articles do not autosave live changes; use **Update published** to commit them. **Save draft** on a published article asks before unpublishing. Publish and unpublish ask for confirmation. A saved draft can be previewed privately at `/admin/preview/[id]` using the public article layout.

The save endpoint requires an active admin session and same-origin request, validates fields, URLs, rich-document nodes and image alt text, and rejects duplicate slugs. Publishing requires a meaningful title, excerpt and body. Existing article saves use the `updatedAt` timestamp as an optimistic version; a stale tab receives a conflict instead of overwriting newer edits. All publishing operations revalidate public guide and search routes. Drafts remain excluded from the public catalog and sitemap.

### Storage and public rendering

No database schema change was required. Existing seeded articles retain their legacy JSON block arrays. New or edited articles use a versioned JSON object in the existing `Content.body` field; the reader supports both formats. Article metadata (introduction, author, tags, featured image and alt, canonical URL, Open Graph fields, noindex) lives in that object. The public `/guides/[slug]` route renders rich nodes as React elements, without injecting stored HTML, and applies metadata overrides. A noindex article is omitted from the sitemap. Featured images display on article detail and cards when an image URL is supplied. Existing `MediaReference` images can be selected; HTTPS or local image URLs can be entered. File uploads remain unavailable until persistent media storage is configured. External image URLs should be hosted by a provider the operator trusts.

### Phase 2 verification and limits

Ten unit tests passed: five new article-format/rendering/validation tests and five existing calculator tests. TypeScript and production builds passed with both `APP_MODE=public` and `APP_MODE=admin`. ESLint passed with nonblocking image/navigation warnings. Local production smoke checks: public mode returned 404 for the article admin page and save POST, while a public calculator returned 200; admin mode returned 200 for login on the configured Host header, 307 for anonymous article listing, 401 for anonymous save POST, and 404 for a wrong host or public guide path.

Authenticated create/edit/autosave/preview/publish/delete flows and live public article rendering were not exercised in this environment because no administrator account/session is configured and the restricted sandbox could not reach the configured Neon host. The editor and endpoints are implemented but their full live workflow remains to be verified after secure admin provisioning and network access. No production records were changed or migration applied. Scheduling, archived status, revision history, and file uploads remain unavailable. `npm audit` currently reports three high advisories in Prisma's transitive development-tool dependency `effect`; none are attributed to the new Tiptap packages. Review the advisory before changing the Prisma toolchain.



Read-only production database check after Phase 2: 32 content records, 25 categories, 0 admin accounts. With permitted network access, the public-mode production app returned 200 for `/guides`, a seeded article detail, and `/sitemap.xml`; `/admin/articles` returned 404. Authenticated writes and new rich article rendering remain unverified.

