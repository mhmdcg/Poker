const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state
const gameState = {
  players: [],
  deck: [],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  dealer: 0,
  currentPlayer: 0,
  gamePhase: 'waiting', // waiting, preflop, flop, turn, river, showdown
  minPlayers: 2,
  maxPlayers: 8
};

// Initialize deck
function initializeDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  
  return shuffleDeck(deck);
}

// Shuffle deck
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deal cards to players
function dealCards() {
  gameState.deck = initializeDeck();
  gameState.players.forEach(player => {
    player.hand = [gameState.deck.pop(), gameState.deck.pop()];
    player.bet = 0;
    player.folded = false;
  });
}

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join game
  socket.on('joinGame', (playerName) => {
    if (gameState.players.length >= gameState.maxPlayers) {
      socket.emit('error', 'Game is full');
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      chips: 1000,
      hand: [],
      bet: 0,
      folded: false,
      isDealer: false
    };

    gameState.players.push(player);
    socket.join('poker-table');

    // Update dealer
    if (gameState.players.length === 1) {
      player.isDealer = true;
      gameState.dealer = 0;
    }

    io.to('poker-table').emit('playerJoined', {
      players: gameState.players.map(p => ({
        id: p.id,
        name: p.name,
        chips: p.chips,
        bet: p.bet,
        folded: p.folded,
        isDealer: p.isDealer
      }))
    });

    // Start game if enough players
    if (gameState.players.length >= gameState.minPlayers && gameState.gamePhase === 'waiting') {
      startNewHand();
    }
  });

  // Player action
  socket.on('playerAction', (action) => {
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1) return;

    const player = gameState.players[playerIndex];
    
    switch (action.type) {
      case 'fold':
        player.folded = true;
        break;
      case 'call':
        const callAmount = gameState.currentBet - player.bet;
        if (player.chips >= callAmount) {
          player.chips -= callAmount;
          player.bet += callAmount;
          gameState.pot += callAmount;
        }
        break;
      case 'raise':
        const raiseAmount = action.amount;
        if (player.chips >= raiseAmount) {
          player.chips -= raiseAmount;
          player.bet += raiseAmount;
          gameState.pot += raiseAmount;
          gameState.currentBet = player.bet;
        }
        break;
    }

    // Move to next player
    do {
      gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    } while (gameState.players[gameState.currentPlayer].folded);

    // Check if round is complete
    const activePlayers = gameState.players.filter(p => !p.folded);
    if (activePlayers.length === 1) {
      // Last player wins
      endHand(activePlayers[0]);
    } else {
      // Continue game
      io.to('poker-table').emit('gameUpdate', {
        players: gameState.players.map(p => ({
          id: p.id,
          name: p.name,
          chips: p.chips,
          bet: p.bet,
          folded: p.folded,
          isDealer: p.isDealer
        })),
        pot: gameState.pot,
        currentBet: gameState.currentBet,
        currentPlayer: gameState.currentPlayer,
        gamePhase: gameState.gamePhase,
        communityCards: gameState.communityCards
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      gameState.players.splice(playerIndex, 1);
      
      io.to('poker-table').emit('playerLeft', {
        players: gameState.players.map(p => ({
          id: p.id,
          name: p.name,
          chips: p.chips,
          bet: p.bet,
          folded: p.folded,
          isDealer: p.isDealer
        }))
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

function startNewHand() {
  gameState.pot = 0;
  gameState.currentBet = 0;
  gameState.communityCards = [];
  gameState.gamePhase = 'preflop';
  gameState.currentPlayer = (gameState.dealer + 1) % gameState.players.length;
  
  dealCards();
  
  io.to('poker-table').emit('newHand', {
    players: gameState.players.map(p => ({
      id: p.id,
      name: p.name,
      chips: p.chips,
      bet: p.bet,
      folded: p.folded,
      isDealer: p.isDealer
    })),
    pot: gameState.pot,
    currentBet: gameState.currentBet,
    currentPlayer: gameState.currentPlayer,
    gamePhase: gameState.gamePhase
  });
}

function endHand(winner) {
  winner.chips += gameState.pot;
  gameState.pot = 0;
  
  io.to('poker-table').emit('handEnd', {
    winner: {
      id: winner.id,
      name: winner.name
    },
    players: gameState.players.map(p => ({
      id: p.id,
      name: p.name,
      chips: p.chips,
      bet: p.bet,
      folded: p.folded,
      isDealer: p.isDealer
    }))
  });

  // Start new hand after delay
  setTimeout(() => {
    if (gameState.players.length >= gameState.minPlayers) {
      startNewHand();
    } else {
      gameState.gamePhase = 'waiting';
    }
  }, 3000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Poker server running on port ${PORT}`);
});