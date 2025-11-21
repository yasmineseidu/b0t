# Railway Deployment Checklist

Use this checklist to track your deployment progress:

## Pre-Deployment

- [ ] On the `smarter-b0t` branch (verify with `git branch`)
- [ ] Have Railway account created
- [ ] Have GitHub repo connected to Railway

## Railway Setup

- [ ] Created new Railway project
- [ ] Added PostgreSQL database service
- [ ] Added Redis database service
- [ ] Both databases show "Active" status

## Generate Security Keys

- [ ] Generated `AUTH_SECRET` using `openssl rand -base64 32`
- [ ] Generated `ENCRYPTION_KEY` using `openssl rand -base64 32`
- [ ] **SAVED ENCRYPTION_KEY SECURELY** (can't recover credentials without it!)

## Main Web App Configuration

- [ ] Switched branch to `smarter-b0t` in service settings
- [ ] Added environment variable: `AUTH_SECRET`
- [ ] Added environment variable: `ENCRYPTION_KEY`
- [ ] Added environment variable: `NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
- [ ] Added environment variable: `NEXT_PUBLIC_APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
- [ ] Added environment variable: `NODE_ENV=production`
- [ ] Added environment variable: `LOG_LEVEL=info`
- [ ] Added environment variable: `ADMIN_EMAIL=admin@b0t.dev`
- [ ] Added environment variable: `ADMIN_PASSWORD=<your-secure-password>`
- [ ] Verified `DATABASE_URL` is automatically set
- [ ] Verified `REDIS_URL` is automatically set

## Worker Service Configuration

- [ ] Created second service from same GitHub repo
- [ ] Switched branch to `smarter-b0t`
- [ ] Set build command: `npm install --omit=dev --no-audit --no-fund && npm run build`
- [ ] Set start command: `npm run worker:prod`
- [ ] Added environment variable: `WORKFLOW_CONCURRENCY=50`
- [ ] Added environment variable: `NODE_ENV=production`
- [ ] Added environment variable: `LOG_LEVEL=info`
- [ ] Added environment variable: `WORKER_NAME=railway-worker-1`
- [ ] Added environment variable: `SKIP_MODULE_PRELOAD=false`
- [ ] Verified `DATABASE_URL` and `REDIS_URL` are shared automatically

## Deployment

- [ ] Deployed main web app service
- [ ] Deployment succeeded (check logs for errors)
- [ ] Deployed worker service
- [ ] Worker deployment succeeded (check logs)
- [ ] Both services show "Active" status

## Verification

- [ ] Can access web app URL (your-app.up.railway.app)
- [ ] Login page loads successfully
- [ ] Can log in with admin credentials
- [ ] Changed admin password in Settings
- [ ] Dashboard loads correctly
- [ ] Can navigate through different pages
- [ ] Check worker logs to confirm it's processing jobs

## Optional Steps

- [ ] Set up custom domain (if needed)
- [ ] Configure DNS for custom domain
- [ ] Add additional worker services for scaling
- [ ] Set up monitoring/alerts
- [ ] Configure backups schedule

## Post-Deployment

- [ ] Added API credentials in web UI (Settings → Credentials)
- [ ] Created and tested first workflow
- [ ] Documented deployment details for team
- [ ] Set up regular health checks

## Troubleshooting (if needed)

- [ ] Checked deployment logs in Railway
- [ ] Verified all environment variables are set correctly
- [ ] Confirmed PostgreSQL and Redis are running
- [ ] Redeployed if necessary
- [ ] Checked Railway status page for platform issues

---

## Quick Commands

### Generate Keys (macOS/Linux)
```bash
# AUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -base64 32
```

### Check Current Branch
```bash
cd /Users/yasmineseidu/Desktop/Coding/smarter-b0t
git branch
```

### Railway CLI (optional)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Link to project
railway link

# View logs
railway logs

# Open in browser
railway open
```

---

**Deployment Time Estimate**: 15-20 minutes
**Status**: Ready to deploy!
