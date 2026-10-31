let player;
let things = [];
let bits = [];
let stars = [];
let score = 0;
let best = 0;
let lives = 3;
let state = 'start';
let spawnTimer = 0;
let hurtFlash = 0;

function setup() {
  createCanvas(480, 360);
  textFont('Courier New');
  for (let i = 0; i < 25; i++) {
    stars.push({ x: random(width), y: random(180), s: random(1, 3) });
  }
  resetGame();
}

function resetGame() {
  player = { x: width / 2 };
  things = [];
  bits = [];
  score = 0;
  lives = 3;
  spawnTimer = 0;
  hurtFlash = 0;
}

function draw() {
  drawScene();

  if (state === 'start') {
    textAlign(CENTER, CENTER);
    fill(255, 120, 20);
    textSize(38);
    text('CANDY CATCHER', width / 2, 85);
    fill(255);
    textSize(14);
    text('Its halloween night and the spiders', width / 2, 135);
    text('are ruining trick or treating!!', width / 2, 155);
    fill(255, 215, 0);
    text('Catch the candy, gold candy = +5', width / 2, 190);
    fill(160, 255, 160);
    text('Dodge the spiders (3 lives)', width / 2, 210);
    fill(255);
    text('Move: arrow keys or A / D, or hold the mouse', width / 2, 240);
    fill(200, 255, 210);
    textSize(20);
    text('Click to start', width / 2, 285);
    return;
  }

  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(220, 30, 30);
    textSize(40);
    text('GAME OVER', width / 2, 95);
    fill(255);
    textSize(20);
    text('Candy: ' + score, width / 2, 155);
    text('Best: ' + best, width / 2, 185);
    fill(200, 255, 210);
    textSize(18);
    text('Click to try again', width / 2, 245);
    return;
  }

  movePlayer();

  spawnTimer++;
  let gap = max(14, 45 - score * 1.2);
  if (spawnTimer >= gap) {
    addThing();
    spawnTimer = 0;
  }

  for (let i = things.length - 1; i >= 0; i--) {
    let t = things[i];
    t.y += t.speed;
    t.spin += 0.08;

    if (t.type === 'spider') {
      drawSpider(t.x, t.y);
    } else {
      drawCandy(t);
    }

    let caught = t.y > height - 75 && t.y < height - 38 && abs(t.x - player.x) < 42;

    if (caught) {
      if (t.type === 'candy') {
        score += 1;
        boom(t.x, t.y, t.col[0], t.col[1], t.col[2]);
      } else if (t.type === 'gold') {
        score += 5;
        boom(t.x, t.y, 255, 215, 0);
      } else {
        lives -= 1;
        hurtFlash = 12;
        boom(t.x, t.y, 120, 255, 120);
      }
      things.splice(i, 1);
    } else if (t.y > height + 30) {
      things.splice(i, 1);
    }
  }

  drawPlayer();

  for (let i = bits.length - 1; i >= 0; i--) {
    let b = bits[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.15;
    b.life -= 9;
    noStroke();
    fill(b.r, b.g, b.b, b.life);
    ellipse(b.x, b.y, 5, 5);
    if (b.life <= 0) {
      bits.splice(i, 1);
    }
  }

  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  text('Candy: ' + score, 12, 10);

  for (let i = 0; i < lives; i++) {
    noStroke();
    fill(255, 120, 20);
    ellipse(width - 20 - i * 24, 20, 18, 15);
    fill(40, 120, 40);
    rect(width - 22 - i * 24, 9, 4, 5);
  }

  if (hurtFlash > 0) {
    noStroke();
    fill(255, 0, 0, hurtFlash * 10);
    rect(0, 0, width, height);
    hurtFlash--;
  }

  if (lives <= 0) {
    state = 'over';
    if (score > best) {
      best = score;
    }
  }
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x -= 6;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x += 6;
  }
  if (mouseIsPressed) {
    player.x = lerp(player.x, mouseX, 0.25);
  }
  player.x = constrain(player.x, 40, width - 40);
}

function addThing() {
  let r = random();
  let type = 'candy';
  if (r > 0.9) {
    type = 'gold';
  } else if (r > 0.6) {
    type = 'spider';
  }
  let extra = min(3, score * 0.05);
  things.push({
    x: random(30, width - 30),
    y: -20,
    type: type,
    speed: random(2, 3.5) + extra,
    spin: random(TWO_PI),
    col: random([[255, 80, 160], [80, 200, 255], [160, 255, 80], [190, 120, 255]])
  });
}

function startGame() {
  resetGame();
  state = 'play';
}

function mousePressed() {
  if (state === 'start' || state === 'over') {
    startGame();
  }
}

function keyPressed() {
  if ((state === 'start' || state === 'over') && (key === ' ' || keyCode === ENTER)) {
    startGame();
  }
}

function boom(x, y, r, g, b) {
  for (let i = 0; i < 12; i++) {
    bits.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-4, 1),
      life: 255,
      r: r,
      g: g,
      b: b
    });
  }
}

function drawCandy(t) {
  push();
  translate(t.x, t.y);
  rotate(t.spin);
  noStroke();
  let s = 1;
  if (t.type === 'gold') {
    s = 1.4;
    fill(255, 215, 0);
  } else {
    fill(t.col[0], t.col[1], t.col[2]);
  }
  ellipse(0, 0, 22 * s, 14 * s);
  triangle(-11 * s, 0, -20 * s, -7 * s, -20 * s, 7 * s);
  triangle(11 * s, 0, 20 * s, -7 * s, 20 * s, 7 * s);
  fill(255, 255, 255, 150);
  ellipse(-3 * s, -2 * s, 8 * s, 4 * s);
  pop();
}

function drawSpider(x, y) {
  stroke(200, 200, 200, 110);
  strokeWeight(1);
  line(x, 0, x, y);
  stroke(110, 90, 130);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    let w = sin(frameCount * 0.3 + i) * 3;
    line(x, y, x - 22, y - 10 + i * 7 + w);
    line(x, y, x + 22, y - 10 + i * 7 - w);
  }
  noStroke();
  fill(60, 40, 75);
  ellipse(x, y, 24, 20);
  ellipse(x, y - 12, 14, 12);
  fill(255, 40, 40);
  ellipse(x - 3, y - 13, 4, 4);
  ellipse(x + 3, y - 13, 4, 4);
}

function drawPlayer() {
  let x = player.x;
  let y = height - 45;
  noFill();
  stroke(150, 90, 40);
  strokeWeight(4);
  arc(x, y - 16, 50, 50, PI, TWO_PI);
  noStroke();
  fill(255, 120, 20);
  ellipse(x, y, 74, 44);
  fill(235, 100, 10);
  ellipse(x - 18, y, 22, 42);
  ellipse(x + 18, y, 22, 42);
  fill(30, 10, 0);
  triangle(x - 20, y - 10, x - 8, y - 10, x - 14, y - 2);
  triangle(x + 8, y - 10, x + 20, y - 10, x + 14, y - 2);
  triangle(x - 14, y + 4, x + 14, y + 4, x, y + 15);
}

function drawScene() {
  background(15, 10, 25);
  noStroke();

  fill(255);
  for (let i = 0; i < stars.length; i++) {
    ellipse(stars[i].x, stars[i].y, stars[i].s, stars[i].s);
  }

  fill(255, 240, 200);
  ellipse(70, 60, 56, 56);
  fill(235, 215, 170);
  ellipse(60, 52, 11, 11);
  ellipse(80, 70, 8, 8);

  fill(30, 22, 40);
  rect(340, 190, 110, 120);
  triangle(328, 192, 395, 140, 462, 192);
  rect(425, 150, 14, 35);
  for (let i = 0; i < 3; i++) {
    let glow = 150 + 100 * noise(frameCount * 0.05 + i * 10);
    fill(255, 200, 60, glow);
    rect(355 + i * 32, 215, 16, 22);
  }
  fill(15, 10, 25);
  rect(385, 270, 20, 40);

  stroke(30, 22, 40);
  strokeWeight(6);
  line(40, 310, 45, 230);
  strokeWeight(3);
  line(44, 245, 20, 215);
  line(44, 245, 70, 220);
  line(43, 265, 70, 250);
  noStroke();

  fill(40, 30, 50);
  rect(0, 310, 480, 50);

  fill(200, 200, 230, 22);
  ellipse(150 + sin(frameCount * 0.01) * 40, 318, 200, 26);
  ellipse(340 + cos(frameCount * 0.01) * 40, 335, 220, 26);
}
