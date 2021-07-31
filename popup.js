
// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, collideRectRect, colorMode, createCanvas, fill, frameRate, keyCode, height,
 *    loop, noFill, noLoop, noStroke, random, rect, round, stroke, sqrt, text, width
 *    UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
 */

let backgroundColor, playerSnake, currentApple, score, isGameOver;
let width = 400;
let height = 400;


function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = color('gray');
  frameRate(10);
  playerSnake = new Snake();
  currentApple = new Apple();
  isGameOver = false;
  score = 0;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  if(!isGameOver){
    drawGrid()
    displayScore();
    playerSnake.moveSelf();
    playerSnake.showSelf();
    playerSnake.checkCollisions();
    playerSnake.checkApples();
    // The apple needs fewer methods to show up on screen.
    currentApple.showSelf();
    // We put the score in its own function for readability.
    
  } else {
    displayGameOverScreen();
  }
}

function displayScore() {
  fill(0);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(30)
  fill('white');
  rect(width/2 - 15, height/2 - 25, 30, 30)
  fill('red')
  text(`${score}`, width/2, height/2)
}

function drawGrid(){
  if(!isGameOver){  for(let i = 0; i < width; i += width/40){
    for(let j = 0; j < height; j += height/40){
      stroke('white');
			strokeWeight(1);
			line(i, 0, i, height);
			line(0, j, width, j);
    }
  }
                 }
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 10;
    this.tailSegments = [new TailSegment(this.x, this.y)]
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    this.tailSegments.unshift(new TailSegment(this.x, this.y));
    this.tailSegments.pop();
  }

  showSelf() {
    stroke(240, 100, 100);
    //noFill();
    fill(color('black'))
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    //add for loop here to show each snake segment
    for (let i = 0; i < this.tailSegments.length; i++) {
      this.tailSegments[i].showSelf();
      console.log(`tail segment [${i}], x: ${this.tailSegments[i].x} y: ${this.tailSegments[i].y} `)
    }
  }

  checkApples() {
   if(collideRectRect(this.x, this.y, this.size - 2, this.size - 2
                    ,currentApple.x, currentApple.y, currentApple.size - 2, currentApple.size - 2)){
    score += 1;
     console.log(`Score: ${score}`)
     currentApple = new Apple();
     this.extendTail();
   }
  }

  checkCollisions() {
    if(this.tailSegments.length > 2){
      for(let i = 1; i < this.tailSegments.length; i++){
          if(this.x == this.tailSegments[i].x && this.y == this.tailSegments[i].y){
            gameOver();
          }
        }
      }

    if(this.x > width || this.x < 0 || this.y > height || this.y < 0){
      gameOver();
    }
  }

  extendTail() {
    let latestTailSeg = this.tailSegments[this.tailSegments.length - 1];
    this.tailSegments.push(new TailSegment(latestTailSeg.x, latestTailSeg.y))
  }
}

class TailSegment {

  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = 10;
  }
  
  
  showSelf(){
    noStroke();
    fill(color('green'))
    rect(this.x, this.y, this.size);
  }
  
  
}
class Apple {
  constructor() {
    this.x = round(random(width - 10));
    this.y = round(random(height - 10));
    this.size = 10;
    this.x -= this.x%10;
    this.y -= this.y%10;
    console.log(`The position of the apple is x: ${this.x}, y: ${this.y}`)
  }

  showSelf() {
    stroke(240, 100, 100);
    fill(color('red'))
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode)
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else if (keyCode === BACKSPACE) {
    restartGame();
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  isGameOver = false;
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
}

function gameOver() {
  /*
    make a big rectangle
    write game over
    display score
    have a restart
  */
  isGameOver = true; 
}

function displayGameOverScreen(){
  background('gray');
  textAlign(CENTER)
  textSize(40)
  text(`Score: ${score}`, width/2, height/2)
  textSize(20)
  text('press backspace to restart', width/2, height/2 + 20)
}