# BusTicket — Real-Time Digital Bus Ticketing

A role-based bus ticketing platform for purchasing digital tickets, managing transport operations, and validating QR boarding passes in real time. 

The application is built with Next.js 16 and Supabase. PostgreSQL is the source of truth for operational data; Supabase Auth provides user sessions; Row Level Security (RLS) enforces authorization at the database boundary.

## Contents

- [Core capabilities](#core-capabilities)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Supabase setup](#supabase-setup)
- [Environment variables](#environment-variables)
- [Database and migrations](#database-and-migrations)
- [Authentication and authorization](#authentication-and-authorization)
- [Development accounts](#development-accounts)
- [Available commands](#available-commands)
- [Testing and verification](#testing-and-verification)
- [Deployment checklist](#deployment-checklist)
- [Troubleshooting](#troubleshooting)
- [Project structure](#project-structure)
- [Known integration boundaries](#known-integration-boundaries)

## Core capabilities

### Passenger portal

- Browse active routes, schedules, fares, stops, and assigned buses.
- Select a travel date and view database-backed seat availability.
- Book a ticket and generate a unique digital boarding pass.
- Display and share QR tickets.
- Review bookings, active tickets, cancelled tickets, and payment history.
- Cancel unused tickets and initiate a recorded refund.
- Submit route feedback and manage profile preferences.

### Conductor portal

- Review assigned trips and passenger manifests.
- Scan QR codes with a mobile camera or upload a QR image.
- Validate numeric and alphanumeric references such as `BT-2026-0148` and `BT-2026-3B877812`.
- Prevent duplicate boarding by atomically marking tickets as used.
- Record validation audit events and update boarding status.
- Submit operational incident reports.

### Administrator portal

- Monitor ticket, payment, route, fleet, passenger, and validation activity.
- Manage routes, buses, assignments, and account access.
- Create passenger, conductor, or administrator accounts securely.
- Suspend and reactivate user accounts.
- Review feedback, reports, analytics, and operational records.

## Architecture

```text
Browser / Mobile Camera
        │
        ▼
Next.js App Router UI
        │
        ├── SSR session refresh through proxy.ts
        ├── Auth and profile route handlers
        └── Role-protected operational route handlers
                │
                ▼
Supabase
        ├── Auth users and cookie-backed sessions
        ├── PostgreSQL tables, constraints, indexes, and functions
        ├── Row Level Security policies and column-level grants
        └── Storage bucket for profile avatars
```

Operational reads and writes flow through the server-backed application store in `src/lib/store/app-store.ts`. Booking, validation, and cancellation use PostgreSQL functions so related records are changed in one transaction.

Examples:

- Booking creates a ticket, payment, manifest entry, and notification.
- Validation locks the ticket, prevents duplicate use, updates the manifest, and writes an audit log.
- Cancellation updates the ticket, records the refund state, and creates a notification.

## Technology stack

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Backend | Supabase |
| Database | PostgreSQL 17 |
| Authentication | Supabase Auth with SSR cookies |
| Authorization | PostgreSQL RLS and column-level grants |
| Storage | Supabase Storage |
| QR generation | `qrcode` |
| QR decoding | `jsqr` and browser camera APIs |
| Icons | Lucide React |

## Prerequisites

- Node.js `20.9.0` or newer.
- npm.
- A Supabase project for hosted development or production.
- Docker Desktop, or another Docker-compatible runtime, for the local Supabase stack.
- HTTPS when testing camera scanning from a physical phone. Browser camera APIs normally require a secure context, except on `localhost`.

## Quick start

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env.local
```

Add valid Supabase credentials to `.env.local`, apply the database migration, and start the application:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

### Option A: Hosted Supabase project

Authenticate the CLI and link this repository:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Preview pending migrations:

```bash
npx supabase db push --dry-run
```

Apply them:

```bash
npm run db:push
```

For a new disposable development project, seed sample data explicitly:

```bash
npx supabase db push --include-seed
```

Do not use `--include-seed` on production databases.

In the Supabase Auth URL configuration, set the application URL and allow the password-recovery callback URL:

```text
https://your-domain.example/auth/callback
```

### Option B: Local Supabase stack

Start Supabase:

```bash
npm run db:start
```

Copy the API URL, publishable/anon key, and service-role key printed by the CLI into `.env.local`. Rebuild the local database from migrations and seed data:

```bash
npm run db:reset
npm run dev
```

Stop the local stack when finished:

```bash
npm run db:stop
```

### Existing Supabase databases

The initial migration is intended for a new database. Do not paste it over an existing schema that already contains tables such as `profiles`; `CREATE TABLE` statements do not upgrade existing tables.

For an existing project:

1. Back up the database.
2. Link the Supabase CLI to the correct project.
3. Run `npx supabase db pull` to capture the current remote schema.
4. Create a new upgrade migration with `npx supabase migration new upgrade_existing_schema`.
5. Add only the required `ALTER TABLE`, policy, function, and data-backfill statements.
6. Preview with `npx supabase db push --dry-run` before applying.

Avoid combining the migration and seed into a single SQL Editor execution. Apply the schema first and seed only after the schema completes successfully.

## Environment variables

| Variable | Required | Exposure | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser and server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Browser and server | Publishable key, or legacy anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin user management | Server only | Creates, suspends, and manages Auth users |
| `NEXT_PUBLIC_ENABLE_DEMO_MODE` | No | Browser | Displays the development role switcher when set to `true` |

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code, source control, logs, or a variable beginning with `NEXT_PUBLIC_`.

Production example:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

## Database and migrations

The database definition is version-controlled in:

```text
supabase/
├── config.toml
├── migrations/
│   └── 20260825000000_initial_bus_ticketing.sql
├── seed.sql
└── tests/
    └── database/
        └── schema.test.sql
```

### Main tables

| Table | Responsibility |
| --- | --- |
| `profiles` | Application identity, role, status, and contact details |
| `routes` | Origins, destinations, fares, stops, and operating status |
| `buses` | Fleet records and route/conductor assignments |
| `trips` | Scheduled departures and trip progress |
| `tickets` | Passenger ticket and boarding-pass records |
| `payments` | Ticket payment and refund states |
| `manifest_passengers` | Trip manifests and boarding status |
| `validation_logs` | Ticket-scan audit history |
| `incident_reports` | Conductor operational reports |
| `feedback` | Passenger feedback and ratings |
| `user_preferences` | Per-user display and notification preferences |
| `notifications` | User-facing system events |
| `contact_messages` | Public contact submissions |

### Transactional database functions

- `book_ticket(...)`
- `validate_ticket(...)`
- `cancel_ticket(...)`

The migration also creates uniqueness constraints for ticket references and active seat reservations, query indexes, profile triggers, RLS policies, least-privilege grants, and an `avatars` storage bucket.

### Creating future migrations

```bash
npx supabase migration new descriptive_change_name
```

Apply and test the new migration locally before deploying it. Never edit a migration that has already been applied to a shared environment; add a new migration instead.

Generate TypeScript database types after schema changes:

```bash
npm run db:types
```

## Authentication and authorization

Application roles are stored in `public.profiles.role`:

| Role | Access model |
| --- | --- |
| `passenger` | Own profile, tickets, payments, feedback, preferences, and relevant manifest data |
| `conductor` | Assigned trips, manifests, ticket validation, validation logs, and own incident reports |
| `administrator` | Operational management, reporting, fleet data, and user administration |

Public registration always creates a passenger account. Conductor and administrator roles must be assigned through the protected administrator workflow. User-provided signup metadata is not trusted for privileged role assignment.

Authorization is enforced in multiple layers:

1. Next.js proxy refreshes and checks the Supabase session.
2. Role-specific layouts protect portal navigation.
3. Route handlers authenticate each request.
4. PostgreSQL grants and RLS policies restrict the underlying rows and columns.

## Development accounts

The seed creates the following local/development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Passenger | `passenger@example.com` | `Password123!` |
| Conductor | `conductor@example.com` | `Password123!` |
| Administrator | `admin@example.com` | `Password123!` |

These credentials must never be seeded into production. The quick role switcher remains hidden unless `NEXT_PUBLIC_ENABLE_DEMO_MODE=true`.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create and type-check a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run db:start` | Start the local Supabase stack |
| `npm run db:stop` | Stop the local Supabase stack |
| `npm run db:reset` | Recreate the local database and apply migrations plus seed data |
| `npm run db:push` | Apply pending migrations to the linked Supabase project |
| `npm run db:types` | Generate local Supabase TypeScript types |

On Windows PowerShell systems that block `npm.ps1`, use `npm.cmd`, for example:

```powershell
npm.cmd run dev
```

## Testing and verification

Run application checks:

```bash
npm run lint
npm run build
```

Run database tests against the local stack:

```bash
npx supabase test db
```

After database changes, verify a clean replay:

```bash
npm run db:reset
```

Recommended manual smoke tests:

1. Register a passenger and confirm a `profiles` row is created.
2. Log in under the stored role and confirm cross-role navigation is rejected.
3. Book a ticket and verify the ticket, payment, manifest, and notification records.
4. Scan the QR ticket from a conductor account and confirm it becomes `used`.
5. Scan the same ticket again and confirm it is rejected as already used.
6. Cancel an unused ticket and confirm its payment becomes `Refunded`.
7. Confirm passengers cannot read other passengers' tickets through the Supabase API.

## Deployment checklist

- Apply all migrations to the target project.
- Do not apply the development seed to production.
- Configure the production site URL and Auth redirect URLs in Supabase.
- Add all required environment variables to the hosting platform.
- Keep the service-role key server-only.
- Set `NEXT_PUBLIC_ENABLE_DEMO_MODE=false`.
- Confirm email delivery settings for registration and password recovery.
- Serve the application over HTTPS for mobile camera access.
- Run `npm run lint`, `npm run build`, and database tests.
- Smoke-test passenger booking, conductor validation, and administrator access.

## Troubleshooting

### “This account does not have the selected role”

Supabase accepted the credentials, but the corresponding `profiles` row is missing, suspended, or has a different role. Inspect the mapping:

```sql
select
  auth_users.email,
  profiles.id as profile_id,
  profiles.role,
  profiles.account_status
from auth.users as auth_users
left join public.profiles as profiles on profiles.id = auth_users.id;
```

The role selected on the login form must match `profiles.role`.

### `column profiles.account_status does not exist`

The application is connected to an older or partially migrated schema. Create and apply an upgrade migration that adds and backfills the column. Do not rerun the initial migration over an existing `profiles` table.

### “Could not embed because more than one relationship was found”

Restart the application after updating the query. If the database relationships were recently changed, reload the PostgREST schema cache from the Supabase API settings. Ticket/profile embeds must explicitly select `passenger_id` or `validated_by` because both reference `profiles`.

### No routes are available

Verify that the migration succeeded and the project contains route records:

```sql
select * from public.routes order by created_at;
```

Seed development data or create routes through an administrator account.

### Mobile camera does not start

- Use HTTPS or `localhost`.
- Grant camera permission to the browser.
- Close other applications using the camera.
- Use manual reference entry or image upload as a fallback.

### A QR reference is reported as truncated or invalid

Current references may contain letters and numbers after the year. The scanner supports the complete `BT-YYYY-ALPHANUMERIC` format. Restart the development server or redeploy after scanner changes so the latest parser is served.

## Project structure

```text
src/
├── app/
│   ├── admin/             # Administrator portal
│   ├── conductor/         # Conductor portal and QR scanner
│   ├── passenger/         # Passenger booking and ticket wallet
│   ├── api/               # Auth, operational, preference, and admin handlers
│   └── auth/callback/     # Supabase recovery/session callback
├── components/
│   ├── auth/              # Authentication forms
│   ├── dashboard/         # Dashboard views and settings
│   ├── layout/            # Navigation and portal shells
│   ├── tickets/           # Ticket, QR, and receipt components
│   └── ui/                # Shared UI primitives
├── lib/
│   ├── auth/              # Server session and role enforcement
│   ├── store/             # Database-backed client state
│   └── supabase/          # Browser, server, proxy, and admin clients
└── types/                 # Application domain types

supabase/
├── migrations/            # Versioned database changes
├── tests/database/        # pgTAP database tests
├── config.toml            # Local Supabase configuration
└── seed.sql               # Development-only data
```

## Known integration boundaries

- Payment records and refund states are persisted transactionally, but no external mobile-money or card processor is connected. A production payment provider must confirm transactions before tickets are treated as paid.
- Email confirmation and password-recovery delivery depend on the Supabase Auth email provider and SMTP configuration.
- Live vehicle GPS tracking is not included.

Before production use, complete payment-provider integration, operational monitoring, backups, rate limiting for public endpoints, and environment-specific security review.
