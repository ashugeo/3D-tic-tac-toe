$(document).ready(() => {
    $('.marble').each((id, el) => {
        // $(el).append(id);
    });

    createIllo();
    // startGame();
});

let illo;

const marbles = [];
const lines = {
    red: [],
    black: []
}

const width = 800;
const height = 800;

const colors = ['#ea0', '#c25'];

let currentPlayer = 0;

const diameter = 100;
const margin = diameter * 2;

let hoveredMarble;

function createIllo() {
    // create illo
    illo = new Zdog.Illustration({
        // set canvas with selector
        element: '.zdog-canvas',
        // dragRotate: true,
        rotate: {
            x: -0.95,
            y: 0.95
        }
    });

    let i = 0;
    for (let y = 2; y >= 0; y -= 1) {
        for (let z = -1; z < 2; z += 1) {
            for (let x = -1; x < 2; x += 1) {
                const rand = Math.floor(Math.random() * 2);
                const shape = new Zdog.Shape({
                    addTo: illo,
                    stroke: diameter,
                    color: '#222324',
                    translate: {
                        x: x * margin,
                        y: y * diameter,
                        z: z * margin
                    },
                    visible: y === 2 ? true : false
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
    // illo.rotate.y += 0.002;
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

    const marblesHovered = marbles.filter(marble => marble.visible && Math.abs(coords.x - (marble.renderFront.x + width / 2)) < diameter / 2 && Math.abs(coords.y - (marble.renderFront.y + height / 2)) < diameter / 2);
    if (marblesHovered.length) {
        const frontMarble = marblesHovered.reduce((frontMarble, marble) => frontMarble.renderFront.z > marble.renderFront.z ? frontMarble : marble);
        hoveredMarble = frontMarble;
    } else {
        hoveredMarble = null;
    }
});

$(document).on('click', 'canvas', () => {
    if (!hoveredMarble || hoveredMarble.played) return;

    currentPlayer = (currentPlayer + 1) % 2;
    console.log(hoveredMarble.index);
    hoveredMarble.played = true;
    hoveredMarble.color = colors[currentPlayer];

    const marbleAbove = marbles.find(marble => marble.index === hoveredMarble.index + 9);
    if (marbleAbove) marbleAbove.visible = true;

    console.log(currentPlayer);
});

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
