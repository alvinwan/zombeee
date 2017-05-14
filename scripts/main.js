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
  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  for (var i = 0; i < map.grid[0].length; i++) {
    for (var j = 0; j < map.grid.length; j++) {
      drawCell(i, j, map, ctx)
    }
  }
}

function Player(map) {

  this.x = 1
  this.y = 1
  this.map = map

  this.onkeypress = function(keyEvent) {
    this.onbuttonpress(String.fromCharCode(keyEvent.charCode));
  }

  this.onbuttonpress = function(charCode) {
    switch (charCode) {
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
    this.rotate(0);
    this.trymove(1, 0);
  }

  this.trymoveleft = function() {
    this.rotate(0);
    this.trymove(-1, 0);
  }

  this.trymovedown = function() {
    this.rotate(0);
    this.trymove(0, 1);
  }

  this.rotate = function(deg) {

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
    ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    drawCell(this.x, this.y, this.map, ctx);
  }
}

window.onload = function() {
  setup()
}
