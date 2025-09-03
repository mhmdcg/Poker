# 🚀 Deployment Guide: Live Poker Game

This guide will help you deploy your poker game online so you and your friends can play from anywhere!

## 🌐 Deployment Overview

- **Frontend**: GitHub Pages (Free)
- **Backend**: Render.com (Free tier)
- **Result**: Your poker game accessible worldwide!

## 📋 Prerequisites

- GitHub account
- Render.com account
- Git installed on your computer

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email

### 1.2 Deploy Backend Service
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository** (or use "Build and deploy from a Git repository")
3. **Configure the service:**
   - **Name**: `poker-game-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your players
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Click "Create Web Service"**
5. **Wait for deployment** (usually 2-5 minutes)
6. **Copy your service URL** (e.g., `https://poker-game-backend-abc123.onrender.com`)

### 1.3 Update Configuration
1. Open `public/config.js`
2. Replace `'https://your-render-app.onrender.com'` with your actual Render URL
3. Save the file

---

## 🎯 Step 2: Deploy Frontend to GitHub Pages

### 2.1 Push Code to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Live Poker Game"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2.2 Enable GitHub Pages
1. Go to your GitHub repository
2. **Settings** → **Pages**
3. **Source**: Select `Deploy from a branch`
4. **Branch**: Select `main` → `/ (root)`
5. **Click "Save"**
6. **Wait a few minutes** for deployment

### 2.3 Get Your Game URL
Your game will be available at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## 🎯 Step 3: Test Your Deployment

### 3.1 Test Backend
1. Visit your Render service URL
2. You should see a simple page or the poker game
3. Check the logs in Render dashboard for any errors

### 3.2 Test Frontend
1. Visit your GitHub Pages URL
2. Try to create a game
3. Check browser console for connection errors

### 3.3 Test Full Game
1. Open your game in two different browser tabs
2. Create a game in one tab
3. Join with the room code in the other tab
4. Verify real-time updates work

---

## 🔧 Troubleshooting

### Backend Issues
- **Build fails**: Check `package.json` and dependencies
- **Service won't start**: Check logs in Render dashboard
- **Connection refused**: Verify service is running and URL is correct

### Frontend Issues
- **Socket connection fails**: Check `config.js` backend URL
- **Game not loading**: Check browser console for errors
- **CORS errors**: Backend should allow all origins (already configured)

### Common Fixes
1. **Clear browser cache** and refresh
2. **Check Render service status** (should be "Live")
3. **Verify GitHub Pages deployment** (should show green checkmark)
4. **Test backend URL** directly in browser

---

## 🌟 After Deployment

### Share with Friends
- **Game URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- **Instructions**: "Just open the link and enter your name!"

### Monitor Usage
- **Render Dashboard**: Monitor backend performance
- **GitHub Insights**: Track repository activity
- **Browser Console**: Check for client-side errors

### Updates
- **Backend**: Push changes to GitHub, Render auto-deploys
- **Frontend**: Push changes to GitHub, Pages auto-deploys

---

## 🎉 You're Done!

Your poker game is now:
- ✅ **Accessible worldwide** via GitHub Pages
- ✅ **Powered by Render's free tier**
- ✅ **Real-time multiplayer** ready
- ✅ **Mobile-friendly** and responsive
- ✅ **Free to host** and maintain

**Happy playing! 🃏♠️♥️♣️♦️**

---

## 📞 Need Help?

- **Render Issues**: Check [Render Documentation](https://render.com/docs)
- **GitHub Pages Issues**: Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- **Game Issues**: Check browser console and Render logs
