# Deployment Guide

This document outlines the exact steps to deploy your application to Vercel using GitHub, and includes instructions on configuring your Supabase backend.

## 1. Preparing Your Project for GitHub

Since this is a new repository, you need to initialize Git, commit your files, and push them to your newly created GitHub repository.

**Note:** The folder `tedxvertias/` has been added to `.gitignore`, so it will be automatically ignored by Git.

### Step-by-Step Terminal Instructions:

Open your terminal in the root of your project folder (`C:\Users\Hp\web`) and run the following commands sequentially:

**1.** Initialize a new Git repository:
```bash
git init
```

**2.** Add all your project files to the staging area:
```bash
git add .
```

**3.** Commit your files with an initial message:
```bash
git commit -m "Initial commit for Vercel deployment"
```

**4.** Rename the default branch to `main`:
```bash
git branch -M main
```

**5.** Link your local project to the GitHub repository you created:
```bash
git remote add origin https://github.com/danilao-bot/project1.git
```

**6.** Push your code to GitHub:
```bash
git push -u origin main
```
> Let this command finish. Once completed, your code is now live on your GitHub repository!

---

## 2. Deploying to Vercel

With your code on GitHub, Vercel makes it incredibly easy to host your project.

### Step-by-Step Deployment Instructions:

**1. Log in to Vercel:**
Go to [Vercel.com](https://vercel.com/) and log in using your GitHub account. This will automatically link your GitHub repositories to your Vercel account.

**2. Import Your Project:**
- Once logged in, click the **"Add New..."** button (top right) and select **"Project"**.
- In the "Import Git Repository" section, locate `danilao-bot/project1` and click **"Import"**.

**3. Configure the Project:**
- **Project Name:** Leave it as `project1` or change it to whatever you prefer.
- **Framework Preset:** Vercel will auto-detect **Next.js**. Leave this as-is.
- **Root Directory:** Leave this as `./` (the default).

**4. Set Up Supabase Environment Variables:**
This is the most crucial step because your application needs to connect to the Supabase backend in the production environment.
- Still on the Configure Project page, expand the **"Environment Variables"** dropdown.
- You need to add the Supabase variables that are currently in your local `.env.local` file.
- Add the following keys and their corresponding values (copy the values from your Supabase dashboard or your local `.env.local` file):
  * **Key:** `NEXT_PUBLIC_SUPABASE_URL` | **Value:** `your-supabase-url-here`
  * **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Value:** `your-supabase-anon-key-here`
- Click **"Add"** after pasting each one.
> _Ensure you copy the API variables from the **Project Settings -> API** section of your Supabase dashboard if you don't have them in `.env.local`._

**5. Deploy:**
- Once your environment variables are set, click the **"Deploy"** button.
- Vercel will begin building your project. This process usually takes 1 to 3 minutes.
- When the build finishes, you will be redirected to a success page with thumbnails.

**6. Visit Your Site:**
- Click "Continue to Dashboard" and then click the generated domain name to see your live application!
