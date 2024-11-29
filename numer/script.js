const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player, fallingNumbers, fallingBoxes, score, gameRunning, keys;
const maxValue = 10000; // 最大玩家数字
const fixedSize = 30; // 固定的图形大小
const fallSpeed = 1.5; // 下降速度减小

// 初始化游戏
function initializeGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player = { x: canvas.width / 2, y: canvas.height - 50, size: 1 };
    fallingNumbers = [];
    fallingBoxes = [];
    score = 0;
    gameRunning = true;
    keys = { left: false, right: false };

    // 清除结束界面
    document.querySelector('.game-over')?.remove();
    document.querySelector('.restart-btn')?.remove();

    gameLoop();
}

// 添加随机掉落的数字
function spawnNumbers() {
    const numToSpawn = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numToSpawn; i++) {
        const numValue = Math.ceil(Math.random() * Math.min(1.5 * player.size, maxValue));
        const x = Math.random() * (canvas.width - 2 * fixedSize) + fixedSize;
        fallingNumbers.push({ x, y: 0, value: numValue });
    }

    if (Math.random() < 0.2) { // 红色惊喜礼盒概率
        const boxX = Math.random() * (canvas.width - 2 * fixedSize) + fixedSize;
        fallingBoxes.push({ x: boxX, y: 0 });
    }
}

// 更新游戏状态
function updateGame() {
    if (!gameRunning) return;

    // 玩家移动
    if (keys.left) player.x -= 5;
    if (keys.right) player.x += 5;

    // 边界限制
    player.x = Math.max(fixedSize, Math.min(player.x, canvas.width - fixedSize));

    // 更新掉落数字
    for (let num of fallingNumbers) {
        num.y += fallSpeed;

        // 检查碰撞
        if (
            num.y >= player.y - fixedSize &&
            num.x >= player.x - fixedSize &&
            num.x <= player.x + fixedSize
        ) {
            if (num.value <= player.size) {
                player.size += num.value;
                player.size = Math.round(player.size);
                score = player.size;
                fallingNumbers.splice(fallingNumbers.indexOf(num), 1);
            } else {
                gameRunning = false;
                showGameOverScreen();
            }
        }
    }

    // 更新惊喜礼盒
    for (let box of fallingBoxes) {
        box.y += fallSpeed;
        if (
            box.y >= player.y - fixedSize &&
            box.x >= player.x - fixedSize &&
            box.x <= player.x + fixedSize
        ) {
            triggerSurprise();
            fallingBoxes.splice(fallingBoxes.indexOf(box), 1);
        }
    }

    fallingNumbers = fallingNumbers.filter(num => num.y < canvas.height);
    fallingBoxes = fallingBoxes.filter(box => box.y < canvas.height);
}

// 绘制游戏元素
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(player.x, player.y, fixedSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.size, player.x, player.y + 6);

    // 绘制掉落数字
    ctx.fillStyle = '#FFC107';
    for (let num of fallingNumbers) {
        ctx.beginPath();
        ctx.arc(num.x, num.y, fixedSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(num.value, num.x, num.y + 6);
    }

    // 绘制惊喜礼盒
    ctx.fillStyle = 'red';
    for (let box of fallingBoxes) {
        ctx.fillRect(box.x - fixedSize / 2, box.y - fixedSize / 2, fixedSize, fixedSize);
    }

    // 更新分数
    document.querySelector('.score').innerText = `分数: ${score}`;
}

// 随机触发惊喜效果
function triggerSurprise() {
    const randomEffect = Math.random();
    if (randomEffect < 0.25) player.size *= 2;
    else if (randomEffect < 0.5) player.size *= 4;
    else if (randomEffect < 0.75) player.size *= 6;
    else player.size = Math.max(1, player.size / (Math.floor(Math.random() * 4) + 2));
    player.size = Math.round(player.size);
}

// 显示游戏结束画面
function showGameOverScreen() {
    const gameOverText = document.createElement('div');
    gameOverText.className = 'game-over';
    gameOverText.innerText = '游戏结束！';
    document.body.appendChild(gameOverText);

    const restartButton = document.createElement('button');
    restartButton.className = 'restart-btn';
    restartButton.innerText = '重新开始';
    document.body.appendChild(restartButton);

    restartButton.addEventListener('click', initializeGame);
}

// 键盘事件
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// 游戏主循环
function gameLoop() {
    if (gameRunning) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

// 定时生成数字
setInterval(spawnNumbers, 1500);

initializeGame();
