function setup() {
  tile = 20;
  const canvas = createCanvas(500, 360);
  canvas.parent('game-container');
  player1 = new Snake(0, 8, 'cyan', 'Player 1');
  player2 = new Snake(width / 20 - 1, 8, 'lime', 'Player 2');
  frameRate(5);
  food = new Food();
  player1.score = 0;
  player2.score = 0;
  updateScoreDisplay();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player1.direction(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    player1.direction(0, 1);
  } else if (keyCode === 39) {
    player1.direction(1, 0);
  } else if (keyCode === 37) {
    player1.direction(-1, 0);
  } else if (keyCode === 87) {
    player2.direction(0, -1);
  } else if (keyCode === 83) {
    player2.direction(0, 1);
  } else if (keyCode === 65) {
    player2.direction(-1, 0);
  } else if (keyCode === 68) {
    player2.direction(1, 0);
  } else if (keyCode === 32 && (player1.lost() || player2.lost())) {
    setup();
    loop();
  }
}

function draw() {
  scale(tile);
  background('orange');
  
  if (player1.gobble(food)) {
    food = new Food();
    player1.score += 1;
    updateScoreDisplay();
  }
  if (player2.gobble(food)) {
    food = new Food();
    player2.score += 1;
    updateScoreDisplay();
  }
  
  player1.move();
  player2.move();
  player1.display();
  player2.display();
  food.display();
  
  if (player1.lost() || player2.lost()) {
    noLoop();
    showGameOver();
  }
}

function updateScoreDisplay() {
  document.getElementById('player1-score').textContent = player1.score;
  document.getElementById('player2-score').textContent = player2.score;
}

function showGameOver() {
  let winner;
  if (player1.lost() && player2.lost()) {
    winner = "It's a tie!";
  } else if (player2.lost()) {
    winner = "Player 1 wins!";
  } else {
    winner = "Player 2 wins!";
  }
  
  fill('white');
  stroke('black');
  strokeWeight(0.1);
  textSize(2);
  textAlign(CENTER);
  text('GAME OVER', width/tile/2, height/tile/2 - 1);
  textSize(1.5);
  text(winner, width/tile/2, height/tile/2 + 1);
  text('Press SPACE to restart', width/tile/2, height/tile/2 + 3);
}

class Snake {
  constructor(x, y, color, name) {
    this.body = [];
    this.body[0] = createVector(x, y);
    this.xspeed = 0;
    this.yspeed = 0;
    this.color = color;
    this.size = 0;
    this.width = floor(width / tile);
    this.height = floor(height / tile);
    this.score = 0;
    this.name = name;
  }
  direction(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }
  move() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xspeed;
    head.y += this.yspeed;
    this.body.push(head);
  }
  lengthen() {
    let head = this.body[this.body.length - 1].copy();
    this.size++;
    this.body.push(head);
  }
  gameOver() {
    return;
  }
  lost() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    
    // Check wall collision
    if (x > this.width - 1 || x < 0 || y > this.height - 1 || y < 0) {
      return true;
    }
    
    // Check self collision
    for (let i = 0; i < this.body.length - 1; i++) {
      let square = this.body[i];
      if (square.x == x && square.y == y) {
        return true;
      }
    }
    
    // Check collision with other snake
    let otherSnake = this === player1 ? player2 : player1;
    for (let i = 0; i < otherSnake.body.length; i++) {
      let square = otherSnake.body[i];
      if (square.x == x && square.y == y) {
        return true;
      }
    }
    
    return false;
  }
  gobble(food) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x == food.x && y == food.y) {
      this.lengthen();
      return true;
    }
  }
  display() {
    for (let i = 0; i < this.body.length; i++) {
      stroke('blue');
      strokeWeight(0.05);
      fill(this.color);
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}

class Food {
  constructor() {
    this.width = width / tile - 1;
    this.x = floor(random(this.width));
    this.height = height / tile - 1;
    this.y = floor(random(this.height));
    this.color = 'green';
  }
  display() {
    stroke('brown');
    strokeWeight(0.05);
    fill(this.color);
    rect(this.x, this.y, 1, 1);
  }
}