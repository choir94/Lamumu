const puzzleContainer = document.getElementById('puzzle-container');
const messageElement = document.getElementById('message');
const difficultySelect = document.getElementById('difficulty');

// --- Game Configuration ---
const imageSrc = 'images/main-image.jpg'; // Your image file name
let rows = parseInt(difficultySelect.value);
let cols = parseInt(difficultySelect.value);

let pieces = [];
let dragStartPiece;

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to create and display puzzle pieces
function createPuzzle() {
    // Read the current difficulty from the dropdown
    rows = parseInt(difficultySelect.value);
    cols = parseInt(difficultySelect.value);
    const totalPieces = rows * cols;
    const puzzleSize = 400; // Assuming a 400x400px image container

    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    pieces = [];

    // Create the puzzle pieces
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.dataset.index = i; // Store the original index
        
        // Calculate the background position to "cut" the image
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = (100 / (cols - 1)) * col;
        const y = (100 / (rows - 1)) * row;

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${puzzleSize}px ${puzzleSize}px`;
        piece.style.backgroundPosition = `${x}% ${y}%`;
        pieces.push(piece);
    }
}

// Function to shuffle and display the puzzle
window.startGame = function() {
    messageElement.textContent = '';
    createPuzzle();
    shuffle(pieces);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
}

// Function to check if the puzzle is solved
function checkWin() {
    const currentPieces = Array.from(puzzleContainer.children);
    const solved = currentPieces.every((piece, index) => {
        return parseInt(piece.dataset.index) === index;
    });

    if (solved) {
        messageElement.textContent = 'Congratulations, you won!';
    }
}

// Event listeners for drag-and-drop
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

// Start the game when the page loads
startGame();
