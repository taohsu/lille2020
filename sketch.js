var img;
var N = 30;
var M = 60;
var DT = 0.01;
var DX;
var DIFFUSE_COEF = 0.01;
var grid;
var coef;
var data1;
var data2;
var locationx = [];
var locationy = [];
// var trafficsite = [];
var trafficall = [];
var energyall = [];

var inde = 0;
var index;

var trafficPerhour = 0;
var trafficTotal = 0;
var trafficArray = [];

var energyPerhour = 0;
var energyTotal = 0;
var energyArray = [];

function preload() {
  data1 = loadJSON('site_4g.json');
  data2 = loadJSON('conso_4g.json');
  img = loadImage('Group.png');
}

function getSum(total, num) {
    return total + num;
}

function setup() {
  frameRate(60);
  createCanvas(600, 600);
  DX = 1.0 / N;
  // coef = DIFFUSE_COEF * DT / (DX * DX);
  coef = 0.2;
  // console.log("diffuse number: " + coef);
  initialize();
  
  
  var site = data1.sites;
  var conso = data2.siteConso;
  for (var i = 0; i < site.length; i ++) {
    var x = map(site[i].x, 3.209877, 3.305424, 0, width);
    var y = map(site[i].y, 50.855198, 50.794894, 0, height);
    append(locationx, x);
    append(locationy, y);
  }
  // console.log(locationx);
  // console.log(locationy);
  for (var i = 0; i < conso.length; i ++) {
    var trafficsite = conso[i].traffic;
    append(trafficall, trafficsite);
    // console.log(trafficsite);
    // console.log(trafficall);
    var energysite = conso[i].energy;
    append(energyall, energysite);
    // console.log(energyall);
  }

  
}

function initialize() {
  grid = createGrid();
}

function createGrid() {
  var g = new Array(N + 2);
  for (var y = 0; y < N + 2; y++) {
    var xs = new Array(N + 2);
    for (var x = 0; x < N + 2; x++) {
      xs[x] = createVector(0);
    }
    g[y] = xs;
  }
  return g;
}

function draw() {
  
  index = floor(inde) % 24;
  inde = inde + 0.1;
  
  // console.log(index);
  
  colorMode(RGB, 255, 255, 255);
  background(0);
  noStroke();
image(img, 0, 0);
  var w = width / N;
  var h = height / N;
  for (var y = 1; y < N + 1; y++) {
    for (var x = 1; x < N + 1; x++) {
      fill(grid[y][x].x, grid[y][x].y, grid[y][x].z, 190);
      rect((x - 1) * w, (y - 1) * h, w, h);
    }
  }
  

  colorMode(HSB, 360, 150, 50);
  
  // if (mouseIsPressed) {
  for (var i = 0; i < locationx.length; i++) {
    
    trafficPerhour = trafficall[i][index];
    energyPerhour = energyall[i][index];
    
    for (var y = 1; y < N + 1; y++) {
      for (var x = 1; x < N + 1; x++) {
        var d = sqrt(sq((x - 1) * w - locationx[i]) + sq((y - 1) * h - locationy[i]));
        var s = 0.5 * pow(max(width - d*4, 0) / width, map(trafficall[i][index], 132, 0, 2, 20));
        // var c = color(frameCount % 360, 100, 100);
        // var hue = round(map(energyall[i][index], 0.5, 1.6, 180, 360)) % 360;
        // console.log(hue);
        var c = color(round(map(energyall[i][index], 0, 1.4, 180, 360)) % 360, 100, 100);
        grid[y][x].add(createVector(red(c) * s, green(c) * s, blue(c) * s));
      }
    }
      
  }
  // }

  var nextGrid = createGrid();
  for (var y = 1; y < N + 1; y++) {
    for (var x = 1; x < N + 1; x++) {
      nextGrid[y][x] = p5.Vector.add(grid[y][x], 
        createVector(0.0).add(grid[y - 1][x])
                         .add(grid[y + 1][x])
                         .add(grid[y][x - 1])
                         .add(grid[y][x + 1])
                         .add(p5.Vector.mult(grid[y][x], -5))
                         .mult(coef));
    }
  }
  grid = nextGrid;
// console.log(map(trafficall[3][index], 150, 0, 2, 20));
  // console.log(floor(0.186) % 360);
  console.log(index);
  
  // for (i = 0; i =) {
  
  // }
  
  trafficArray[index] = trafficPerhour;
  console.log(trafficArray);
  energyArray[index] = energyPerhour;
  console.log(energyArray);
  
  trafficTotal = trafficArray.reduce(getSum);
  energyTotal = energyArray.reduce(getSum);
  console.log(trafficTotal);
  console.log(energyTotal);
  
  textSize(14);
  colorMode(RGB, 255, 255, 255);
  fill(255, 255, 255);
  text('Kortrijk Belgium ' + '2019-10-01 ' + index + 'h', 20, 30);
  text('Traffic hourly: ' + trafficPerhour + ' GB / h', 20, 50);
  text('Traffic Total: ' + trafficTotal + ' GB', 20, 70);
  text('Energy hourly: ' + energyPerhour + ' KWh / h', 20, 90);
  text('Energy Total: ' + energyTotal + ' GB', 20, 110);

}