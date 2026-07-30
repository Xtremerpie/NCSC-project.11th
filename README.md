# FocusHeist — V1.5

*Steal your focus back.* A distraction-free study companion for students,
built for an NCSC school project.

This is the real, multi-file source for the app (the single-file version
you saw earlier as a chat artifact has been split into a proper project
here, plus a new **Classwork & Files** page).

## What's inside

```
focusheist-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx              — React entry point
│   ├── App.jsx                — app shell: sidebar, theming, routing, sync
│   ├── index.css              — Tailwind entry
│   ├── lib/
│   │   ├── theme.js           — colors, accent map, theme context
│   │   ├── state.js           — default app state, achievements, streak logic
│   │   └── supabase.js        — REST calls to Supabase (data + file storage)
│   ├── components/
│   │   ├── ui/                — GlassCard, Badge, SectionTitle, StatCard, Empty, Field, Toggle
│   │   ├── SyncBadge.jsx       — 5-state cloud status pill + popover
│   │   └── NotificationBell.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── Planner.jsx
│       ├── Calendar.jsx
│       ├── FocusPanel.jsx / FocusMode.jsx
│       ├── Pomodoro.jsx
│       ├── Homework.jsx
│       ├── Classwork.jsx      — NEW: classwork tracker + file attachments
│       ├── Notes.jsx
│       ├── SmartBoard.jsx
│       ├── QRSharing.jsx
│       ├── EcoDashboard.jsx
│       ├── Analytics.jsx
│       ├── Profile.jsx
│       └── Settings.jsx
```

## 1. Install & run

```bash
cd focusheist-app
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## 2. Supabase setup

You already have the `focusheist_progress` table from Phase 1. This
version adds file attachments for classwork, which need a **Storage
bucket**. Run the following in the Supabase SQL editor.

### App state table (skip if you already ran this)

```sql
create table if not exists focusheist_progress (
  device_id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table focusheist_progress enable row level security;

create policy "anon read/write own device row"
on focusheist_progress
for all
to anon
using (true)
with check (true);
```

### Classwork file storage (new)

Create the bucket from the dashboard (Storage → New bucket → name it
`classwork-files` → toggle **Public bucket** on), then run:

```sql
create policy "anon read classwork files"
on storage.objects for select
to anon
using (bucket_id = 'classwork-files');

create policy "anon upload classwork files"
on storage.objects for insert
to anon
with check (bucket_id = 'classwork-files');

create policy "anon delete classwork files"
on storage.objects for delete
to anon
using (bucket_id = 'classwork-files');
```

Classwork *metadata* (title, subject, status, notes, due date, file
names/URLs) still lives in the same `focusheist_progress` JSON blob —
per the plan, we're intentionally not normalizing the database yet.
Only the actual file bytes go into Storage, since those don't belong in
a JSON column.

## 3. Known limits (by design, for now)

- **No authentication yet.** Every browser gets a random device ID
  (kept via a small persisted value) and its own row. Anyone with the
  anon key and enough patience could read/write any row or file —
  fine for a single-device NCSC demo, not for real multi-student use.
  That's Phase/V2 work (Supabase Auth + student/teacher/admin roles).
- **Single JSON document**, not normalized tables — intentional per
  the V1.5 plan. Move to relational tables when you need per-student
  analytics, teacher dashboards, or cross-user search.
- The accent/theme system, achievements, streaks, and sync badge all
  work the same as the single-file version — this is a reorganization
  plus the Classwork feature, not a rewrite of existing functionality.

## 4. Still on the V1.5 punch list

Explicitly **not** included in this pass — call these out if you want
them next:

- Onboarding tour, command palette (Ctrl+K)
- Toast notifications, loading skeletons, page-transition animations
- Keyboard shortcuts
- Export/import backup
- End-of-session focus summary

## 5. Building for production

```bash
npm run build
```

Outputs a static `dist/` folder you can host anywhere (Netlify,
Vercel, GitHub Pages, or your school's own server).

## Created by Xtremerpie