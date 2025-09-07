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

    const availableSymbols = ['X', 'O', '★', '❤️', '💀', '☀️'];
    let playerSymbols = [];
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let isVsAI = false;
    let playerSymbol, aiSymbol;
    let isChaosMode = false;

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

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        checkResult();

        if (isVsAI && isGameActive && currentPlayer === aiSymbol) {
            setTimeout(aiMove, 500);
        }
    };

    const makeMove = (cell, index, player) => {
        board[index] = player;
        let className = `player-${player.toLowerCase()}`;
        if (!['X', 'O'].includes(player)) {
            const symbolNames = { '★': 'star', '❤️': 'heart', '💀': 'skull', '☀️': 'sun' };
            className = `player-${symbolNames[player]}`;
        }
        cell.innerHTML = player;
        cell.classList.add(className);
        anime({
            targets: cell,
            scale: [1.2, 1],
            easing: 'easeOutQuad',
            duration: 300
        });
        changePlayer();
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
        if (isChaosMode) {
            playerSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
            aiSymbol = availableSymbols.filter(s => s !== playerSymbol)[Math.floor(Math.random() * (availableSymbols.length - 1))];
        }
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
            const winner = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
            messageText.innerHTML = `'${winner}' Menang 🎉`;
            isGameActive = false;
            animateWinningCells(winningCells);
            showMessage('winner');
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            messageText.innerHTML = `Hasil Seri 😊`;
            isGameActive = false;
            showMessage('draw');
            return;
        }
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
        const bestMove = findBestMove(board, aiSymbol);
        if (bestMove !== null) {
            const cell = cells[bestMove];
            makeMove(cell, bestMove, aiSymbol);
            checkResult();
        }
    };

    // Logika Minimax tetap sama
    const findBestMove = (board, player) => {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const minimax = (board, depth, isMaximizingPlayer) => {
        let score = checkScore(board);

        if (score !== null) {
            return score;
        }

        let emptySpots = board.filter(spot => spot === '');
        if (emptySpots.length === 0) {
            return 0;
        }

        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = aiSymbol;
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[i] = '';
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = playerSymbol;
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[i] = '';
                }
            }
            return bestScore;
        }
    };

    const checkScore = (board) => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === board[b] && board[b] === board[c]) {
                if (board[a] === aiSymbol) return 10;
                if (board[a] === playerSymbol) return -10;
            }
        }
        return null;
    };

    const showMessage = (type) => {
        messageContainer.classList.add(type);
        messageContainer.classList.remove('hidden');
    };

    const hideMessage = () => {
        messageContainer.classList.add('hidden');
        messageContainer.classList.remove('winner', 'draw');
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
        
        // Pilihan simbol acak untuk setiap pemain
        const shuffledSymbols = [...availableSymbols];
        shuffleArray(shuffledSymbols);
        playerSymbol = shuffledSymbols[0];
        aiSymbol = shuffledSymbols[1];
        currentPlayer = playerSymbol;
        
        board = ['', '', '', '', '', '', '', '', ''];
        hideMessage();
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.className = 'cell'; // Reset semua kelas
            anime.remove(cell);
        });

        if (isVsAI && currentPlayer === aiSymbol) {
            setTimeout(aiMove, 500);
        }
    };

    // Event Listeners
    playerVsPlayerBtn.addEventListener('click', () => {
        isChaosMode = true; // Aktifkan mode chaos
        startGame(false);
    });

    playerVsAiBtn.addEventListener('click', () => {
        isChaosMode = false; // Nonaktifkan mode chaos untuk lawan AI
        startGame(true);
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
    newGameBtn.addEventListener('click', () => {
        restartGame();
        modeSelection.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        restartBtn.classList.add('hidden');
    });
});