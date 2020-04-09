var url = window.location.search;
var city = getQueryVariable("city");
var date = getQueryVariable("date"); 
var dateformat;
var dayday;
var daydayday;
var antenna = getQueryVariable("antenna");
//var city = 'Kortrijk';
// var city = 'Brussels';
//var date = '2019-10-19';
//var antenna = '4g';
var sitedata;
var siteCount;
var consodata;
// var sitedata = 'Kortrijk_2019-10-01_site_4g.json';
// var consodata = 'Kortrijk_2019-10-01_conso_4g.json';
var img;
var N;
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

var siteRangeX1;
var siteRangeX2;
var siteRangeY1;
var siteRangeY2;
var reso;
var tmin;
var tmax;
var emin;
var emax;


var tminMax = [];
var eminMax = [];

var inde = 0;
var index;

var trafficPerhour = 0;
var trafficTotal = 0;
var trafficArray = [];

var energyPerhour = 0;
var energyTotal = 0;
var energyArray = [];

function preload() {
  sitedata = city + '_site_' + date + '_' + antenna + '.json';
  consodata = city + '_conso_' + date + '_' + antenna + '.json';
  // console.log(sitedata);
  // console.log(conso);
  data1 = loadJSON(sitedata);
  data2 = loadJSON(consodata);
  
  img = loadImage(city + '.png');
}

function getSum(total, num) {
    return total + num;
}

function setup() {
  frameRate(30);
  createCanvas(600, 600);
  DX = 1.0 / N;
  // coef = DIFFUSE_COEF * DT / (DX * DX);
  coef = 0.2;

  // console.log("diffuse number: " + coef);
    
  var d = date.replace(/([0-9]{2})\-([0-9]{2})\-([0-9]{4})/g, '$3-$2-$1');
  dateformat = new Date(date); 
  console.log(dateformat);
  dayday = dateformat.getDay();
  console.log(dayday);
  
  if (dayday == 0) {
      daydayday = 'Sunday';
  } else if (dayday == 1) {
      daydayday = 'Monday';
  } else if (dayday == 2) {
      daydayday = 'Tuesday';
  } else if (dayday == 3) {
      daydayday = 'Wednesday';
  } else if (dayday == 4) {
      daydayday = 'Thursday';
  } else if (dayday == 5) {
      daydayday = 'Friday';
  } else if (dayday == 6) {
      daydayday = 'Saturday';
  }
    
  if (city === 'Courtrai') {
      siteRangeX1 = 3.209877;
      siteRangeX2 = 3.305424;
      siteRangeY1 = 50.855198;
      siteRangeY2 = 50.794894;
      reso = 1;
      tmin = 0;
      tmax = 49;
      emin = 0.1;
      emax = 1.1;
  } else if (city === 'Bruxelles') {
//      siteRangeX1 = 4.280566;
//      siteRangeX2 = 4.454363;
//      siteRangeY1 = 50.905324;
//      siteRangeY2 = 50.796123;
      siteRangeX1 = 4.293294;
      siteRangeX2 = 4.419026;
      siteRangeY1 = 50.890385;
      siteRangeY2 = 50.811246;
      reso = 1.5;
      tmin = 0;
      tmax = 92;
      emin = 0;
      emax = 1.5;
  }
    
   N = 30*2*reso;
  
   initialize();
  
  var site = data1.sites;
  var conso = data2.siteConso;
  tminMax = data2.trafficMinMax;
  eminMax = data2.energyMiMax;
  
  console.log(tminMax);
  console.log(eminMax);
  
  for (var i = 0; i < site.length; i ++) {
    var x = map(site[i].x, siteRangeX1, siteRangeX2, 0, width);
    var y = map(site[i].y, siteRangeY1, siteRangeY2, 0, height);
    append(locationx, x);
    append(locationy, y);
    siteCount = site.length;
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
  inde = inde + 0.25*reso;
    
  if (index == 0) {
     trafficArray = [];
     energyArray = [];
  }
  
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
//        var s = 0.3 * pow(sq(max(width - d*4*reso, 0) / width), map(trafficall[i][index], tminMax[1], tminMax[0], 2, 20));
         var s = 0.5 * pow(max(width - d*16*reso, 0) / width, map(trafficall[i][index], 200, 0, 2, 20));
        // var c = color(frameCount % 360, 100, 100);
        // var hue = round(map(energyall[i][index], 0.5, 1.6, 180, 360)) % 360;
        // console.log(hue);
        var c = color(round(map(energyall[i][index], eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//        var c = color(round(map(energyall[i][index], eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
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
  console.log('tmin' + min(trafficArray));
  console.log('tmax' + max(trafficArray));
  energyArray[index] = energyPerhour;
  console.log(energyArray);
  console.log('emin' + min(energyArray));
  console.log('emax' + max(energyArray));
  
  trafficTotal = trafficArray.reduce(getSum);
  energyTotal = energyArray.reduce(getSum);
  console.log(trafficTotal);
  console.log(energyTotal);

    
  textSize(10);
  colorMode(RGB, 255, 255, 255);
  fill(255, 255, 255);
  text('10:69', 10, height - 200);
  text(city + ' ' + date + ' ' + daydayday + ' ' + index + 'h', 10, height - 175);
  text(antenna + '_sites: ' + siteCount, 10, height - 160);

  fill(255);
  push();
  translate(10,480);
  text('Data traffic: ', 0, -10);
  for (var i = 0; i < index; i++) {
//    rect(2*i,20,2,map(trafficArray[i], tminMax[0], tminMax[1], 0, -20));
      rect(2*i,20,2,map(trafficArray[i], tmin, tmax, 0, -20));
  }
  rect(0,20,48,1);
  rect(0,20,1,-20);
  text(trafficPerhour.toFixed(2) + ' GB/h' + '  Total: ' + trafficTotal.toFixed(2) + ' GB', 0, 36);
  pop();
  
  push();
  translate(10,556);
  text('Energy consumption: ', 0, -10);
  for (var i = 0; i < index; i++) {
//    rect(2*i,20,2,map(energyArray[i], eminMax[0], eminMax[1], 0, -20));
      rect(2*i,20,2,map(energyArray[i], emin, emax, 0, -20));
  }
  rect(0,20,48,1);
  rect(0,20,1,-20);
  text(energyPerhour.toFixed(2) + ' KWh/h' + '  Total: ' + energyTotal.toFixed(2) + ' KWh', 0, 36);
  pop();


}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}