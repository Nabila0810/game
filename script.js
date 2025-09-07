document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.querySelector('.restart-btn');
    const messageContainer = document.querySelector('.message-container');
    const messageText = document.getElementById('message-text');
    const newGameBtn = document.getElementById('new-game-btn');
    const modeSelection = document.querySelector('.mode-selection');
    const gameContainer = document.querySelector('.game-container');
    const playerVsPlayerBtn = document.getElementById('player-vs-player-btn');
    const playerVsAiBtn = document.getElementById('player-vs-ai-btn');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let isVsAI = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        checkResult();

        if (isVsAI && isGameActive) {
            setTimeout(aiMove, 500);
        }
    };

    const makeMove = (cell, index, player) => {
        board[index] = player;
        cell.innerHTML = player;
        cell.classList.add(`player-${player.toLowerCase()}`);
        anime({
            targets: cell,
            scale: [1.2, 1],
            easing: 'easeOutQuad',
            duration: 300
        });
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    const checkResult = () => {
        let roundWon = false;
        let winningCells = null;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }

            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }

        if (roundWon) {
            messageText.innerHTML = `'${currentPlayer}' Menang 🎉`;
            isGameActive = false;
            animateWinningCells(winningCells);
            showMessage();
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            messageText.innerHTML = `Hasil Seri 😊`;
            isGameActive = false;
            showMessage();
            return;
        }

        changePlayer();
    };

    const animateWinningCells = (winningCells) => {
        anime({
            targets: winningCells.map(index => cells[index]),
            backgroundColor: '#FFD700',
            duration: 1000,
            easing: 'easeInOutQuad',
            loop: true,
            direction: 'alternate'
        });
    };

    const aiMove = () => {
        let emptyCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        if (emptyCells.length === 0 || !isGameActive) return;
        
        // AI sederhana: ambil sel acak
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];
        const cell = cells[cellIndex];
        
        makeMove(cell, cellIndex, currentPlayer);
        checkResult();
    };

    const showMessage = () => {
        messageContainer.classList.remove('hidden');
    };

    const hideMessage = () => {
        messageContainer.classList.add('hidden');
    };

    const startGame = (vsAI) => {
        isVsAI = vsAI;
        modeSelection.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        restartBtn.classList.remove('hidden');
        restartGame();
    };

    const restartGame = () => {
        isGameActive = true;
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        hideMessage();
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('player-x', 'player-o');
            cell.style.backgroundColor = ''; // Reset background color
            anime.remove(cell); // Stop any ongoing animation
        });
    };

    // Event Listeners
    playerVsPlayerBtn.addEventListener('click', () => startGame(false));
    playerVsAiBtn.addEventListener('click', () => startGame(true));
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
    newGameBtn.addEventListener('click', () => {
        restartGame();
        modeSelection.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        restartBtn.classList.add('hidden');
    });
});