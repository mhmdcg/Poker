// Configuration for the poker game
const config = {
    // Backend URL - change this when deploying
    backendUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'  // Local development
        : 'https://poker-ijem.onrender.com', // Production - Your Render backend!
    
    // Game settings
    maxPlayers: 9,
    startingChips: 1000,
    smallBlind: 10,
    bigBlind: 20,
    
    // UI settings
    cardAnimationSpeed: 300,
    autoRefreshInterval: 1000
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.gameConfig = config;
}
