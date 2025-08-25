# 🎰 Multiplayer Poker Game

A simple multiplayer online poker game built with Node.js, Express, and Socket.IO. Play Texas Hold'em with your friends in real-time!

## Features

- 🎮 Real-time multiplayer gameplay
- 💰 Cash table with chips
- 🃏 Texas Hold'em rules
- 👥 Support for 2-8 players
- 🎨 Modern, responsive UI
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

1. **Join the Game**: Enter your name and click "Join Game"
2. **Wait for Players**: The game starts when at least 2 players join
3. **Take Actions**: When it's your turn, you can:
   - **Fold**: Give up your hand
   - **Call**: Match the current bet
   - **Raise**: Increase the current bet
4. **Win**: Last player standing or best hand wins the pot!

## Game Rules

- Each player starts with $1000 in chips
- Texas Hold'em rules apply
- Small blind: $5, Big blind: $10
- Minimum 2 players, maximum 8 players

## Project Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── public/           # Frontend files
│   ├── index.html    # Main HTML file
│   ├── styles.css    # CSS styling
│   └── script.js     # Frontend JavaScript
└── README.md         # This file
```

## Technologies Used

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time Communication**: Socket.IO
- **Styling**: Modern CSS with gradients and animations

## Development

To add new features or modify the game:

1. **Backend Logic**: Edit `server.js` for game rules and server-side logic
2. **Frontend**: Modify files in the `public/` directory
3. **Styling**: Update `public/styles.css` for visual changes

## Future Enhancements

- [ ] Hand evaluation and winner determination
- [ ] Community cards (flop, turn, river)
- [ ] Multiple tables
- [ ] Chat functionality
- [ ] Player avatars
- [ ] Game history
- [ ] Tournament mode

## Contributing

Feel free to fork this project and add your own features! This is a great starting point for learning real-time multiplayer game development.

## License

MIT License - feel free to use this project for learning or building your own poker game!