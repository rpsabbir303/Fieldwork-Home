# Fieldwork Home

A US-focused home improvement planning platform. The public site works without external services: it includes project guides, educational articles, cost planning, material comparisons, design directions, seasonal checklists, site search, and three interactive calculators. A protected PostgreSQL CMS becomes available after database and administrator setup.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- Lucide React and reusable shadcn-style component primitives
- React Hook Form and Zod for calculator and admin input validation
- Prisma 6 and PostgreSQL for editorial content and administrators
- bcrypt password hashes and signed, HTTP-only admin session cookies

The site does not require paid APIs. Original SVG and CSS illustrations are bundled locally. Design ideas use replaceable illustration surfaces while licensed or original photography is prepared.

## Quick start

Use Node.js 20.9 or newer. On Windows PowerShell with restricted script execution, use `npm.cmd` and `npx.cmd` in place of `npm` and `npx`.

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`. Without `DATABASE_URL`, the public site serves bundled starter editorial content. `/admin/login` shows a setup message; it does not pretend to persist edits.

## Database and admin setup

1. Create a PostgreSQL database and copy `.env.example` to `.env` in the project root. For Neon, set `DATABASE_URL` to the pooled connection URL and `DIRECT_URL` to the matching direct URL (same database and credentials, host without `-pooler`). Prisma 6 uses `DIRECT_URL` for migrations and `DATABASE_URL` for application queries. Set a random `SESSION_SECRET` with at least 32 characters and `NEXT_PUBLIC_SITE_URL` for the deployment origin. Next.js and Prisma load this file; the seed and administrator commands load it explicitly with Node's `--env-file` option. Existing shell environment variables take precedence. Keep `.env` private and never commit real credentials. `.gitignore` excludes `.env*` except `.env.example`.
2. Apply the included migration and generate the client:

   ```bash
   npm run db:migrate
   npm run db:generate
   ```

   For production, use `npx prisma migrate deploy` instead of `migrate dev`. Before applying a migration to an existing database, check `npx prisma migrate status` and review the included SQL; do not reset the database.

3. Import the bundled starter editorial entries into PostgreSQL:

   ```bash
   npm run db:seed
   ```

   The seed is idempotent and preserves existing edits. Once the database is configured, public content comes from published database rows, so run the seed before relying on the public library.

4. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 14 characters in the command environment. Then run:

   ```bash
   npm run admin:create
   ```

   This one-time command stores a bcrypt hash. It updates that account's password if run again. Prefer setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` only in the shell for this command, then remove them from the shell afterward. If you place them in `.env`, remove them after account creation. There is no public signup.

5. Start the app and visit `/admin/login`. The dashboard shows real content, published, draft, and category counts. Editors can create, edit, publish, unpublish, and delete entries. Deletion asks for confirmation. Admin routes and every mutation check the signed session against an active database administrator. Sessions expire after eight hours.

`prisma/schema.prisma` and `prisma/migrations/20261119_init/migration.sql` define the database. The schema uses a shared `Content` model for articles, projects, cost guides, comparisons, maintenance, and design ideas; `Category` and `MediaReference` support expansion. The CMS automatically creates categories entered on content forms. Media upload and a standalone media library are not yet implemented.

## Main routes

| Area               | Routes                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Home and discovery | `/`, `/search`, `/design-ideas`, `/materials-tools`                                               |
| Planning           | `/calculators`, `/calculators/paint`, `/calculators/tile`, `/calculators/drywall`, `/cost-guides` |
| Learning           | `/projects`, `/projects/category/[slug]`, `/guides`, detail pages under each section              |
| Upkeep             | `/home-maintenance`, seasonal printable checklists                                                |
| Information        | `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/editorial-policy`                    |
| Editorial CMS      | `/admin/login`, `/admin`, `/admin/new`, `/admin/edit/[id]`                                        |

The public starter library contains 3 detailed project guides, 15 educational guides, 3 cost guides, 3 material comparisons, 4 design directions, and 4 seasonal maintenance checklists. Pages link to relevant calculators and related resources. Project categories without an initial project show a clear editorial empty state and links to other resources.

## Calculator assumptions

- **Paint:** gross wall area = `2 × (room length + room width) × wall height`; deduct entered door and window areas. Multiply by coats, divide by editable coverage per gallon, and round up to whole gallons. Optional subtotal uses the visitor's price. The 350 sq ft/gallon example is not a universal product claim.
- **Tile:** room area divided by individual tile area, then multiplied by `1 + waste percentage`; round up to whole tiles. US mode uses feet for the room and inches for tiles; metric mode uses meters and centimeters. The example 10% waste is editable. Carton rounding is not included.
- **Drywall:** wall length × height, less openings, plus optional ceiling area. Apply editable waste, divide by sheet area, and round up. A cut plan and assembly requirements still need separate checking.

All calculations run in the browser without authentication. Zod rejects invalid dimensions, negative amounts, excessive openings, and incomplete ceiling dimensions. Formula tests are in `tests/calculators.test.ts`. Print buttons use the browser's print or PDF dialog.

## Commands and checks

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:seed
npm run admin:create
```

The production build and calculator tests do not require a database. Database migration, seed, and admin login require a reachable PostgreSQL server. Run database commands from the project root. The seed and admin commands require `.env` to exist, even when credentials are supplied by the shell. Do not copy the example's placeholder database URL and password unchanged. In this workspace, no PostgreSQL connection is configured, so migration and authenticated CMS flows cannot be verified until a real connection is supplied.

## Environment variables

| Name                            | Purpose                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                  | Pooled PostgreSQL connection string for application queries               |
| `DIRECT_URL`                    | Direct PostgreSQL connection string for Prisma migrations                 |
| `SESSION_SECRET`                | At least 32 random characters for signed admin sessions                   |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | One-time administrator creation command only                              |
| `NEXT_PUBLIC_SITE_URL`          | Absolute site origin for metadata, canonical URLs, robots, and sitemap    |
| `NEXT_PUBLIC_CONTACT_EMAIL`     | Optional public contact address; no address is invented by default        |

## SEO, accessibility, and privacy

Pages have descriptive titles and metadata; detail pages support CMS SEO overrides. `sitemap.xml` lists public resources and `robots.txt` excludes admin and search. Navigation is keyboard operable, forms have labels and error text, print layouts are provided, and motion is reduced when requested by the browser.

The event names in `src/lib/analytics.ts` cover calculator starts and completions, result printing, resource clicks, search submission, and no-result searches. They currently dispatch local browser events only. No tracking network adapter or GA4 script is enabled. Review privacy and consent requirements before connecting analytics. Legal pages are starter text and explicitly request review before public deployment.

## Structure

```text
src/app/             App Router pages, metadata routes, admin actions, styles
src/components/      Header, footer, content templates, calculators, CMS editor
src/lib/             Editorial starter data, catalog, formulas, auth, database, events
prisma/              Schema, SQL migration, seed and one-time admin command
public/              Local illustrations and static assets
tests/               Calculator formula and validation tests
```

## Current limits and deployment preparation

- PostgreSQL must be provisioned separately. Database content and CMS edits are not persistent until migration, seed, and admin setup are completed.
- Media references are modeled but upload, crop, and media-library controls are not included. Design ideas use original illustration placeholders rather than photographs.
- CMS body editing uses a deliberately small text format (`##` headings and `-` list items). Draft preview and scheduled publishing are not included.
- Cost guides explain budget components and rely on visitor-entered prices or local quotes. No regional market prices, testimonials, ratings, affiliate integrations, or fake analytics are provided.
- The contact page requires `NEXT_PUBLIC_CONTACT_EMAIL` to show a direct email link. No public form backend is included.
- Before deploying, set the real HTTPS site URL, database URL, session secret, and contact details; run `prisma migrate deploy`, seed, create an administrator, review legal text, and verify the production host supports persistent PostgreSQL connections.

If the public site displays a temporary content error with `DATABASE_URL` set, check database reachability and run migrations. If admin login shows setup required, check `DATABASE_URL` and `SESSION_SECRET`. If a newly configured database shows an empty library, run `npm run db:seed`.
