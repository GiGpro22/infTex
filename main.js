document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('#board');
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('#message');
    const humanVsHumanBtn = document.querySelector('#human-vs-human');
    const humanVsBotBtn = document.querySelector('#human-vs-bot');
    const resetBtn = document.querySelector('#reset');
    
    let currentPlayer = 'X';
    let gameMode = null;
    let gameActive = false;
    let boardState = ['', '', '', '', '', '', '', '', ''];
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    function initGame(mode) {
        gameMode = mode;
        gameActive = true;
        currentPlayer = 'X';
        boardState = ['', '', '', '', '', '', '', '', ''];
        message.textContent = '';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = 'white';
        });
        
        if (gameMode === 'human-vs-bot' && currentPlayer === 'O') {
            makeBotMove();
        }
    }
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (!gameActive || boardState[clickedCellIndex] !== '') {
            return;
        }
        
        makeMove(clickedCell, clickedCellIndex);
        
        if (gameMode === 'human-vs-bot' && gameActive && currentPlayer === 'O') {
            setTimeout(makeBotMove, 300);
        }
    }
    
    function makeMove(cell, index) {
        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        
        checkResult();
    }
    
    function makeBotMove() {
        if (!gameActive) return;
        
        const availableCells = boardState
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);
        
        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const cellIndex = availableCells[randomIndex];
            const cell = document.querySelector(`[data-index="${cellIndex}"]`);
            
            makeMove(cell, cellIndex);
        }
    }
    
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
                continue;
            }
            
            if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }
    
        if (roundWon) {
            message.textContent = `Игрок ${currentPlayer} победил!`;
            gameActive = false;
            return;
        }
    
        if (!boardState.includes('')) {
            message.textContent = 'Ничья!';
            gameActive = false;
            return;
        }
    
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        if (gameMode === 'human-vs-human') {
            message.textContent = `Ход игрока ${currentPlayer}`;
        }
    }
    
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).style.backgroundColor = '#a5d6a7';
        });
    }
    
    function resetGame() {
        if (gameMode) {
            initGame(gameMode);
        }
    }
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    humanVsHumanBtn.addEventListener('click', () => {
        initGame('human-vs-human');
        message.textContent = 'Ход игрока X';
    });
    
    humanVsBotBtn.addEventListener('click', () => {
        initGame('human-vs-bot');
        message.textContent = 'Ваш ход (X)';
    });
    
    resetBtn.addEventListener('click', resetGame);
});