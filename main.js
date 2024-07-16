const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const carWidth = 50;
const carHeight = 80;
const carSpeed = 5;

const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleSpeed = 3;

let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
let carDirection = 0; // 0: 정지, -1: 좌측 이동, 1: 우측 이동

let obstacleInterval = 1000; // 장애물 생성 간격 (ms)
let lastObstacleTime = 0;
let obstacles = [];
let score = 0;

function drawCar() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
  });
}

function moveCar() {
  carX += carDirection * carSpeed;
  if (carX < 0) {
    carX = 0;
  } else if (carX > canvas.width - carWidth) {
    carX = canvas.width - carWidth;
  }
}

function createObstacle() {
  const obstacleX = Math.random() * (canvas.width - obstacleWidth);
  obstacles.push({ x: obstacleX, y: -obstacleHeight });
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacleSpeed;
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
    }

    // Check collision with car
    if (
      carX < obstacle.x + obstacleWidth &&
      carX + carWidth > obstacle.x &&
      carY < obstacle.y + obstacleHeight &&
      carY + carHeight > obstacle.y
    ) {
      gameOver();
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameOver() {
  alert(`Game Over! Your score: ${score}`);
  score = 0;
  obstacles = [];
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCar();
  moveCar();
  drawObstacles();
  moveObstacles();
  drawScore();

  // Generate obstacles
  if (timestamp - lastObstacleTime > obstacleInterval) {
    createObstacle();
    lastObstacleTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    carDirection = -1;
  } else if (e.key === 'ArrowRight') {
    carDirection = 1;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    carDirection = 0;
  }
});

requestAnimationFrame(gameLoop);
