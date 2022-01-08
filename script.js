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

const colorsArray = ["./sprites/apple_rainbow_1.png", "./sprites/apple_rainbow_2.png", "./sprites/apple_rainbow_3.png", "./sprites/apple_rainbow_4.png", "./sprites/apple_rainbow_5.png", "./sprites/apple_rainbow_6.png"];
const snakeArray = ["./sprites/snake_down.png", "./sprites/snake_up.png", "./sprites/snake_left.png", "./sprites/snake_right.png", "./sprites/snake_body.png", "./sprites/snake_tail_down.png", "./sprites/snake_tail_right.png", "./sprites/snake_tail_up.png", "./sprites/snake_tail_left.png"];

const SNAKE_HEAD_DOWN = 0;
const SNAKE_HEAD_UP = 1;
const SNAKE_HEAD_LEFT = 2;
const SNAKE_HEAD_RIGHT = 3;
const SNAKE_BODY = 4;
const SNAKE_TAIL_DOWN = 5;
const SNAKE_TAIL_RIGHT = 6;
const SNAKE_TAIL_UP = 7;
const SNAKE_TAIL_LEFT = 8;

var arrayImagesSnake = [];
var arrayImagesSpecialFruit = [];

window.onload = function() {

    scoreHTML = document.getElementById("score");
    scoreHTML.innerHTML = "Score: " + score;
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.visualViewport.width - (window.visualViewport.width % 20) - 100;
    ctx.canvas.height = window.visualViewport.height - (window.visualViewport.height % 20) - 80;

    for (let i = 0; i < 6; i ++) {
        let img = new Image();
        img.src = colorsArray[i];
        arrayImagesSpecialFruit.push(img);
    }

    for (let i = 0; i < 9; i ++) {
        let img = new Image();
        img.src = snakeArray[i];
        arrayImagesSnake.push(img);
    }

    snake.push({width: 20, height: 20, x: 20, y: 20, dir: "right", img: arrayImagesSnake[SNAKE_HEAD_RIGHT]});

    createRandomFruit();
    loop();
    specialFruitLoop();
    
    document.addEventListener('keydown', function(e) {
        lastDownTarget = event.target;

        if (e.keyCode === 37) {
            if (snake[0].dir !== "right") {
                snake[0].dir = "left";
                snake[0].img = arrayImagesSnake[SNAKE_HEAD_LEFT];
                moveSnake();
            }
        } else if (e.keyCode === 38) {
            if (snake[0].dir !== "bottom") {
                snake[0].dir = "top";
                snake[0].img = arrayImagesSnake[SNAKE_HEAD_UP];
                moveSnake();
            }
        } else if (e.keyCode === 39) {
            if (snake[0].dir !== "left") {
                snake[0].dir = "right";
                snake[0].img = arrayImagesSnake[SNAKE_HEAD_RIGHT];
                moveSnake();
            }
        } else if (e.keyCode === 40) {
            if (snake[0].dir !== "top") {
                snake[0].dir = "bottom";
                snake[0].img = arrayImagesSnake[SNAKE_HEAD_DOWN];
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
            y: snake[snake.length - 1].y,
            dir: snake[snake.length - 1].dir,
            img: snake[snake.length - 1].img
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
            y: snake[snake.length - 1].y,
            dir: snake[snake.length - 1].dir,
            img: snake[snake.length - 1].img
        },
        {
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y,
            dir: snake[snake.length - 1].dir,
            img: snake[snake.length - 1].img
        },
        {
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y,
            dir: snake[snake.length - 1].dir,
            img: snake[snake.length - 1].img
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
    }, 8000);

    drawSpecialFruit();
}

function moveSnake() {
    
    clearSnake();
    fruitCollision();
    specialFruitCollision();
    if (snake[0].dir === "left" ) {
         
        if (1 < snake.length) {
            for (let i = snake.length - 1 ; i >= 1 ; i --) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                snake[i].dir = snake[i-1].dir;
            }
        }
        snake[0].x -= 20;
        
    } else if (snake[0].dir === "top" ) {
        
        if (1 < snake.length) {
            for (let i = snake.length - 1 ; i >= 1 ; i --) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                snake[i].dir = snake[i-1].dir;
            }
        }
        snake[0].y -= 20;
        
    } else if (snake[0].dir === "right" ) {
        
        if (1 < snake.length) {
            for (let i = snake.length - 1 ; i >= 1 ; i --) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                snake[i].dir = snake[i-1].dir;
            }
        }
        snake[0].x += 20;
        
    } else if (snake[0].dir === "bottom" ) {
        
        if (1 < snake.length) {
            for (let i = snake.length - 1 ; i >= 1 ; i --) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                snake[i].dir = snake[i-1].dir;
            }
        }
        snake[0].y += 20;
        
    }

    if (snake[0].x <= -20) {
        snake[0].x = canvas.width - 20;
    } else if (snake[0].y <= -20) {
        snake[0].y = canvas.height - 20;
    } else if (snake[0].x >= canvas.width) {
        snake[0].x = 0;
    } else if (snake[0].y >= canvas.height) {
        snake[0].y = 0;
    }

    if (1 < snake.length) {
        for (let i = snake.length - 1 ; i >= 1 ; i --) {
            
            if (i < snake.length - 1) {
                snake[i].img = arrayImagesSnake[SNAKE_BODY];
            } else if (i === snake.length - 1 && snake[i].dir === "right") {
                snake[i].img = arrayImagesSnake[SNAKE_TAIL_RIGHT];
            } else if (i === snake.length - 1 && snake[i].dir === "left") {
                snake[i].img = arrayImagesSnake[SNAKE_TAIL_LEFT];
            } else if (i === snake.length - 1 && snake[i].dir === "top") {
                snake[i].img = arrayImagesSnake[SNAKE_TAIL_UP];
            } else if (i === snake.length - 1 && snake[i].dir === "bottom") {
                snake[i].img = arrayImagesSnake[SNAKE_TAIL_DOWN];
            }
        }
    }

    snakeCollision();
    drawSnake();
    drawFruit();
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snake[i].img, snake[i].x, snake[i].y);
    }
}

function clearSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.clearRect(snake[i].x, snake[i].y, snake[0].width, snake[0].height);       
    }
}

function drawFruit() {

    var img = new Image();
    img.src = "./sprites/apple.png";

    img.onload = () => {
        ctx.drawImage(img, fruit.x, fruit.y);    
    };
}

function clearFruit() {
    ctx.clearRect(fruit.x, fruit.y, 20, 20);
}

function drawSpecialFruit() {

    var i = 0;

    setInterval(function() {
        if (specialFruit.x !== -20 && specialFruit.y !== -20) {
            ctx.drawImage(arrayImagesSpecialFruit[i], specialFruit.x, specialFruit.y);    
        }
        i++;
        if (i === 6) {
            i = 0;
        }
    }, 150);
}

function clearSpecialFruit() {
    ctx.clearRect(specialFruit.x, specialFruit.y, 20, 20);
}