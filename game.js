// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// 蛇的初始位置和速度
let snake = [
    { x: 10, y: 10 },
];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let speed = 7;
let gameLoop;
let gameRunning = true;

// 生成随机食物位置
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // 确保食物不会生成在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            break;
        }
    }
}

// 处理键盘输入
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// 游戏主循环
function gameUpdate() {
    if (!gameRunning) return;

    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }

    // 清空画布
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#388E3C'; // 蛇头颜色
        } else {
            ctx.fillStyle = '#4CAF50'; // 蛇身颜色
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 碰撞检测
function checkCollision() {
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2);
}

// 重新开始游戏
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    clearInterval(gameLoop);
    gameLoop = setInterval(gameUpdate, 1000 / speed);
}

// 开始游戏
generateFood();
gameLoop = setInterval(gameUpdate, 1000 / speed); 