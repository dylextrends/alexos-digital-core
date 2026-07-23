## Bills Management — Money Center

The build is failing because `src/lib/money/bills.ts` queries a `bills` table that doesn't exist in the database yet (Supabase types have no `bills`, so every `.from("bills")` call type-errors). The fix is to ship the schema, then wire the existing UI/API to it.

### 1. Database migration

Create `public.bills`:

- `id uuid pk`, `user_id uuid` (references `auth.users`)
- `name text`, `amount numeric(14,2)`, `category text`
- `due_day int` (day-of-month for recurring) and `due_date date` (next due date)
- `frequency` enum: `one_time | weekly | monthly`
- `status` enum: `pending | paid`
- `account_id uuid` (nullable, references `public.accounts`)
- `notes text`, `auto_create_transaction boolean default false`
- `last_paid_at timestamptz`, `deleted_at timestamptz` (soft delete)
- `created_at`, `updated_at` with trigger

GRANTs for `authenticated` + `service_role`, RLS enabled, single policy: `auth.uid() = user_id` for all actions. `updated_at` trigger reuses `public.update_updated_at_column`.

### 2. Fix `src/lib/money/bills.ts`

After types regenerate, remove the `as Bill` casts and let `.from("bills")` type-check normally. Ensure insert payload always sets `user_id` from `supabase.auth.getUser()`. Order list by `due_date asc`. "Mark paid" mutation: set `status = 'paid'`, `last_paid_at = now()`; for recurring bills, advance `due_date` to the next occurrence and reset `status` to `pending`; optionally create an expense transaction when `auto_create_transaction` is true.

### 3. UI

- Add `Bills` entry to `MoneyNav` (after Budgets, before Expected).
- New route `src/routes/_authenticated/money-center/bills.tsx`: table with search, status filter, "Add Bill" button, row actions (Edit, Mark Paid, Delete).
- `BillFormDialog` with fields: Name, Amount, Category (reuse expense categories), Frequency, Due date, Account (optional), Auto-create expense toggle, Notes.
- Money Dashboard: three new KPI cards — **Upcoming bills (next 7 days)**, **Total unpaid**, **Due this month** — placed alongside existing KPIs, styled with the current card + icon pattern.

### 4. Out of scope

No changes to sidebar, auth, or other Money Center pages beyond adding the Bills tab and three dashboard cards.

### Technical notes

- Migration must include `GRANT SELECT, INSERT, UPDATE, DELETE ON public.bills TO authenticated;` and `GRANT ALL ... TO service_role;` before enabling RLS.
- Enums created via `CREATE TYPE ... AS ENUM`.
- Frequency advancement handled client-side in the mark-paid mutation to keep this simple; no cron needed.
- Soft delete via `deleted_at`; list query filters `deleted_at is null`.
