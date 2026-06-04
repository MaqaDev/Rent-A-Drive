# Deployment Guide - Rent-A-Drive

## Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application. Deployment involves pushing code to GitHub and deploying via Vercel.

## Prerequisites

- GitHub account with token (`github_pat_*` format)
- Vercel account with token
- All environment variables configured

## Step 1: GitHub Repository Setup

### Option A: Create Repository via Web UI

1. Go to https://github.com/new
2. Enter repository name: `Rent-A-Drive`
3. Select "Public"
4. Click "Create repository"
5. Copy the HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/Rent-A-Drive.git`)

### Option B: Create Repository via GitHub CLI

```bash
gh repo create Rent-A-Drive --public --source=. --remote=origin --push
```

## Step 2: Push Code to GitHub

```bash
# Update remote if not already set
git remote remove origin  # if exists
git remote add origin https://github.com/YOUR_USERNAME/Rent-A-Drive.git

# Push code
git branch -M main
git push -u origin main
```

### Troubleshooting Git Push

If you encounter authentication issues:

```bash
# Use personal access token as password when prompted
git clone https://github.com/YOUR_USERNAME/Rent-A-Drive.git
# When prompted for password, use your GitHub token
```

## Step 3: Vercel Deployment

### Initial Deployment

```bash
# Login to Vercel
vercel login --token YOUR_VERCEL_TOKEN

# Deploy from root directory
vercel --prod
```

### Configuration Steps

When prompted:

1. **Set project name**: `rent-a-drive`
2. **Select source code**: `./` (current directory)
3. **Build command**: `npm run build` (for monorepo: custom)
4. **Output directory**: `client/dist`
5. **Environment variables**: Configure below

### Environment Variables in Vercel

In Vercel dashboard (`Settings > Environment Variables`), add:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rentadrive
JWT_SECRET=your_random_secret_key
PORT=5000
NODE_ENV=production

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_live_xxxxx (or sk_test_xxxxx for dev)
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx (or pk_test_xxxxx for dev)

CLIENT_URL=https://rent-a-drive.vercel.app
VITE_API_BASE_URL=https://rent-a-drive.vercel.app/api
```

### Monorepo Build Configuration

Since this is a monorepo, you may need custom build settings:

**Build Command:**

```bash
npm install && npm --prefix server install && npm --prefix client run build
```

**Install Command:**

```bash
npm install && npm --prefix server install && npm --prefix client install
```

**Output Directory:**

```
client/dist
```

**Web Directory:**

```
(leave empty)
```

## Step 4: API Deployment

The backend API needs to be deployed separately or as part of the Vercel function.

### Option A: Deploy Backend Separately (Recommended)

Deploy to Railway, Render, Heroku, or similar:

1. Push repository to GitHub
2. Connect GitHub repo to hosting service
3. Set environment variables
4. Deploy

### Option B: Deploy as Vercel Function

Create `api/index.js` that exports the Express app for Vercel serverless functions.

## Post-Deployment Verification

1. **Test Frontend**: Visit https://rent-a-drive.vercel.app
2. **Test Auth Endpoints**:
   ```bash
   curl https://rent-a-drive.vercel.app/api/auth/me
   ```
3. **Verify Database**: Check MongoDB Atlas connection
4. **Test Payments**: Use Stripe test mode
5. **Check Logs**: Vercel dashboard > Analytics > Logs

## Environment Variables Checklist

- ✅ `MONGODB_URI` - Valid MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Random 32+ character string
- ✅ `CLOUDINARY_CLOUD_NAME` - Your Cloudinary account
- ✅ `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- ✅ `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
- ✅ `STRIPE_SECRET_KEY` - Stripe account (test or live)
- ✅ `STRIPE_PUBLISHABLE_KEY` - Stripe account (test or live)
- ✅ `CLIENT_URL` - Frontend URL (for CORS)
- ✅ `NODE_ENV` - Set to "production"

## Troubleshooting

### Build Fails

- Check `client/src/` for syntax errors
- Verify all imports are correct
- Clear npm cache: `npm cache clean --force`

### API Not Responding

- Check backend environment variables in Vercel
- Verify MongoDB connection string is correct
- Check CORS settings in server.js
- Review Vercel logs for error messages

### Database Connection Issues

- Verify IP whitelist in MongoDB Atlas (allow all IPs: 0.0.0.0/0)
- Check connection string format
- Ensure database name is correct

### Authentication Fails

- Verify JWT_SECRET is set
- Check token expiration (30 days)
- Clear browser localStorage and try again

## Useful Commands

```bash
# View Vercel project info
vercel projects

# Deploy preview
vercel --prod

# View logs
vercel logs [project-name]

# Remove deployment
vercel remove [project-name]

# Set environment variables
vercel env add VARIABLE_NAME
```

## Rollback

```bash
# Revert to previous deployment
vercel rollback [deployment-id]

# Or push new code and redeploy
git push
vercel --prod
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Stripe Documentation](https://stripe.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Last Updated:** June 4, 2026
**Status:** Ready for Production Deployment
