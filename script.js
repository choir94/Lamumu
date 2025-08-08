const puzzleContainer = document.getElementById('puzzle-container');
const messageElement = document.getElementById('message');

// Game configuration
const imageSrc = 'images/main-image.jpg'; // Ganti dengan nama file gambar Anda
const rows = 3; // Number of puzzle rows
const cols = 3; // Number of puzzle columns
const totalPieces = rows * cols;

let pieces = [];
let dragStartPiece;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createPuzzle() {
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    pieces = [];

    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.dataset.index = i;
        
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = (100 / (cols - 1)) * col;
        const y = (100 / (rows - 1)) * row;

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundPosition = `${x}% ${y}%`;
        pieces.push(piece);
    }
}

function startGame() {
    messageElement.textContent = '';
    createPuzzle();
    shuffle(pieces);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
}

function checkWin() {
    const currentPieces = Array.from(puzzleContainer.children);
    const solved = currentPieces.every((piece, index) => {
        return parseInt(piece.dataset.index) === index;
    });

    if (solved) {
        messageElement.textContent = 'Congratulations, you won!';
    }
}

puzzleContainer.addEventListener('dragstart', (e) => {
    dragStartPiece = e.target;
});

puzzleContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

puzzleContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const dragEndPiece = e.target.closest('.puzzle-piece');
    if (dragEndPiece && dragStartPiece !== dragEndPiece) {
        const container = puzzleContainer;
        const temp = document.createElement('div');
        
        container.insertBefore(temp, dragEndPiece);
        container.insertBefore(dragEndPiece, dragStartPiece);
        container.insertBefore(dragStartPiece, temp);
        container.removeChild(temp);

        checkWin();
    }
});

startGame();
