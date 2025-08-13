# 🔗 Connect Your Backend to Vercel Frontend

## Current Issue
The API call is failing because it's trying to use the local Next.js API route instead of your Render backend.

## ✅ Solution

### Step 1: Get Your Render Backend URL

Your backend on Render should have a URL like:
```
https://your-backend-name.onrender.com
```

### Step 2: Update Your Code

1. **Update Step2PAN.tsx** (Already done)
   - Changed from `/api/udyam-registration` to use backend URL
   - Now calls `/api/submit-registration` on your Render backend

2. **Replace the placeholder URL** in `src/components/Step2PAN.tsx`:
   
   Find this line:
   ```javascript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com';
   ```
   
   Replace with your actual Render URL:
   ```javascript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://YOUR-ACTUAL-BACKEND.onrender.com';
   ```

### Step 3: Add Environment Variable in Vercel

1. Go to your **Vercel Project Dashboard**
2. Go to **Settings** → **Environment Variables**
3. Add a new variable:

   **Name:**
   ```
   NEXT_PUBLIC_API_URL
   ```
   
   **Value:**
   ```
   https://your-backend-name.onrender.com
   ```
   
   ⚠️ Replace `your-backend-name` with your actual Render app name

4. Click **Save**

### Step 4: Redeploy

```bash
git add .
git commit -m "Connect to Render backend"
git push origin main
```

Or redeploy from Vercel dashboard.

## 🧪 Test Your Setup

After deployment, test:

1. **Open your app**: `https://your-app.vercel.app`
2. **Fill Step 1**: Enter test Aadhaar and name
3. **Fill Step 2**: Enter all business details
4. **Click "Validate & Save"**
5. **Check**: You should see the success screen with registration number

## 🔍 Debugging

### Check if Backend is Running

Visit these URLs in your browser:
```
https://your-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Check CORS Settings

Your backend already has CORS enabled:
```javascript
app.use(cors());
```

This allows requests from any origin.

### Check Database Connection

Make sure your Render backend has the same DATABASE_URL:
```
postgresql://postgres:Jatin1947@@db.szzmeyoqdbcjxaltvkss.supabase.co:5432/postgres
```

## 📝 API Endpoints Used

Your frontend now uses these endpoints from your Render backend:

1. **Submit Registration**
   - URL: `POST https://your-backend.onrender.com/api/submit-registration`
   - Saves the complete registration to database
   - Returns registration number

2. **Health Check** (optional)
   - URL: `GET https://your-backend.onrender.com/api/health`
   - Verifies backend is running

## 🎯 Quick Checklist

- [ ] Got your Render backend URL
- [ ] Updated the URL in Step2PAN.tsx
- [ ] Added NEXT_PUBLIC_API_URL to Vercel environment variables
- [ ] Redeployed on Vercel
- [ ] Tested the registration flow
- [ ] Verified data saves to Supabase

---

**Note:** The Next.js API route (`/api/udyam-registration`) is no longer used. All API calls go directly to your Render backend.