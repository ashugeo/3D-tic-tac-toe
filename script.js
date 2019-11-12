$(document).ready(() => {
    $('.marble').each((id, el) => {
        $(el).append(id);
    });

    startGame();
});

const marblesPerPlayer = 13;
const marbles = [];
const lines = {
    red: [],
    black: []
}

function startGame() {
    for (let i = 0; i < marblesPerPlayer * 2; i += 1) {
        const currentPlayer = Object.keys(lines)[i % 2];

        let cell = Math.floor(Math.random() * 9);
        while (marbles[cell] && marbles[cell + 9] && marbles[cell + 2 * 9]) {
            cell = Math.floor(Math.random() * 9);
        }

        while (marbles[cell]) cell += 9;

        $('.marble').eq(cell).addClass('black');
        marbles[cell] = 'black';
    }

    for (let i = 0; i < 9; i += 1) {

        for (let j = 0; j < 3; j += 1) {
            // Avoid starting from last empty marble spot and going up
            if (!marbles[(j * 9 + i)]) continue;

            // X (horizontal, downwards)
            findLines((j * 9 + i) % 3 === 0, 2, i, j);

            // Y (horizontal, sidewards)
            findLines(i < 3, 3, i, j);

            // X/Y (horizontal diagonal, downwards)
            findLines(i === 0, 4, i, j);

            // X/Y (horizontal diagonal, downwards)
            findLines(i === 2, 2, i, j);
        }

        // Z (vertical)
        findLines(true, 9, i);

        // X/Z (diagonal, downwards)
        findLines(i % 3 === 0, 10, i);

        // X/Z (diagonal, upwards)
        findLines(i % 3 === 2, 8, i);

        // Y/Z (diagonal, to right)
        findLines(i < 3, 12, i);

        // Y/Z (diagonal, to left)
        findLines(i > 5, 6, i);
    }

    console.log(lines);
}

/**
 * Find lines
 * @param  {Boolean} condition First condition to check
 * @param  {Number} shift      Shift to add to first marble
 * @param  {Number} [i]        Marble index
 * @param  {Number} [j=0]      Layer (horizontal plane) index
 */
function findLines(condition, shift, i, j = 0) {
    if (
        condition && // check first condition
        marbles[(j * 9 + i)] === marbles[(j * 9 + i) + shift] && // check middle marble
        marbles[(j * 9 + i)] === marbles[(j * 9 + i) + shift * 2] // check last marble
    ) {
        lines[marbles[(j * 9 + i)]].push([(j * 9 + i), (j * 9 + i) + shift, (j * 9 + i) + 2 * shift]);
    }
}
