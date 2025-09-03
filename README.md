# 🃏 Live Multiplayer Poker Game

A real-time, interactive Texas Hold'em poker game that you can play with friends online! Built with Node.js, Socket.IO, and modern web technologies.

## ✨ Features

- **🎮 Real-time Multiplayer**: Play with up to 9 friends simultaneously
- **🃏 Full Texas Hold'em Rules**: Complete poker game implementation
- **💬 Live Chat**: Communicate with other players during the game
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Beautiful UI**: Professional poker table with smooth animations
- **🔒 Private Rooms**: Create private game rooms with unique codes
- **💰 Chip Management**: Automatic blind posting and pot management
- **⚡ Fast & Lightweight**: Optimized for smooth gameplay

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd Poker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Start playing!**
   - Enter your name
   - Create a new game or join with a room code
   - Share the room code with friends

## 🎯 How to Play

### Game Setup
1. **Enter your name** on the welcome screen
2. **Create a new game** or **join existing game** with a room code
3. **Wait for players** - game starts automatically with 2+ players
4. **Share the room code** with friends via text, email, or chat

### Gameplay
- **Blinds**: Small blind ($10) and big blind ($20) are posted automatically
- **Dealing**: Each player receives 2 hole cards
- **Betting Rounds**: Preflop → Flop → Turn → River → Showdown
- **Actions**: Fold, Call, Raise, or All-In
- **Winning**: Best 5-card hand wins the pot

### Player Actions
- **Fold**: Give up your hand
- **Call**: Match the current bet
- **Raise**: Increase the current bet
- **All-In**: Bet all your remaining chips

## 🌐 Deployment Options

### Option 1: Local Network (Recommended for Friends)
1. Run the server on your computer
2. Share your local IP address with friends
3. Friends connect to `http://YOUR_IP:3000`

### Option 2: GitHub Pages + Backend Hosting
1. **Frontend**: Deploy to GitHub Pages (free)
2. **Backend**: Deploy to services like:
   - [Render](https://render.com) (free tier available)
   - [Railway](https://railway.app) (free tier available)
   - [Heroku](https://heroku.com) (free tier available)

### Option 3: Vercel + Backend
1. **Frontend**: Deploy to Vercel (free)
2. **Backend**: Deploy to Vercel or other hosting services

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=production
```

### Customizing Game Settings
Edit `server.js` to modify:
- Blind amounts (`smallBlind`, `bigBlind`)
- Starting chips (`minBuyIn`, `maxBuyIn`)
- Maximum players per table
- Game rules and timing

## 📱 Mobile Support

The game is fully responsive and works great on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Laptops

## 🛠️ Technical Details

### Frontend
- **HTML5**: Semantic markup and modern features
- **CSS3**: Responsive design with CSS Grid and Flexbox
- **JavaScript**: ES6+ features and modern APIs
- **Socket.IO Client**: Real-time communication

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **UUID**: Unique identifier generation

### Game Logic
- **Card Deck**: 52-card standard deck with shuffling
- **Player Management**: Join, leave, and rejoin support
- **Betting System**: Automatic blind posting and pot management
- **Game Flow**: Complete Texas Hold'em round management

## 🚨 Troubleshooting

### Common Issues

**"Cannot connect to server"**
- Check if the server is running (`npm start`)
- Verify the port isn't blocked by firewall
- Try a different port in the `.env` file

**"Game not starting"**
- Ensure at least 2 players have joined
- Check browser console for errors
- Refresh the page and try again

**"Cards not showing"**
- Check if Socket.IO is loading properly
- Verify browser supports modern JavaScript
- Try clearing browser cache

### Performance Tips
- Close unnecessary browser tabs
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure stable internet connection
- Avoid running on very old devices

## 🤝 Contributing

Want to improve the game? Here are some ideas:
- Add more poker variants (Omaha, Seven Card Stud)
- Implement hand evaluation algorithms
- Add sound effects and animations
- Create tournament mode
- Add player statistics and leaderboards
- Implement AI players for practice

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with love for poker enthusiasts
- Inspired by online poker platforms
- Uses open-source technologies and libraries

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all dependencies are properly installed
4. Try running on a different device or browser

---

**Happy playing! 🃏♠️♥️♣️♦️**

*May the cards be ever in your favor!*