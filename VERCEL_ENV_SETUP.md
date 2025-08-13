# 🔧 Fix Vercel Environment Variable Error

## The Issue
Vercel is looking for a secret reference `@database_url` which doesn't exist. This has been fixed.

## ✅ Solution

### Step 1: Push Updated Config
```bash
git add vercel.json
git commit -m "Fix: Remove secret reference from vercel.json"
git push origin main
```

### Step 2: Add Environment Variable in Vercel Dashboard

1. **In your Vercel project dashboard**, go to **Settings** → **Environment Variables**

2. Click **Add New** and enter EXACTLY:

   **Name:** 
   ```
   DATABASE_URL
   ```
   
   **Value:** 
   ```
   postgresql://postgres:Jatin1947@@db.szzmeyoqdbcjxaltvkss.supabase.co:5432/postgres
   ```
   
   **Environment:** Select all (Production, Preview, Development)

3. Click **Save**

### Step 3: Redeploy

Option A - From Dashboard:
- Go to **Deployments** tab
- Click **...** menu on the latest deployment
- Select **Redeploy**

Option B - From Git:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 📝 Important Notes

### DO NOT use these formats:
❌ `@database_url` (secret reference)
❌ `${DATABASE_URL}` (variable reference)
❌ Quotes around the value in Vercel dashboard

### DO use:
✅ Plain text value directly in Vercel dashboard
✅ Name: `DATABASE_URL`
✅ Value: `postgresql://postgres:Jatin1947@@db.szzmeyoqdbcjxaltvkss.supabase.co:5432/postgres`

## 🎯 Quick Checklist

- [ ] Removed `@database_url` references from vercel.json
- [ ] Pushed updated vercel.json to GitHub
- [ ] Added DATABASE_URL as plain environment variable in Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Clicked Save
- [ ] Redeployed the project

## 🚀 After Successful Deployment

Your app will be available at:
```
https://[your-project-name].vercel.app
```

Test the database connection by:
1. Opening your app
2. Filling out Step 1 (Aadhaar form)
3. Filling out Step 2 (Business details)
4. Checking if registration completes successfully

---

**Note:** The `vercel.json` now only contains build commands. Environment variables should be added directly in the Vercel dashboard, not in the config file.