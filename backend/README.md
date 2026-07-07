# AMP Ceylon Backend

This is the Next.js (App Router) backend for the AMP Ceylon product catalog and inquiry website. It integrates with Supabase for PostgreSQL Database, Authentication, and Storage, and uses Resend for transactional email notifications.

## Tech Stack
- Frontend/API: Next.js (App Router)
- Database: Supabase (PostgreSQL)
- Image storage: Supabase Storage
- Auth: Supabase Auth (Admin only)
- Emails: Resend

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (NEVER expose to client).
   - `RESEND_API_KEY`: Your Resend API Key.
   - `NOTIFY_EMAIL`: Staff email to receive inquiries.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run migrations on Supabase:
   Use the Supabase CLI to apply migrations located in `supabase/migrations/`:
   ```bash
   supabase link --project-ref your-project-id
   supabase db push
   ```
   Alternatively, you can copy the SQL from the migrations and run them in the Supabase Dashboard SQL Editor.

4. Storage Buckets:
   Ensure you have created two public buckets in Supabase Storage:
   - `product-images`
   - `offer-images`

5. Authentication:
   Admin accounts should be created manually via the Supabase Dashboard under Auth -> Users. There is no public registration. Once created, admins can log in at `/admin/login`.

## Lookup Tables Management (Seasons, Badges, Regions)

The database includes lookup tables to manage dynamic dropdown options without changing code. You can manage these in two ways:

1. **Admin UI (via API):**
   The Next.js app provides secure API endpoints to manage these:
   - `GET /api/admin/seasons`, `POST /api/admin/seasons`
   - `GET /api/admin/badges`, `POST /api/admin/badges`
   - `GET /api/admin/regions`, `POST /api/admin/regions`
   Staff can use the future Admin UI to add a new season like "Eid" or "Mother's Day".

2. **Direct Database (Supabase Dashboard):**
   You can easily go to the Table Editor in Supabase, select the `seasons`, `badges`, or `regions` tables, and insert a new row manually. It will instantly show up in the API responses and catalog filters.

## Local Development

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000).
