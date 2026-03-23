# Portal Usage Guide

This document explains how to run and use the Supervisor Selection Portal.

## 1. Requirements
- Node.js installed
- Supabase project with the schema applied
- `.env.local` configured with Supabase keys

Example `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. Start the App
From the project root:
```
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## 3. Student Flow
1. Open the landing page.
2. Browse the list of lecturers (supervisors and assistants are both listed).
3. Click a lecturer to open the submission form.
4. Fill in full name and matric number.
5. Submit. A success summary appears.
6. Each matric number can submit only once.

## 4. Assistant Selection Logic
- Assistants appear as normal lecturers in the landing list.
- When a student clicks an assistant, the system passes both:
  - `supervisor_id` (the main supervisor)
  - `assistant_id` (the selected assistant)
- The submission form uses those values automatically.

## 5. Admin Flow
### Create an Admin User
See `docs/ADMIN_SETUP.md` for the steps.

### Admin Pages
- Login: `http://localhost:3000/admin/login`
- Dashboard: `http://localhost:3000/admin/dashboard`
- Supervisors: `http://localhost:3000/admin/supervisors`
- Assistants: `http://localhost:3000/admin/assistants`

### Admin Capabilities
- Add supervisors
- Add assistants
- Open/close the portal
- View submissions
- Export submissions to Excel

## 6. Portal Open/Closed
The landing and submission pages read `system_settings.portal_open`.
- If `false`, the portal shows “Portal Closed”.
- Admins can toggle it on the dashboard.

## 7. Troubleshooting
### Portal shows “Closed”
Run this SQL in Supabase:
```
insert into system_settings (id, portal_open)
values (1, true)
on conflict (id) do update set portal_open = excluded.portal_open;
```

### API returns 500
Usually caused by missing RLS policies. Confirm these exist:
- Public read: supervisors, assistants, system_settings
- Public insert: submissions
- Admin write: supervisors, assistants, system_settings

### No assistants showing for a supervisor
Check the assistant table:
```
select a.id, a.name, a.supervisor_id, s.name as supervisor_name
from assistants a
join supervisors s on s.id = a.supervisor_id
order by s.name, a.name;
```

## 8. Assets
- Landing hero background: `public/image.png`
- Logo: `public/vertais-logo.png`
- Favicon: `app/icon.png` (copied from the logo)

If you need role-based admin access or additional controls, tell me and I will add them.
