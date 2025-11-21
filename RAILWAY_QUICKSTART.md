# Quick Start: Deploy smarter-b0t to Railway

This is your fast-track guide to getting smarter-b0t live on Railway in about 15 minutes.

## Before You Start

Make sure you:
- Have a Railway account (sign up at https://railway.app)
- Are on the `smarter-b0t` branch (you are!)
- Have your GitHub repo ready

## Step 1: Generate Your Security Keys (2 minutes)

Run this script to generate your security keys:

```bash
cd /Users/yasmineseidu/Desktop/Coding/smarter-b0t
./scripts/generate-railway-env.sh
```

This creates a file called `railway-env-vars.txt` with all the environment variables you need. Keep this file safe!

## Step 2: Set Up Railway Project (5 minutes)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your smarter-b0t repository
5. Click "+ New" and add:
   - PostgreSQL database
   - Redis instance

## Step 3: Configure Web App (3 minutes)

1. Click on your main service
2. Settings → Change branch to `smarter-b0t`
3. Variables → Add all variables from your `railway-env-vars.txt` file
4. Important: Change `ADMIN_PASSWORD` to something secure!

## Step 4: Set Up Worker Service (3 minutes)

1. Click "+ New" → "GitHub Repo"
2. Select your smarter-b0t repo again
3. Settings:
   - Branch: `smarter-b0t`
   - Build command: `npm install --omit=dev --no-audit --no-fund && npm run build`
   - Start command: `npm run worker:prod`
4. Variables → Add these:
   ```
   WORKFLOW_CONCURRENCY=50
   NODE_ENV=production
   LOG_LEVEL=info
   WORKER_NAME=railway-worker-1
   SKIP_MODULE_PRELOAD=false
   ```

## Step 5: Deploy (2 minutes)

1. Both services should automatically start deploying
2. Wait for both to show "Active" status
3. Click on your web service to get the URL

## Step 6: Test It Out

1. Visit your app URL (something like `your-app.up.railway.app`)
2. Log in with:
   - Email: `admin@b0t.dev`
   - Password: whatever you set
3. Go to Settings → Change your password!
4. Try creating a workflow

## What You Just Deployed

Your Railway project now has:

- **PostgreSQL**: Stores workflows, users, credentials, execution history
- **Redis**: Powers the job queue for workflow execution
- **Web App**: The main Next.js application (user interface)
- **Worker**: Background service that processes workflows

All four services work together to give you a fully functional automation platform.

## Important Files Created

1. **RAILWAY_DEPLOYMENT_GUIDE.md** - Full detailed deployment guide
2. **RAILWAY_CHECKLIST.md** - Checklist to track your progress
3. **railway-env-vars.txt** - Your generated environment variables (keep safe!)

## Next Steps

1. Add API credentials in the web UI:
   - Settings → Credentials
   - Add keys for services you want to automate (OpenAI, Twitter, etc.)

2. Create your first workflow:
   - Use Claude Code to generate workflows
   - Or manually create one in the UI

3. Monitor your deployment:
   - Check logs in Railway dashboard
   - Watch for any errors
   - Scale workers if needed

## Troubleshooting

**Build fails?**
- Check you're on the `smarter-b0t` branch
- Verify all environment variables are set
- Check Railway logs for specific errors

**Can't log in?**
- Make sure you set `ADMIN_PASSWORD` in variables
- Check that the web app is fully deployed (Active status)

**Workflows don't run?**
- Check that worker service is running
- Look at worker logs for errors
- Verify Redis connection is working

## Need More Help?

- Full guide: `RAILWAY_DEPLOYMENT_GUIDE.md`
- Checklist: `RAILWAY_CHECKLIST.md`
- Railway docs: https://docs.railway.app
- Check logs in Railway dashboard

## Cost

Expected cost: $10-30/month depending on usage
- Railway Hobby Plan: $5/month (includes $5 credit)
- You'll need about 4 services (PostgreSQL, Redis, Web, Worker)

---

**Ready?** Run the environment generator script and follow the steps above. You'll be live in 15 minutes!
