$(document).ready(() => {
    $('.marble').each((id, el) => {
        $(el).append(id);
    });

    startGame();
});

function startGame() {
    const marblesPerPlayer = 13;
    const marbles = [];
    const lines = {
        red: [],
        black: []
    }

    for (let i = 0; i < marblesPerPlayer * 2; i += 1) {
        const currentPlayer = Object.keys(lines)[i % 2];

        let cell = Math.floor(Math.random() * 9);
        while (marbles[cell] && marbles[cell + 9] && marbles[cell + 2 * 9]) {
            cell = Math.floor(Math.random() * 9);
        }

        while (marbles[cell]) cell += 9;

        $('.marble').eq(cell).addClass(currentPlayer);
        marbles[cell] = currentPlayer;
    }

    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 3; j += 1) {
            if (!marbles[(j * 9 + i)]) continue;

            // X (horizontal, downwards)
            if ((j * 9 + i) % 3 === 0 && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 1] && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 2]) {
                lines[marbles[(j * 9 + i)]].push([(j * 9 + i), (j * 9 + i) + 1, (j * 9 + i) + 2]);
            }

            // Y (horizontal, sidewards)
            if (i < 3 && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 3] && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 2 * 3]) {
                lines[marbles[(j * 9 + i)]].push([(j * 9 + i), (j * 9 + i) + 3, (j * 9 + i) + 2 * 3]);
            }

            // X/Y (horizontal diagonal, downwards)
            if (i === 0 && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 4] && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 2 * 4]) {
                lines[marbles[(j * 9 + i)]].push([(j * 9 + i), (j * 9 + i) + 4, (j * 9 + i) + 2 * 4]);
            }

            // X/Y (horizontal diagonal, downwards)
            if (i === 2 && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 2] && marbles[(j * 9 + i)] === marbles[(j * 9 + i) + 2 * 2]) {
                lines[marbles[(j * 9 + i)]].push([(j * 9 + i), (j * 9 + i) + 2, (j * 9 + i) + 2 * 2]);
            }
        }

        // Z (vertical)
        if (marbles[i] === marbles[i + 9] && marbles[i] === marbles[i + 2 * 9]) lines[marbles[i]].push([i, i + 9, i + 2 * 9]);

        // X/Z (diagonal, downwards)
        if (i % 3 === 0 && marbles[i] === marbles[i + 10] && marbles[i] === marbles[i + 2 * 10]) {
            lines[marbles[i]].push([i, i + 10, i + 2 * 10]);
        }

        // X/Z (diagonal, upwards)
        if (i % 3 === 2 && marbles[i] === marbles[i + 8] && marbles[i] === marbles[i + 2 * 8]) {
            lines[marbles[i]].push([i, i + 8, i + 2 * 8]);
        }

        // Y/Z (diagonal, to right)
        if (i < 3 && marbles[i] === marbles[i + 12] && marbles[i] === marbles[i + 2 * 12]) {
            lines[marbles[i]].push([i, i + 12, i + 2 * 12]);
        }

        // Y/Z (diagonal, to left)
        if (i > 5 && marbles[i] === marbles[i + 6] && marbles[i] === marbles[i + 2 * 6]) {
            lines[marbles[i]].push([i, i + 6, i + 2 * 6]);
        }
    }
    
    console.log(lines);
}
