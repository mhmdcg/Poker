@echo off
echo 🚀 Deploying Live Poker Game to GitHub...
echo.

echo 📝 Adding all files to git...
git add .

echo 💾 Committing changes...
git commit -m "Deploy: Live Poker Game $(date /t)"

echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployment complete!
echo.
echo 🌐 Next steps:
echo 1. Go to your GitHub repository
echo 2. Settings → Pages → Enable GitHub Pages
echo 3. Deploy backend to Render.com
echo 4. Update config.js with your Render URL
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo.
pause
