// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Game variables
let gameState = {
  board: [['', '', ''], ['', '', ''], ['', '', '']],
  players: [],
  currentPlayer: 'X',
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Socket connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add player to the game state
  gameState.players.push({ id: socket.id, symbol: gameState.players.length % 2 === 0 ? 'X' : 'O' });

  // Broadcast updated game state to all clients
  io.emit('gameUpdate', gameState);

  // Handle move event
  socket.on('move', (row, col) => {
    // Check if the move is valid and update the game state accordingly
    if (gameState.board[row][col] === '' && gameState.players.find(player => player.id === socket.id).symbol === gameState.currentPlayer) {
      gameState.board[row][col] = gameState.currentPlayer;
      gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
      io.emit('gameUpdate', gameState);
    }
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    gameState.players = gameState.players.filter(player => player.id !== socket.id);

    // Reset the game if there are no players left
    if (gameState.players.length === 0) {
      gameState.board = [['', '', ''], ['', '', ''], ['', '', '']];
      gameState.currentPlayer = 'X';
    }

    // Broadcast updated game state to all clients
    io.emit('gameUpdate', gameState);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
