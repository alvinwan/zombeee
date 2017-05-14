var map = {
  "padding": 3,
  "grid": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ],
  "cell": {
    "padding": 3
  },
  "fillStyles": {
    0: 'rgba(222, 184, 135, 0.25)',
    1: 'rgba(160, 82, 45, 0.75)'
  }
}

function setup() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var map_width = map.grid[0].length + (2 * map.padding)
  var map_height = map.grid.length + (2 * map.padding)

  var cell_dimension = Math.min(
    canvas.width / map_width,
    canvas.height / map_height);
  map.cell_dimension = cell_dimension

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
    map.cell_dimension * (x + map.padding) + map.cell.padding,
    map.cell_dimension * (y + map.padding) + map.cell.padding,
    map.cell_dimension - (map.cell.padding * 2),
    map.cell_dimension - (map.cell.padding * 2));
}

function drawMap(ctx, map) {
  ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
  for (var i = 0; i < map.grid[0].length; i++) {
    for (var j = 0; j < map.grid.length; j++) {
      ctx.fillStyle = map.fillStyles[map.grid[i][j]]
      drawCell(i, j, map, ctx)
    }
  }
}

function Player(map) {

  this.x = 1
  this.y = 1
  this.ox = 1
  this.oy = 0
  this.map = map
  this.bullets = []

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

    for (var i = 0; i < this.bullets.length; i++) {
      var bullet = this.bullets[i];
      bullet.draw(ctx);
    }
  }

  this.shoot = function() {
    var speed = 10
    var bullet = new Bullet(this.map, this, this.ox * speed, this.oy * speed)
    this.bullets.push(bullet)
  }
}

function Bullet(map, player, dx, dy) {

  this.map = map
  this.player = player
  this.dx = dx
  this.dy = dy
  this.sx = player.x + player.ox
  this.sy = player.y + player.oy
  this.st = getSeconds()

  this.draw = function(ctx) {
    var elapsed = getSeconds() - this.st;
    var x = this.sx + Math.floor(this.dx * elapsed)
    var y = this.sy + Math.floor(this.dy * elapsed)
    ctx.fillStyle = 'rgba(255, 216, 16, 0.75)'
    drawCell(x, y, this.map, ctx)
  }
}

function getSeconds() {
  return new Date().getTime() / 1000;
}

window.onload = function() {
  setup()
}
