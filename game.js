// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');
const restartBtn = document.getElementById('restartBtn');

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
let gameRunning = false;

// 加载图片资源
const foodEmojis = ['🍎', '🍊', '🍇', '🍓', '🍉', '🍌', '🍒'];
let currentFoodEmoji = foodEmojis[0];

// 初始化游戏
function initGame() {
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFF5EE');
    gradient.addColorStop(1, '#FFE4E1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 显示开始提示
    ctx.fillStyle = '#FF69B4';
    ctx.font = 'bold 24px ZCOOL KuaiLe';
    ctx.textAlign = 'center';
    ctx.fillText('点击"开始游戏"按钮开始', canvas.width / 2, canvas.height / 2 - 30);
    
    // 绘制可爱的小蛇图标
    ctx.font = '40px Arial';
    ctx.fillText('🐍', canvas.width / 2, canvas.height / 2 + 30);
}

// 生成随机食物位置和emoji
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    currentFoodEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    
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
    if (!gameRunning) return;
    
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

// 绘制圆角矩形
function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

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
        
        // 添加得分动画
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = '+10';
        scoreDiv.style.position = 'absolute';
        scoreDiv.style.left = `${canvas.offsetLeft + food.x * gridSize}px`;
        scoreDiv.style.top = `${canvas.offsetTop + food.y * gridSize}px`;
        scoreDiv.style.color = '#FF1493';
        scoreDiv.style.fontSize = '20px';
        scoreDiv.style.fontWeight = 'bold';
        scoreDiv.style.animation = 'scoreFloat 1s ease-out';
        document.body.appendChild(scoreDiv);
        setTimeout(() => document.body.removeChild(scoreDiv), 1000);
    } else {
        snake.pop();
    }

    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFF5EE');
    gradient.addColorStop(1, '#FFE4E1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentFoodEmoji, (food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize);

    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = '#FF69B4';
        } else {
            // 蛇身渐变色
            ctx.fillStyle = `hsl(330, 100%, ${70 + (index * 2)}%)`;
        }
        roundRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2, 8);
        
        if (index === 0) {
            // 绘制蛇眼睛
            ctx.fillStyle = 'white';
            ctx.beginPath();
            const eyeSize = 4;
            if (dx === 1) { // 向右
                ctx.arc(segment.x * gridSize + 14, segment.y * gridSize + 8, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 14, segment.y * gridSize + 12, eyeSize, 0, Math.PI * 2);
            } else if (dx === -1) { // 向左
                ctx.arc(segment.x * gridSize + 6, segment.y * gridSize + 8, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 6, segment.y * gridSize + 12, eyeSize, 0, Math.PI * 2);
            } else if (dy === -1) { // 向上
                ctx.arc(segment.x * gridSize + 8, segment.y * gridSize + 6, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 12, segment.y * gridSize + 6, eyeSize, 0, Math.PI * 2);
            } else { // 向下或静止
                ctx.arc(segment.x * gridSize + 8, segment.y * gridSize + 14, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 12, segment.y * gridSize + 14, eyeSize, 0, Math.PI * 2);
            }
            ctx.fill();
            
            // 绘制黑色瞳孔
            ctx.fillStyle = 'black';
            ctx.beginPath();
            const pupilSize = 2;
            if (dx === 1) {
                ctx.arc(segment.x * gridSize + 15, segment.y * gridSize + 8, pupilSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 15, segment.y * gridSize + 12, pupilSize, 0, Math.PI * 2);
            } else if (dx === -1) {
                ctx.arc(segment.x * gridSize + 5, segment.y * gridSize + 8, pupilSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 5, segment.y * gridSize + 12, pupilSize, 0, Math.PI * 2);
            } else if (dy === -1) {
                ctx.arc(segment.x * gridSize + 8, segment.y * gridSize + 5, pupilSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 12, segment.y * gridSize + 5, pupilSize, 0, Math.PI * 2);
            } else {
                ctx.arc(segment.x * gridSize + 8, segment.y * gridSize + 15, pupilSize, 0, Math.PI * 2);
                ctx.arc(segment.x * gridSize + 12, segment.y * gridSize + 15, pupilSize, 0, Math.PI * 2);
            }
            ctx.fill();
        }
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

// 开始游戏
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        generateFood();
        gameLoop = setInterval(gameUpdate, 1000 / speed);
        
        // 更新按钮状态
        startBtn.disabled = true;
        endBtn.disabled = false;
        restartBtn.disabled = true;
    }
}

// 结束游戏
function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // 显示结束画面
    ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF1493';
    ctx.font = 'bold 36px ZCOOL KuaiLe';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '24px ZCOOL KuaiLe';
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = '40px Arial';
    ctx.fillText('🌟', canvas.width / 2, canvas.height / 2 + 70);
    
    // 更新按钮状态
    startBtn.disabled = false;
    endBtn.disabled = true;
    restartBtn.disabled = false;
}

// 游戏结束
function gameOver() {
    endGame();
}

// 重新开始游戏
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    
    startGame();
}

// 添加得分动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes scoreFloat {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-30px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化游戏
initGame(); 
