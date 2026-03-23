# Add Admin User (Supabase)

1. Open your Supabase project dashboard.
2. Go to **Authentication ? Users**.
3. Click **Add user**.
4. Enter the admin email and password.
5. If email confirmation is enabled, either disable it for this project or confirm the user from the email.
6. Log in at `http://localhost:3000/admin/login` with that email and password.

Notes:
- Admin access is currently any authenticated Supabase user.
- If you want role-based admins, we can add an `admins` table and enforce it in the API.
