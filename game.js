// 游戏配置
const config = {
    paddleHeight: 20,
    paddleWidth: 100,
    ballRadius: 10,
    brickRowCount: 5,
    brickColumnCount: 8,
    brickWidth: 75,
    brickHeight: 20,
    brickPadding: 10,
    brickOffsetTop: 30,
    brickOffsetLeft: 30,
    ballSpeed: 5
};

// 获取Canvas和Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏对象
const paddle = {
    x: canvas.width / 2 - config.paddleWidth / 2,
    y: canvas.height - config.paddleHeight - 10,
    width: config.paddleWidth,
    height: config.paddleHeight,
    dx: 7
};

const ball = {
    x: canvas.width / 2,
    y: paddle.y - config.ballRadius,
    dx: config.ballSpeed,
    dy: -config.ballSpeed,
    radius: config.ballRadius
};

// 初始化砖块
const bricks = [];
for (let c = 0; c < config.brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < config.brickRowCount; r++) {
        const brickX = c * (config.brickWidth + config.brickPadding) + config.brickOffsetLeft;
        const brickY = r * (config.brickHeight + config.brickPadding) + config.brickOffsetTop;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
    }
}

// 游戏状态
let score = 0;
let rightPressed = false;
let leftPressed = false;

// 键盘事件监听
document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// 碰撞检测
function collisionDetection() {
    for (let c = 0; c < config.brickColumnCount; c++) {
        for (let r = 0; r < config.brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (ball.x > brick.x && ball.x < brick.x + config.brickWidth &&
                    ball.y > brick.y && ball.y < brick.y + config.brickHeight) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    score++;
                    document.getElementById('score').textContent = score;

                    if (score === config.brickRowCount * config.brickColumnCount) {
                        alert('恭喜你赢了！');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// 绘制球
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// 绘制挡板
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();

    // 在挡板上添加文字
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('秋叶之林', paddle.x + paddle.width/2, paddle.y + paddle.height/2);
}

// 绘制砖块
function drawBricks() {
    for (let c = 0; c < config.brickColumnCount; c++) {
        for (let r = 0; r < config.brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, config.brickWidth, config.brickHeight);
                ctx.fillStyle = `hsl(${360 * r / config.brickRowCount}, 70%, 60%)`;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 更新游戏状态
function update() {
    // 更新挡板位置
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }

    // 更新球的位置
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 墙壁碰撞检测
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height) {
        if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
            // 确保球不会卡在挡板内
            ball.y = paddle.y - ball.radius;
        } else {
            alert('游戏结束！');
            document.location.reload();
        }
    }

    collisionDetection();
}

// 主游戏循环
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    drawBall();
    drawPaddle();
    update();

    requestAnimationFrame(gameLoop);
}

// 开始游戏
gameLoop();