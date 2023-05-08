const socket = io();

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    socket.emit('move', parseInt(row), parseInt(col));
  });
});

socket.on('gameUpdate', gameState => {
  // Update the board
  gameState.board.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`);
      cell.textContent = cellValue;
    });
  });
});
