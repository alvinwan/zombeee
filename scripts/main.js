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
  "cells": {
    0: {
      "fillStyle": 'rgba(255, 255, 255, 0.01)',
      "padding": 3,
    },
    1: {
      "fillStyle": 'rgba(255, 255, 255, 0.2)',
      "padding": 5,
    }
  },
  "bullets": [],
  "zombies": [],
  "players": []
}

function setup() {
  var canvas = document.getElementById('canvas');
  canvas_dim = Math.min(document.body.clientWidth, document.body.clientHeight);
  canvas.width = canvas_dim;
  canvas.height = canvas_dim;
  map.pause = true

  var ctx = canvas.getContext('2d');
  window.requestAnimationFrame(function() {
    draw(ctx, map)
  });
}

function newGame(map) {
  document.getElementById('game').style.display = 'block'
  document.getElementById('gameover').style.display = 'none'
  document.getElementById('start').style.display = 'none'
  document.getElementById('lives').innerHTML = 3
  document.getElementById('score').innerHTML = 0

  map.pause = false
  map.bullets = []
  map.zombies = []
  map.players = []
  map.width = map.grid[0].length
  map.height = map.grid.length

  var cell_dimension = Math.min(
    canvas.width / map.width,
    canvas.height / map.height);
  map.cell_dimension = cell_dimension

  var player = new Player(map);
  player.current = true
  map.players.push(player);

  window.onkeydown = function (keyEvent) {
    player.onkeydown(keyEvent);
  }
}

function draw(ctx, map) {
  if (!map.pause) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, map);
    drawBullets(ctx, map.bullets);
    drawZombies(ctx, map.zombies);
    drawPlayers(ctx, map.players);
  }
  window.requestAnimationFrame(function() {
    draw(ctx, map)
  });
}

function drawCell(x, y, map, ctx, styles) {
  if (styles === undefined) {
    var styles = map.cells[map.grid[y][x]];
  }
  ctx.fillStyle = styles.fillStyle;
  ctx.fillRect(
    map.cell_dimension * x + styles.padding,
    map.cell_dimension * y + styles.padding,
    map.cell_dimension - (styles.padding * 2),
    map.cell_dimension - (styles.padding * 2));
}

function drawZombies(ctx, zombies) {
  if (Math.random() < 0.02) {
    addZombie(map)
  }
  for (var i = 0; i < zombies.length; i++) {
    var zombie = zombies[i];
    zombie.update();
    if (zombie.shoulddestroy()) {
      zombies.splice(i, 1);
      zombie.ondestroy();
    }
    zombie.draw(ctx);
  }
}

function drawBullets(ctx, bullets) {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    bullet.update();
    bullet.draw(ctx);
  }
}

function drawPlayers(ctx, players) {
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    player.update();
    player.draw(ctx);
    if (player.shoulddestroy()) {
      players.splice(i, 1)
      player.ondestroy()
    }
  }
}

function drawMap(ctx, map) {
  ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
  for (var i = 0; i < map.grid.length; i++) {
    for (var j = 0; j < map.grid[0].length; j++) {
      drawCell(j, i, map, ctx)
    }
  }
}

function Player(map) {

  this.x = 1
  this.y = 1
  this.ox = 1
  this.oy = 0
  this.life = 3
  this.map = map
  this.points = 0
  this.current = false

  this.onkeydown = function(keyEvent) {
    switch(keyEvent.keyCode) {
      case 37:
      case 65:
        charCode = "a"
        break;
      case 38:
      case 87:
        charCode = "w"
        break;
      case 39:
      case 68:
        charCode = "d"
        break;
      case 40:
      case 83:
        charCode = "s"
        break;
      case 88:
        charCode = "x"
        break;
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

  this.update = function() {
    for (var i = 0; i < map.zombies.length; i++) {
      var zombie = map.zombies[i];
      if (collide(zombie, this)) {
        this.loselife(1);
        map.zombies.splice(i, 1)
        zombie.ondestroy()
      }
    }
  }

  this.draw = function(ctx) {
    drawCell(this.x, this.y, this.map, ctx,
            {'fillStyle': 'rgba(255, 255, 255, 1)',
            'padding': 15});
    drawCell(this.x, this.y, this.map, ctx,
            {'fillStyle': 'rgba(255, 255, 255, 0.1)',
            'padding': 1});

    drawCell(this.x + this.ox, this.y + this.oy, this.map, ctx,
            {'fillStyle': 'rgba(255, 255, 255, 0.1)',
            'padding': 5});
  }

  this.shoot = function() {
    var speed = 30
    var bullet = new Bullet(this.map, this, this.ox * speed, this.oy * speed)
    this.map.bullets.push(bullet)
  }

  this.loselife = function(damage) {
    this.life -= damage
    document.getElementById('lives').innerHTML = this.life;
  }

  this.addpoints = function(points) {
    this.points += points;
    document.getElementById('score').innerHTML = this.points;
  }

  this.shoulddestroy = function() {
    return this.life <= 0
  }

  this.ondestroy = function() {
    if (this.current) {
      gameOver()
    }
  }
}

function Bullet(map, player, dx, dy) {

  this.map = map
  this.player = player
  this.dx = dx
  this.dy = dy
  this.sx = player.x
  this.sy = player.y
  this.x = this.sx
  this.y = this.sy
  this.st = getSeconds()
  this.damage = 1

  this.draw = function(ctx) {
    var elapsed = getSeconds() - this.st;
    this.x = this.sx + Math.floor(this.dx * elapsed)
    this.y = this.sy + Math.floor(this.dy * elapsed)
    drawCell(this.x, this.y, this.map, ctx, {
      'fillStyle': 'rgba(255, 216, 16, 0.75)',
      'padding': 20
    })

    var style = {
      'fillStyle': 'rgba(255, 216, 16, 0.15)',
      'padding': 1
    }
    drawCell(this.x, this.y + 1, this.map, ctx, style)
    drawCell(this.x, this.y - 1, this.map, ctx, style)
    drawCell(this.x + 1, this.y, this.map, ctx, style)
    drawCell(this.x - 1, this.y, this.map, ctx, style)
  }

  this.shoulddestroy = function() {
    return isoffscreen(this.x, this.y, this.map);
  }

  this.update = function() {
  }

  this.ondestroy = function() {
    this.player.addpoints(1);
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
  this.t = this.st
  this.life = 1

  // TODO(Alvin): Zombies may go through walls if dx is more than 1
  this.draw = function(ctx) {
    var elapsed = getSeconds() - this.t;
    var dx = Math.floor(this.dx * elapsed)
    var dy = Math.floor(this.dy * elapsed)
    var nx = this.x + dx
    var ny = this.y + dy
    if (dx > 0 || dy > 0) {
      if (!isoffscreen(nx, ny, this.map) && this.map.grid[ny][nx] > 0) {
        this.t += elapsed
      } else {
        this.t += elapsed
        this.x = nx
        this.y = ny
      }
    }
    drawCell(this.x, this.y, this.map, ctx, {
      'fillStyle': 'rgba(244, 72, 66, 0.15)',
      'padding': 1
    })
    drawCell(this.x, this.y, this.map, ctx, {
      'fillStyle': 'rgba(244, 72, 66, 1)',
      'padding': 15
    })
  }

  this.loseLife = function(damage) {
    this.life -= damage;
  }

  this.update = function() {
    for (var i = 0; i < map.bullets.length; i++) {
      var bullet = map.bullets[i];
      if (collide(bullet, this)) {
        this.life -= bullet.damage;
        map.bullets.splice(i, 1);
        bullet.ondestroy();
      }
    }
  }

  this.shoulddestroy = function() {
    return (this.life <= 0 || isoffscreen(this.x, this.y, this.map))
  }

  this.ondestroy = function() {

  }
}

function collide(obj1, obj2) {
  return (obj1.x == obj2.x && obj1.y == obj2.y)
}

function isoffscreen(x, y, map) {
  return (x < 0 || y < 0 || x >= map.width || y >= map.height);
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

function gameOver() {
  document.getElementById('game').style.display = 'none'
  document.getElementById('gameover').style.display = 'block'
}

window.onload = function() {
  setup()
}
