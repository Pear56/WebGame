// game.js

const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');

let playerPosition = 50; // 初始玩家位置 (%)
let obstaclePosition = 100; // 障碍物初始位置 (%)
let score = 0;
let gameRunning = true;

// 玩家控制
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && playerPosition < 90) {
        playerPosition += 10; // 上移
    } else if (e.key === 'ArrowDown' && playerPosition > 10) {
        playerPosition -= 10; // 下移
    }
    player.style.bottom = `${playerPosition}%`;
});

// 障碍物移动
let speed = 0.2; // 初始速度

function moveObstacle() {
    if (!gameRunning) return;

    obstaclePosition -= speed;

    if (obstaclePosition <= -10) {
        obstaclePosition = 100;
        obstacle.style.top = `${Math.random() * 80}%`;
        score += 1;
        scoreDisplay.textContent = `分数: ${score}`;

        // 动态提升速度
        speed += 0.01; // 每通过一个障碍，速度增加
    }

    obstacle.style.right = `${100 - obstaclePosition}%`;

    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
    ) {
        endGame();
    }

    requestAnimationFrame(moveObstacle);
}


// 游戏结束
function endGame() {
    gameRunning = false;
    alert(`游戏结束！你的分数是: ${score}`);
    window.location.reload(); // 刷新页面重新开始
}

// 初始化游戏
moveObstacle();
