$(document).ready(() => {
    $('.marble').each((id, el) => {
        // $(el).append(id);
    });

    createIllo();
    // startGame();
});

let illo;

const marblesPerPlayer = 13;
const marbles = [];
const lines = {
    red: [],
    black: []
}

const width = 800;
const height = 800;

const colors = ['#ea0', '#c25'];

const diameter = 100;
const margin = diameter * 2;

function createIllo() {
    // create illo
    illo = new Zdog.Illustration({
        // set canvas with selector
        element: '.zdog-canvas',
        dragRotate: false,
        rotate: {
            x: -1,
            y: 0.6
        }
    });

    let i = 0;
    for (let y = -2 * diameter; y <= 0; y += diameter) {
        for (let z = -margin; z < 2 * margin; z += margin) {
            for (let x = -margin; x < 2 * margin; x += margin) {
                const rand = Math.floor(Math.random() * 2);
                const shape = new Zdog.Shape({
                    addTo: illo,
                    stroke: diameter,
                    color: colors[rand],
                    translate: { x, y, z }
                });
                shape.index = i;
                marbles.push(shape);

                i += 1;
            }
        }
    }

    // update & render
    illo.updateRenderGraph();

    // start animation
    animate();
}

function animate() {
    illo.rotate.y += 0.002;
    illo.updateRenderGraph();

    // animate next frame
    requestAnimationFrame(animate);
}

$(document).on('mousemove', 'canvas', e => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();

    const coords = {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };

    const marblesHovered = marbles.filter(marble => Math.abs(coords.x - (marble.renderFront.x + width / 2)) < diameter / 2 && Math.abs(coords.y - (marble.renderFront.y + height / 2)) < diameter / 2);
    if (marblesHovered.length) {
        const frontMarble = marblesHovered.reduce((frontMarble, marble) => frontMarble.renderFront.z > marble.renderFront.z ? frontMarble : marble);
        console.log(frontMarble.index);
    }
})

function startGame() {
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
            // Avoid starting from last empty marble spot and going up
            if (!marbles[(j * 9 + i)]) continue;

            // X (horizontal, downwards)
            findLines((j * 9 + i) % 3 === 0, 1, i, j);

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

    setTimeout(() => {
        $('.board').addClass('transparent');
    }, 1000);

    let i = 0;
    for (const player of Object.keys(lines)) {
        for (const line of lines[player]) {
            setTimeout(() => {
                $('.marble.visible').removeClass('visible');
                line.forEach(id => {
                    $('.marble').eq(id).addClass('visible');
                });
            }, i * 1000);
            i += 1;
        }
    }
}

/**
 * Find lines
 * @param  {Boolean} condition First condition to check
 * @param  {Number}  shift     Shift to add to first marble
 * @param  {Number}  [i]       Marble index
 * @param  {Number}  [j=0]     Layer (horizontal plane) index
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
