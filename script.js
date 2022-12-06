const $ = (query) => document.querySelector(query);

const canvas = $("#game");
const canvasContext = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballSpeedX = 10;
let ballY = canvas.height / 2;
let ballSpeedY = 0;
const [paddleWidth, paddleHeight] = [10, 100];
const leftXMargin = 20;
const rightPaddleXPosition = canvas.width - paddleWidth - leftXMargin;
let paddlePlayerYPosition = (canvas.height - paddleHeight) / 2;
let paddleComputerYPosition = (canvas.height - paddleHeight) / 2;
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let gameStop = false; 


function main() {
  const framesPerSecond = 30;
  setInterval(() => {
    drawEverything(),
    moveEverything()
  }, 1000 / framesPerSecond)

  canvas.addEventListener("mousemove", (evt) => {
    const { mouseX , mouseY } = calculateMousePosition(evt);
    paddlePlayerYPosition = mouseY - (paddleHeight / 2);
  })

  canvas.addEventListener("mousedown", () => {
    if(gameStop) {
      playerScore = 0;
      computerScore = 0;
      gameStop = false;
      ballSpeedY = 0;
    }
  })

}

function calculateMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = event.clientX - rect.left - root.scrollLeft;
  const mouseY = event.clientY - rect.top - root.scrollTop;

  return {
    mouseX,
    mouseY
  }
}

function computerMovement() {
  if(paddleComputerYPosition < ballY - 35) {
    paddleComputerYPosition += 6;
  } else if (paddleComputerYPosition > ballY + 35) {
    paddleComputerYPosition -= 6;
  }
}

function resetBall() {
  if(playerScore === winningScore || computerScore === winningScore) {
    gameStop = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

}

function drawNet() {
  for(let i = 0; i < canvas.height; i += 40) {
    console.log(i);
    drawColoredRect(canvas.width / 2 - 1, i, 2, 20, "green");
  }
}

function moveEverything() {
  if(gameStop) {
    return true;
  }

  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if(
    ballX === leftXMargin + paddleWidth &&
    ballY > paddlePlayerYPosition &&
    ballY < paddlePlayerYPosition + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    const deltaY = ballY - (paddlePlayerYPosition + paddleHeight / 2);

    ballSpeedY = deltaY * 0.30;
  }

  if(
    ballX === rightPaddleXPosition &&
    ballY > paddleComputerYPosition &&
    ballY < paddleComputerYPosition + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    const deltaY = ballY - (paddleComputerYPosition + paddleHeight / 2);

    ballSpeedY = deltaY * 0.30;
  }

  if(ballX >= canvas.width || ballX <= 0) {
    ballX <= 0 ? computerScore += 1 : playerScore += 1;
    resetBall();
  }


  if(ballY >= canvas.height || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
}


function drawEverything() {
  
  // Draw background;
  drawColoredRect(0, 0, canvas.width, canvas.height, "black");

  if(gameStop) {
    canvasContext.fillStyle = "white";

    if(playerScore === winningScore) {
      canvasContext.fillText("Left player Won!!", 350, 300);
    } else if(computerScore === winningScore) {
      canvasContext.fillText("Right player Won!!", 350, 300);
    }

    canvasContext.fillText("Click to play again", 350, 500);
    return true;
  }

  // Net
  drawNet()

  // Paddles;
  drawPaddles(paddleWidth, paddleHeight, leftXMargin);
  
  // Draw Ball;
  drawColoredCircle(ballX, ballY, 10, "red");

  // Score stuff
  canvasContext.fillStyle = "green";

  canvasContext.fillText(playerScore, 100, 100);

  canvasContext.fillText(computerScore, canvas.width - 100, 100);
}

function drawPaddles(paddlesW, paddlesH, paddlesXMargin) {
  // LeftPaddle
  drawColoredRect(paddlesXMargin, paddlePlayerYPosition, paddlesW, paddlesH, "white");
  // RightPaddle
  drawColoredRect(rightPaddleXPosition, paddleComputerYPosition, paddlesW, paddlesH, "white");
  
}

function drawColoredRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawColoredCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}


window.onload = main;
