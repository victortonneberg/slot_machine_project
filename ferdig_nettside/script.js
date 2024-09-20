const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    '🍒': 2,
    '🍋': 4,
    '🍊': 6,
    '🍇': 8
};

const SYMBOL_VALUES = {
    '🍒': 5,
    '🍋': 4,
    '🍊': 3,
    '🍇': 2
};

let balance = 0;

document.getElementById('depositBtn').addEventListener('click', () => {
    const depositAmount = parseFloat(document.getElementById('depositAmount').value);
    if (!isNaN(depositAmount) && depositAmount > 0) {
        balance += depositAmount;
        updateBalance();
        document.getElementById('message').textContent = `Innskudd på $${depositAmount} lagt til.`;
    } else {
        document.getElementById('message').textContent = 'Ugyldig innskuddsbeløp. Prøv igjen.';
    }
});

document.getElementById('spinBtn').addEventListener('click', () => {
    const lines = parseInt(document.getElementById('lines').value);
    const bet = parseFloat(document.getElementById('bet').value);

    if (isNaN(lines) || lines < 1 || lines > 3 || isNaN(bet) || bet <= 0 || bet * lines > balance) {
        document.getElementById('message').textContent = 'Ugyldig innsats eller antall linjer. Prøv igjen.';
        return;
    }

    balance -= bet * lines;
    updateBalance();
    
    const reels = spin();
    animateSpin(reels, () => {
        const rows = transpose(reels);
        displayReels(rows);
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        updateBalance();

        if (winnings > 0) {
            document.getElementById('message').textContent = `Gratulerer! Du vant $${winnings}!`;
            document.getElementById('slot-machine').classList.add('winner');
            setTimeout(() => {
                document.getElementById('slot-machine').classList.remove('winner');
            }, 3000);
        } else {
            document.getElementById('message').textContent = 'Bedre lykke neste gang!';
        }

        if (balance <= 0) {
            document.getElementById('message').textContent += ' Du har gått tom for penger!';
            document.getElementById('spinBtn').disabled = true;
        }
    });
});

function updateBalance() {
    document.getElementById('balanceAmount').textContent = balance.toFixed(2);
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function displayReels(rows) {
    const reels = document.querySelectorAll('.reel');
    reels.forEach((reel, i) => {
        const symbols = reel.querySelector('.symbols');
        symbols.innerHTML = '';
        for (let j = 0; j < ROWS; j++) {
            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            symbol.textContent = rows[j][i];
            symbols.appendChild(symbol);
        }
    });
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

function animateSpin(reels, callback) {
    const reelElements = document.querySelectorAll('.reel');
    reelElements.forEach((reel) => reel.classList.add('spinning'));

    setTimeout(() => {
        reelElements.forEach((reel) => reel.classList.remove('spinning'));
        callback();
    }, 1000);
}

updateBalance();

// Initialisere symbolene
const initialReels = [
    ['🍒', '🍋', '🍊'],
    ['🍇', '🍒', '🍋'],
    ['🍊', '🍇', '🍒']
];
displayReels(initialReels);