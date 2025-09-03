const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state
const games = new Map();
const players = new Map();

// Card deck
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.value = ranks.indexOf(rank);
  }
  
  toString() {
    return `${this.rank}${this.suit}`;
  }
}

class PokerGame {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = [];
    this.deck = [];
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.dealerIndex = 0;
    this.currentPlayerIndex = 0;
    this.gameState = 'waiting'; // waiting, playing, finished
    this.round = 'preflop'; // preflop, flop, turn, river, showdown
    this.smallBlind = 10;
    this.bigBlind = 20;
    this.minBuyIn = 1000;
    this.maxBuyIn = 5000;
    
    this.resetDeck();
  }
  
  resetDeck() {
    this.deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        this.deck.push(new Card(suit, rank));
      }
    }
    this.shuffleDeck();
  }
  
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
  
  dealCards() {
    this.players.forEach(player => {
      if (player.chips > 0) {
        player.hand = [this.deck.pop(), this.deck.pop()];
        player.folded = false;
        player.allIn = false;
        player.currentBet = 0;
      }
    });
  }
  
  dealCommunityCards(count) {
    for (let i = 0; i < count; i++) {
      this.communityCards.push(this.deck.pop());
    }
  }
  
  nextRound() {
    switch (this.round) {
      case 'preflop':
        this.round = 'flop';
        this.dealCommunityCards(3);
        break;
      case 'flop':
        this.round = 'turn';
        this.dealCommunityCards(1);
        break;
      case 'turn':
        this.round = 'river';
        this.dealCommunityCards(1);
        break;
      case 'river':
        this.round = 'showdown';
        this.showdown();
        break;
    }
  }
  
  showdown() {
    // Simple hand evaluation - in a real game you'd want more sophisticated logic
    const activePlayers = this.players.filter(p => !p.folded);
    if (activePlayers.length === 1) {
      this.awardPot(activePlayers[0]);
    } else {
      // Award pot to player with best hand (simplified)
      this.awardPot(activePlayers[0]);
    }
    
    setTimeout(() => {
      this.startNewHand();
    }, 3000);
  }
  
  awardPot(winner) {
    winner.chips += this.pot;
    this.pot = 0;
  }
  
  startNewHand() {
    this.round = 'preflop';
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
    this.resetDeck();
    this.dealCards();
    this.postBlinds();
    this.gameState = 'playing';
    
    io.to(this.roomId).emit('gameUpdate', this.getGameState());
  }
  
  postBlinds() {
    const smallBlindIndex = (this.dealerIndex + 1) % this.players.length;
    const bigBlindIndex = (this.dealerIndex + 2) % this.players.length;
    
    if (this.players[smallBlindIndex]) {
      this.players[smallBlindIndex].chips -= this.smallBlind;
      this.players[smallBlindIndex].currentBet = this.smallBlind;
      this.pot += this.smallBlind;
    }
    
    if (this.players[bigBlindIndex]) {
      this.players[bigBlindIndex].chips -= this.bigBlind;
      this.players[bigBlindIndex].currentBet = this.bigBlind;
      this.pot += this.bigBlind;
      this.currentBet = this.bigBlind;
    }
    
    this.currentPlayerIndex = (bigBlindIndex + 1) % this.players.length;
  }
  
  getGameState() {
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        chips: p.chips,
        currentBet: p.currentBet,
        folded: p.folded,
        allIn: p.allIn,
        isDealer: this.players.indexOf(p) === this.dealerIndex,
        isCurrentPlayer: this.players.indexOf(p) === this.currentPlayerIndex
      })),
      communityCards: this.communityCards,
      pot: this.pot,
      currentBet: this.currentBet,
      round: this.round,
      gameState: this.gameState
    };
  }
  
  addPlayer(player) {
    if (this.players.length < 9) {
      player.chips = this.minBuyIn;
      this.players.push(player);
      
      if (this.players.length >= 2 && this.gameState === 'waiting') {
        this.startGame();
      }
      
      return true;
    }
    return false;
  }
  
  startGame() {
    this.gameState = 'playing';
    this.dealCards();
    this.postBlinds();
    io.to(this.roomId).emit('gameUpdate', this.getGameState());
  }
  
  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      
      if (this.players.length < 2) {
        this.gameState = 'waiting';
      }
      
      return true;
    }
    return false;
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinGame', (data) => {
    const { roomId, playerName } = data;
    
    if (!games.has(roomId)) {
      games.set(roomId, new PokerGame(roomId));
    }
    
    const game = games.get(roomId);
    const player = {
      id: socket.id,
      name: playerName,
      chips: 0,
      hand: [],
      folded: false,
      allIn: false,
      currentBet: 0
    };
    
    if (game.addPlayer(player)) {
      socket.join(roomId);
      players.set(socket.id, { roomId, player });
      
      socket.emit('joinedGame', { success: true, gameState: game.getGameState() });
      socket.to(roomId).emit('playerJoined', { player: player.name });
      io.to(roomId).emit('gameUpdate', game.getGameState());
    } else {
      socket.emit('joinedGame', { success: false, message: 'Game is full' });
    }
  });
  
  socket.on('playerAction', (data) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.roomId);
    if (!game || game.gameState !== 'playing') return;
    
    const player = game.players.find(p => p.id === socket.id);
    if (!player || player.folded || player.allIn) return;
    
    const { action, amount } = data;
    
    switch (action) {
      case 'fold':
        player.folded = true;
        break;
      case 'call':
        const callAmount = game.currentBet - player.currentBet;
        if (callAmount <= player.chips) {
          player.chips -= callAmount;
          player.currentBet += callAmount;
          game.pot += callAmount;
        }
        break;
      case 'raise':
        const raiseAmount = Math.max(amount, game.bigBlind);
        if (raiseAmount <= player.chips) {
          player.chips -= raiseAmount;
          player.currentBet += raiseAmount;
          game.pot += raiseAmount;
          game.currentBet = player.currentBet;
        }
        break;
      case 'allIn':
        const allInAmount = player.chips;
        player.chips = 0;
        player.currentBet += allInAmount;
        game.pot += allInAmount;
        player.allIn = true;
        if (player.currentBet > game.currentBet) {
          game.currentBet = player.currentBet;
        }
        break;
    }
    
    // Move to next player
    do {
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    } while (game.players[game.currentPlayerIndex].folded || game.players[game.currentPlayerIndex].allIn);
    
    // Check if round is complete
    const activePlayers = game.players.filter(p => !p.folded && !p.allIn);
    if (activePlayers.length <= 1 || game.players.every(p => p.currentBet === game.currentBet || p.folded || p.allIn)) {
      game.nextRound();
    }
    
    io.to(playerData.roomId).emit('gameUpdate', game.getGameState());
  });
  
  socket.on('disconnect', () => {
    const playerData = players.get(socket.id);
    if (playerData) {
      const game = games.get(playerData.roomId);
      if (game) {
        game.removePlayer(socket.id);
        io.to(playerData.roomId).emit('gameUpdate', game.getGameState());
      }
      players.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Poker server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to play!`);
});
