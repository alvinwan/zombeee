var map = {
  "grid": [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  "cell": {
    "padding": 1
  },
  "fillStyles": {
    0: 'rgba(222, 184, 135, 0.25)',
    1: 'rgba(160, 82, 45, 0.75)'
  }
}

function setup() {
  var canvas = document.getElementById('canvas');
  canvas_dim = Math.min(document.body.clientWidth, document.body.clientHeight)
  canvas.width = canvas_dim;
  canvas.height = canvas_dim;

  var ctx = canvas.getContext('2d');

  map.bullets = []
  map.zombies = []
  map.width = map.grid[0].length
  map.height = map.grid.length

  var cell_dimension = Math.min(
    canvas.width / map.width,
    canvas.height / map.height);
  map.cell_dimension = cell_dimension

  addZombie(map)

  var player = new Player(map);
  window.requestAnimationFrame(function() {
    draw(ctx, map, player)
  });

  window.onkeypress = function (keyEvent) {
    player.onkeypress(keyEvent)
  }
}

function draw(ctx, map, player) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx, map);
  player.draw(ctx);
  window.requestAnimationFrame(function() {
    draw(ctx, map, player)
  });
}

function drawCell(x, y, map, ctx) {
  ctx.fillRect(
    map.cell_dimension * x + map.cell.padding,
    map.cell_dimension * y + map.cell.padding,
    map.cell_dimension - (map.cell.padding * 2),
    map.cell_dimension - (map.cell.padding * 2));
}

function drawMap(ctx, map) {
  ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
  for (var i = 0; i < map.grid.length; i++) {
    for (var j = 0; j < map.grid[0].length; j++) {
      ctx.fillStyle = map.fillStyles[map.grid[i][j]]
      drawCell(j, i, map, ctx)
    }
  }
  for (var i = 0; i < map.bullets.length; i++) {
    var bullet = map.bullets[i];
    bullet.draw(ctx);
  }
  for (var i = 0; i < map.zombies.length; i++) {
    var zombie = map.zombies[i];
    zombie.draw(ctx);
  }
}

function Player(map) {

  this.x = 1
  this.y = 1
  this.ox = 1
  this.oy = 0
  this.map = map

  this.onkeypress = function(keyEvent) {
    var charCode = String.fromCharCode(keyEvent.charCode);
    switch(keyEvent) {
      case 32:
        charCode = "space"
        break;
    }
    this.onbuttonpress(charCode);
  }

  this.onbuttonpress = function(charCode) {
    switch (charCode) {
      case "x":
        this.shoot();
        break;
      case "w":
        this.trymoveup();
        break;
      case "a":
        this.trymoveleft();
        break;
      case "s":
        this.trymovedown();
        break;
      case "d":
        this.trymoveright();
        break;
    }
  }

  this.trymoveup = function() {
    this.rotate(0);
    this.trymove(0, -1);
  }

  this.trymoveright = function() {
    this.rotate(90);
    this.trymove(1, 0);
  }

  this.trymoveleft = function() {
    this.rotate(270);
    this.trymove(-1, 0);
  }

  this.trymovedown = function() {
    this.rotate(180);
    this.trymove(0, 1);
  }

  this.rotate = function(deg) {
    switch (deg) {
      case 0:
        this.ox = 0
        this.oy = -1
        break;
      case 90:
        this.ox = 1
        this.oy = 0
        break;
      case 180:
        this.ox = 0
        this.oy = 1
        break;
      case 270:
        this.ox = -1
        this.oy = 0
        break;
    }
  }

  this.trymove = function(dx, dy) {
    var nx = this.x + dx;
    var ny = this.y + dy;
    if (this.map.grid[ny][nx] == 0) {
      this.x = nx
      this.y = ny
    }
  }

  this.draw = function(ctx) {
    ctx.fillStyle = 'rgba(50, 50, 50, 0.75)';
    drawCell(this.x, this.y, this.map, ctx);

    ctx.fillStyle = 'rgba(50, 50, 50, 0.25)';
    drawCell(this.x + this.ox, this.y + this.oy, this.map, ctx);
  }

  this.shoot = function() {
    var speed = 10
    var bullet = new Bullet(this.map, this, this.ox * speed, this.oy * speed)
    this.map.bullets.push(bullet)
  }
}

function Bullet(map, player, dx, dy) {

  this.map = map
  this.player = player
  this.dx = dx
  this.dy = dy
  this.sx = player.x + player.ox
  this.sy = player.y + player.oy
  this.x = this.sx
  this.y = this.sy
  this.st = getSeconds()

  this.draw = function(ctx) {
    var elapsed = getSeconds() - this.st;
    this.x = this.sx + Math.floor(this.dx * elapsed)
    this.y = this.sy + Math.floor(this.dy * elapsed)
    ctx.fillStyle = 'rgba(255, 216, 16, 0.75)'
    drawCell(this.x, this.y, this.map, ctx)

    ctx.fillStyle = 'rgba(255, 216, 16, 0.15)'
    drawCell(this.x, this.y + 1, this.map, ctx)
    drawCell(this.x, this.y - 1, this.map, ctx)
    drawCell(this.x + 1, this.y, this.map, ctx)
    drawCell(this.x - 1, this.y, this.map, ctx)
  }

  this.deleteme = function() {
    return (this.x < 0 || this.y < 0 || this.x > map.width ||
            this.y > map.height);
  }
}

function Zombie(map, sx, sy, dx, dy) {

  this.map = map
  this.sx = sx
  this.sy = sy
  this.dx = dx
  this.dy = dy
  this.x = this.sx
  this.y = this.sy
  this.st = getSeconds()
  this.life = 1

  this.draw = function(ctx) {
    var elapsed = getSeconds() - this.st;
    this.x = this.sx + Math.floor(this.dx * elapsed)
    this.y = this.sy + Math.floor(this.dy * elapsed)
    ctx.fillStyle = 'rgba(224, 53, 26, 0.75)'
    drawCell(this.x, this.y, this.map, ctx)
  }
}

function addZombie(map) {
  if (Math.random() < 0.5) {
    sy = 0
    dx = 0
    sx = Math.floor(Math.random() * map.width);
    dy = 1
  } else {
    sx = 0
    dy = 0
    sy = Math.floor(Math.random() * map.height);
    dx = 1
  }
  var zombie = new Zombie(map, sx, sy, dx, dy)
  map.zombies.push(zombie);
}

function getSeconds() {
  return new Date().getTime() / 1000;
}

window.onload = function() {
  setup()
}
