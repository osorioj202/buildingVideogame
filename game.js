const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    

    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.75;
    } else {
        canvasSize = window.innerHeight * 0.75;
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementSize = canvasSize / 10;

    startGame();   
}


function startGame() {

    // console.log({canvasSize, elementSize});

    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    // console.log({map, mapRows, mapRowCols});
    // console.log(mapRowCols[9][0]);

    // console.log(map);

    // for (let row = 1; row <= 10; row++){
    //     for (let col = 1; col <= 10; col++){
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementSize * col, elementSize * row);
    //     }    
    // }

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    // console.log('jugador');
                    // console.log({posX, posY});
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log(playerPosition.x, playerPosition.y );
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
                // console.log(giftPosition.x, giftPosition.y);
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY)
        });
    });

   movePlayer();
}

// console.log(maps[0].split('\n'));
// console.log(maps[0].split(' '));
// console.log(maps[0].trim().split('\n'));

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
        // console.log('Subiste de Nivel!!');
    } 

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
}

function levelWin() {
    console.log('subiste de nivel');
    level++;
    startGame();
}

function gameWin() {
    console.log('se acabo');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD';
        } else {
            pResult.innerHTML = 'no superaste el record LOCA!!!';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
    }
    console.log({recordTime, playerTime});
}

function levelFail() {
    console.log('moriste loca!!!');
    lives--;


    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
    console.log('tienes ' + lives + ' vidas');

}

function showLives() {
const heartsArray = Array(lives).fill(emojis['HEART'])
    // console.log(heartsArray);

    spanLives.innerHTML = ""
    heartsArray.forEach(heart => spanLives.append(heart));
    // spanLives.innerHTML = emojis['HEART'];
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') {
        moveUp();
    } else if(event.key == 'ArrowLeft') {
        moveLeft();
    } else if(event.key == 'ArrowRight') {
        moveRight();
    } else if(event.key == 'ArrowDown') {
        moveDown();
    }
}

function moveUp() {

    if (playerPosition.y - elementSize < elementSize) {
        console.log('OUT');
    } else {
        console.log('arriba');
        playerPosition.y -= elementSize;
        startGame();
        console.log(playerPosition.x, playerPosition.y );
        console.log(giftPosition.x, giftPosition.y );
    }

}

function moveLeft() {
    if (playerPosition.x - elementSize < elementSize) {
        console.log('OUT');
    } else {
    console.log('izquierda');
    playerPosition.x -= elementSize;
    startGame();
    console.log(giftPosition.x, giftPosition.y );
    console.log(playerPosition.x, playerPosition.y );
    }

}

function moveRight() {
    if (playerPosition.x + elementSize > canvasSize) {
        console.log('OUT');
    } else {
    console.log('derecha');
    playerPosition.x += elementSize;
    startGame();
    console.log(playerPosition.x, playerPosition.y );
    console.log(giftPosition.x, giftPosition.y );
    }
}

function moveDown() {
    if (playerPosition.y + elementSize > canvasSize) {
        console.log('OUT');
    } else {
        console.log('abajo');
        playerPosition.y += elementSize;
        startGame();
        console.log(playerPosition.x, playerPosition.y );
        console.log(giftPosition.x, giftPosition.y );
    }

}
