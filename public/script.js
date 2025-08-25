// Connect to Socket.IO server
const socket = io();

// Game state
let currentPlayer = null;
let gameData = {
    players: [],
    pot: 0,
    currentBet: 0,
    currentPlayer: 0,
    gamePhase: 'waiting',
    communityCards: []
};

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const playerNameInput = document.getElementById('playerName');
const joinGameBtn = document.getElementById('joinGameBtn');
const playersContainer = document.getElementById('playersContainer');
const playerActions = document.getElementById('playerActions');
const foldBtn = document.getElementById('foldBtn');
const callBtn = document.getElementById('callBtn');
const raiseBtn = document.getElementById('raiseBtn');
const raiseSlider = document.getElementById('raiseSlider');
const raiseAmount = document.getElementById('raiseAmount');
const gamePhase = document.getElementById('gamePhase');
const pot = document.getElementById('pot');
const winnerInfo = document.getElementById('winnerInfo');
const continueBtn = document.getElementById('continueBtn');

// Event listeners
joinGameBtn.addEventListener('click', joinGame);
foldBtn.addEventListener('click', () => performAction('fold'));
callBtn.addEventListener('click', () => performAction('call'));
raiseBtn.addEventListener('click', () => performAction('raise'));
raiseSlider.addEventListener('input', updateRaiseAmount);
continueBtn.addEventListener('click', hideGameOver);

// Enter key to join game
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinGame();
    }
});

function joinGame() {
    const playerName = playerNameInput.value.trim();
    if (playerName.length < 2) {
        alert('Please enter a name (at least 2 characters)');
        return;
    }
    
    socket.emit('joinGame', playerName);
    currentPlayer = playerName;
}

function performAction(actionType) {
    if (actionType === 'raise') {
        const amount = parseInt(raiseSlider.value);
        socket.emit('playerAction', { type: 'raise', amount });
    } else {
        socket.emit('playerAction', { type: actionType });
    }
}

function updateRaiseAmount() {
    raiseAmount.textContent = `$${raiseSlider.value}`;
}

function hideGameOver() {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

// Socket event handlers
socket.on('playerJoined', (data) => {
    gameData.players = data.players;
    updateGameDisplay();
    
    if (data.players.length >= 2) {
        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }
});

socket.on('newHand', (data) => {
    gameData = data;
    updateGameDisplay();
    showPlayerHand();
});

socket.on('gameUpdate', (data) => {
    gameData = data;
    updateGameDisplay();
});

socket.on('handEnd', (data) => {
    gameData.players = data.players;
    winnerInfo.innerHTML = `
        <h3>🎉 ${data.winner.name} wins!</h3>
        <p>Won $${gameData.pot}</p>
    `;
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
});

socket.on('playerLeft', (data) => {
    gameData.players = data.players;
    updateGameDisplay();
});

socket.on('error', (message) => {
    alert(message);
});

// Update game display
function updateGameDisplay() {
    // Update players
    playersContainer.innerHTML = '';
    gameData.players.forEach((player, index) => {
        const playerElement = createPlayerElement(player, index);
        playersContainer.appendChild(playerElement);
    });
    
    // Update game status
    gamePhase.textContent = getGamePhaseText(gameData.gamePhase);
    pot.textContent = `Pot: $${gameData.pot}`;
    
    // Update action buttons
    updateActionButtons();
}

function createPlayerElement(player, index) {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    
    if (index === gameData.currentPlayer) {
        playerDiv.classList.add('current');
    }
    
    if (player.isDealer) {
        playerDiv.classList.add('dealer');
    }
    
    if (player.folded) {
        playerDiv.classList.add('folded');
    }
    
    playerDiv.innerHTML = `
        <div class="player-name">${player.name}</div>
        <div class="player-chips">$${player.chips}</div>
        ${player.bet > 0 ? `<div class="player-bet">Bet: $${player.bet}</div>` : ''}
    `;
    
    return playerDiv;
}

function getGamePhaseText(phase) {
    const phases = {
        'waiting': 'Waiting for players...',
        'preflop': 'Pre-flop',
        'flop': 'Flop',
        'turn': 'Turn',
        'river': 'River',
        'showdown': 'Showdown'
    };
    return phases[phase] || phase;
}

function updateActionButtons() {
    const isCurrentPlayer = gameData.players[gameData.currentPlayer]?.name === currentPlayer;
    
    foldBtn.disabled = !isCurrentPlayer;
    callBtn.disabled = !isCurrentPlayer;
    raiseBtn.disabled = !isCurrentPlayer;
    
    if (isCurrentPlayer) {
        const currentPlayerData = gameData.players[gameData.currentPlayer];
        const callAmount = gameData.currentBet - currentPlayerData.bet;
        
        callBtn.textContent = callAmount > 0 ? `Call $${callAmount}` : 'Check';
        
        // Update raise slider max value
        const maxRaise = Math.min(currentPlayerData.chips, 100);
        raiseSlider.max = maxRaise;
        if (parseInt(raiseSlider.value) > maxRaise) {
            raiseSlider.value = maxRaise;
            updateRaiseAmount();
        }
    }
}

function showPlayerHand() {
    // For now, we'll show placeholder cards
    // In a full implementation, you'd get the actual cards from the server
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    
    card1.className = 'card';
    card2.className = 'card';
    
    card1.textContent = '🂡';
    card2.textContent = '🂱';
}

// Initialize raise slider
updateRaiseAmount();