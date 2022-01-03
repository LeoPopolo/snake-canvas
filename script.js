var ctx;
var arrayRandomPosX = [];
var arrayRandomPosY = [];

var arrayRandomSpecialPosX = [];
var arrayRandomSpecialPosY = [];

var snake = []; 

var fruit = {
    x: null,
    y: null,
    points: 10
}

var specialFruit = {
    x: null,
    y: null,
    points: 50
}

var score = 0;
var scoreHTML;
var intervalId;
var speed = 300;
var canvas;
var gameover = false;
var firstSpecialFruit = true;
var specialFruitEaten = false;

window.onload = function() {

    scoreHTML = document.getElementById("score");
    scoreHTML.innerHTML = "Score: " + score;
    snake.push({
        width: 20,
        height: 20,
        x: 20,
        y: 20,
        color: "#1c701c",
        dir: "right"
    });
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 1000;
    ctx.canvas.height = 800;

    createRandomFruit();
    loop();
    specialFruitLoop();
    
    document.addEventListener('keydown', function(e) {
        lastDownTarget = event.target;

        if (e.keyCode === 37) {
            if (snake[0].dir !== "right") {
                snake[0].dir = "left";
                moveSnake();
            }
        } else if (e.keyCode === 38) {
            if (snake[0].dir !== "bottom") {
                snake[0].dir = "top";
                moveSnake();
            }
        } else if (e.keyCode === 39) {
            if (snake[0].dir !== "left") {
                snake[0].dir = "right";
                moveSnake();
            }
        } else if (e.keyCode === 40) {
            if (snake[0].dir !== "top") {
                snake[0].dir = "bottom";
                moveSnake();
            }
        }

    }, false);
}

function loop() {
    
    moveSnake();
    if (!gameover) {
        window.setTimeout(loop, speed);
    }
}

function specialFruitLoop() {
    
    if (!firstSpecialFruit && !specialFruitEaten){
        createRandomSpecialFruit();
    }

    specialFruitEaten = false;
    firstSpecialFruit = false;

    if (!gameover) {
        window.setTimeout(specialFruitLoop, 12000);
    }
}

function fruitCollision() {
    if (fruit.x === snake[0].x && fruit.y === snake[0].y) {
        score += fruit.points;
        scoreHTML.innerHTML = "Score: " + score;
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        });
        
        if (score % 10 === 0 && speed > 50) {
            speed -= 10;
        }
        createRandomFruit();
    }
}

function specialFruitCollision() {
    if (specialFruit.x === snake[0].x && specialFruit.y === snake[0].y) {
        score += specialFruit.points;
        scoreHTML.innerHTML = "Score: " + score;
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        },
        {
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        },
        {
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        });

        clearSpecialFruit();
        specialFruit.x = -20;
        specialFruit.y = -20;
        specialFruitEaten = true;
    }
}

function snakeCollision() {

    for (let i = 1 ; i < snake.length ; i ++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    alert("game over. Score: " + score);
    gameover = true;
}

function createRandomFruit() {
    let randomx;
    let randomy;

    arrayRandomPosX = [];
    arrayRandomPosY = [];
    
    for (let i = 0; i < snake.length; i ++) {
        for (let j = 0; j <= canvas.width - 20; j += 20) {
            if (snake[i].x !== j && j !== fruit.x) {
                arrayRandomPosX.push(j);
            }
        }
    }

    for (let i = 0; i < snake.length; i ++) {
        for (let j = 0; j <= canvas.height - 20; j += 20) {
            if (snake[i].y !== j && j !== fruit.y) {
                arrayRandomPosY.push(j);
            }
        }
    }

    randomx = Math.floor((Math.random() * (arrayRandomPosX.length)) + 0);
    randomy = Math.floor((Math.random() * (arrayRandomPosY.length)) + 0);

    fruit.x = arrayRandomPosX[randomx];
    fruit.y = arrayRandomPosY[randomy];
    clearFruit();
    drawFruit();
}

function createRandomSpecialFruit() {
    let randomx;
    let randomy;

    arrayRandomSpecialX = [];
    arrayRandomSpecialY = [];

    clearSpecialFruit();
    for (let i = 0; i < snake.length; i ++) {
        for (let j = 0; j <= canvas.width - 20; j += 20) {
            if (snake[i].x !== j && j !== specialFruit.x) {
                arrayRandomSpecialX.push(j);
            }
        }
    }

    for (let i = 0; i < snake.length; i ++) {
        for (let j = 0; j <= canvas.height - 20; j += 20) {
            if (snake[i].y !== j && j !== specialFruit.y) {
                arrayRandomSpecialY.push(j);
            }
        }
    }

    randomx = Math.floor((Math.random() * (arrayRandomSpecialX.length)) + 0);
    randomy = Math.floor((Math.random() * (arrayRandomSpecialY.length)) + 0);

    specialFruit.x = arrayRandomSpecialX[randomx];
    specialFruit.y = arrayRandomSpecialY[randomy];

    setTimeout(() => {
        if (specialFruit.x !== -20) {
            clearSpecialFruit();
            specialFruit.x = -20;
            specialFruit.y = -20;
        }
    }, 5000);

    drawSpecialFruit();
}

function moveSnake() {

    clearSnake();
    fruitCollision();
    specialFruitCollision();
    if (snake[0].dir === "left" ) {
        if (snake[0].x === 0) {
            gameOver();
        } else {
            if (1 < snake.length) {
                for (let i = snake.length - 1 ; i >= 1 ; i --) {
                    snake[i].x = snake[i-1].x;
                    snake[i].y = snake[i-1].y;
                }
            }
            snake[0].x -= 20;
        }
    } else if (snake[0].dir === "top" ) {
        if (snake[0].y === 0) {
            gameOver();
        } else {
            if (1 < snake.length) {
                for (let i = snake.length - 1 ; i >= 1 ; i --) {
                    snake[i].x = snake[i-1].x;
                    snake[i].y = snake[i-1].y;
                }
            }
            snake[0].y -= 20;
        }
    } else if (snake[0].dir === "right" ) {
        if (snake[0].x === canvas.width - 20) {
            gameOver();
        } else {
            if (1 < snake.length) {
                for (let i = snake.length - 1 ; i >= 1 ; i --) {
                    snake[i].x = snake[i-1].x;
                    snake[i].y = snake[i-1].y;
                }
            }
            snake[0].x += 20;
        }
    } else if (snake[0].dir === "bottom" ) {
        if (snake[0].y === canvas.height - 20) {
            gameOver();
        } else {
            if (1 < snake.length) {
                for (let i = snake.length - 1 ; i >= 1 ; i --) {
                    snake[i].x = snake[i-1].x;
                    snake[i].y = snake[i-1].y;
                }
            }
            snake[0].y += 20;
        }
    }
    snakeCollision();
    drawSnake();
}

function drawSnake() {
    ctx.fillStyle = snake[0].color;
    for (let i = 0 ; i < snake.length; i ++) {
        ctx.fillRect(snake[i].x, snake[i].y, snake[0].width, snake[0].height);    
    }
}

function clearSnake() {
    ctx.clearRect(snake[snake.length - 1].x, snake[snake.length - 1].y, snake[0].width, snake[0].height);    
}

function drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.x, fruit.y, 20, 20);    
}

function clearFruit() {
    ctx.clearRect(fruit.x, fruit.y, 20, 20);
}

function drawSpecialFruit() {

    let colorsArray = ["yellow", "green", "orange", "red", "pink", "purple"];
    var i = 0;

    setInterval(function() {
        ctx.fillStyle = colorsArray[i];
        if (specialFruit.x !== -20 && specialFruit.y !== -20) {
            ctx.fillRect(specialFruit.x, specialFruit.y, 20, 20);    
        }
        i++;
        if (i === 6) {
            i = 0;
        }
    }, 200);
}

function clearSpecialFruit() {
    ctx.clearRect(specialFruit.x, specialFruit.y, 20, 20);
}