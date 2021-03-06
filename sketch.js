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
var tminmax;
var displaycity;
var rmax;


var tminMax = [];
var eminMax = [];

var inde = 0;
var index;

var trafficPerhour = 0;
var trafficPerhourArray = [];
var trafficPerhourAll;
var trafficTotal = 0;
var trafficArray = [];

var energyPerhour = 0;
var energyPerhourArray = [];
var energyPerhourAll;
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
      tmax = 2200;
      emin = 0;
      emax = 40;
      tminmax = 160;
      displaycity = 'COURTRAI';
      rmax = 100;
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
      tmax = 21800;
      emin = 0;
      emax = 200;
      tminmax = 730;
      displaycity = 'BRUXELLES';
      rmax = 30;
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
     trafficPerhourArray = [];
     energyPerhourArray = [];
      
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
    append(trafficPerhourArray, trafficPerhour);
    append(energyPerhourArray, energyPerhour);
    
    for (var y = 1; y < N + 1; y++) {
      for (var x = 1; x < N + 1; x++) {
        var d = sqrt(sq((x - 1) * w - locationx[i]) + sq((y - 1) * h - locationy[i]));
//        var s = 0.3 * pow(sq(max(width - d*4*reso, 0) / width), map(trafficall[i][index], tminMax[1], tminMax[0], 2, 20));
         var s = 0.5 * pow(max(width - d*4*reso, 0) / width, map(trafficall[i][index], tminmax, tminMax[0], 1, 15));
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
       // sum all sites per hour
  trafficPerhourAll = trafficPerhourArray.slice(trafficPerhourArray.length - locationx.length, trafficPerhourArray.length).reduce(getSum);
  console.log(trafficPerhourArray.slice(trafficPerhourArray.length - locationx.length, trafficPerhourArray.length));
    
  energyPerhourAll = energyPerhourArray.slice(energyPerhourArray.length - locationx.length, energyPerhourArray.length).reduce(getSum);
  console.log(energyPerhourArray.slice(energyPerhourArray.length - locationx.length, energyPerhourArray.length));
 
    
    
    

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
  
    
        trafficArray[index] = trafficPerhourAll;
        energyArray[index] = energyPerhourAll;
  
  console.log(trafficArray);
  console.log('tmin' + min(trafficArray));
  console.log('tmax' + max(trafficArray));
  
  console.log(energyArray);
  console.log('emin' + min(energyArray));
  console.log('emax' + max(energyArray));
  
  trafficTotal = trafficArray.reduce(getSum);
  energyTotal = energyArray.reduce(getSum);
//  console.log(trafficTotal);
//  console.log(energyTotal);

    
  colorMode(RGB, 255, 255, 255);
  fill(255, 255, 255);
//  text('11:06', 10, height - 200);
  push();
  translate(10,30);
//  textStyle(BOLD);
  textSize(14);
  text(displaycity, 0, -5);
  pop();
  push();
  translate(10,556);
  textSize(18);
  textStyle(NORMAL);
  text(antenna, 0, 0);
  textSize(10);
  text(siteCount + ' sites clusters', 30, 0);
  text(daydayday + ' ' + date, 0, 15);
  fill('#9FFA5E');
  textSize(16);
  text(index + 'h', 0, 35);
  pop();

  fill(255);
  push();
  translate(160,556);
  textSize(9);
  text('DATA TRAFFIC ', 0, -10);
  for (var i = 0; i < index; i++) {
//    rect(2*i,20,2,map(trafficArray[i], tminMax[0], tminMax[1], 0, -20));
      rect(2*i,36,2,map(trafficArray[i], tmin, tmax, 0, -36));
  }
  fill(255, 255, 255, 125);
  rect(0,36,48,1);
  rect(-1,37,1,-37);
  fill(255, 255, 255, 255);
  text(trafficArray[i].toFixed(2) + ' GB / h', 60, 22);
  text('Total: ' + trafficTotal.toFixed(2) + ' GB', 60, 36);
  pop();
  
  push();
  translate(330,556);
  textSize(9);
  text('ENERGY COMSUMPTION ', 0, -10);
  for (var i = 0; i < index; i++) {
//    rect(2*i,20,2,map(energyArray[i], eminMax[0], eminMax[1], 0, -20));
      rect(2*i,36,2,map(energyArray[i], emin, emax, 0, -36));
  }
  fill(255, 255, 255, 125);
  rect(0,36,48,1);
  rect(-1,37,1,-37);
  fill(255, 255, 255, 255);
  text(energyArray[i].toFixed(2) + ' KWh / h', 60, 22);
  text('Total: ' + energyTotal.toFixed(2) + ' KWh', 60, 36);
  pop();
    
  push();
  translate(500,556);
  textSize(9);
  text('RATIO', 0, -10);
  text('ENERGY PER GB', 0, 2);
//  for (var i = 0; i < index; i++) {
////    rect(2*i,20,2,map(energyArray[i], eminMax[0], eminMax[1], 0, -20));
//      rect(2*i,36,2,map(energyArray[i]/trafficArray[i], 0, rmax, 0, -36));
//  }
//  fill(255, 255, 255, 125);
//  rect(0,36,48,1);
//  rect(-1,37,1,-37);
  fill(255, 255, 255, 255);
  textSize(18);
//  textStyle(BOLD);
  text((energyTotal/trafficTotal).toFixed(2), 0, 22);
  textSize(9);
//  textStyle(NORMAL);
  text('KWh / GB', 0, 36);
  pop();
    
  push();
  translate(480,30);
  textSize(9);
  text('ENERGY CONSUMPTION PER SITE', -40, -10);
  
  push();
  translate(-40,5);
  text(eminMax[0].toFixed(2), 0, 0);
  text(eminMax[1].toFixed(2), 133, 0);
    push();
    translate(23,-5);
      colorMode(HSB, 360, 150, 50);
      fill(180, 100, 30);
      rect(0,0,5,5);
      fill(189, 100, 30);
      rect(5,0,5,5);
      fill(198, 100, 30);
      rect(10,0,5,5);
      fill(207, 100, 30);
      rect(15,0,5,5);
      fill(216, 100, 30);
      rect(20,0,5,5);
      fill(225, 100, 30);
      rect(25,0,5,5);
      fill(234, 100, 30);
      rect(30,0,5,5);
      fill(243, 100, 30);
      rect(35,0,5,5);
      fill(252, 100, 30);
      rect(40,0,5,5);
      fill(261, 100, 30);
      rect(45,0,5,5);
      fill(270, 100, 30);
      rect(50,0,5,5);
      fill(279, 100, 30);
      rect(55,0,5,5);
      fill(288, 100, 30);
      rect(60,0,5,5);
      fill(297, 100, 30);
      rect(65,0,5,5);
      fill(306, 100, 30);
      rect(70,0,5,5);
      fill(315, 100, 30);
      rect(75,0,5,5);
      fill(324, 100, 30);
      rect(80,0,5,5);
      fill(333, 100, 30);
      rect(85,0,5,5);
      fill(342, 100, 30);
      rect(90,0,5,5);
      fill(351, 100, 30);
      rect(95,0,5,5);
      fill(360, 100, 30);
      rect(100,0,5,5);
    pop();
  pop();
//  color(round(map(((eminMax[1]-eminMax[0]) / 10) * 1 , eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//  rect(10,10,10,10);
//  color(round(map(((eminMax[1]-eminMax[0]) / 10) * 2 , eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//  rect(20,10,10,10);
//  color(round(map(((eminMax[1]-eminMax[0]) / 10) * 3 , eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//  rect(30,10,10,10);
//  color(round(map(((eminMax[1]-eminMax[0]) / 10) * 4 , eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//  rect(40,10,10,10);
//  color(round(map(eminMax[1], eminMax[0], eminMax[1], 180, 360)) % 360, 100, 100);
//  rect(50,10,5,10);
    
//  colorMode(RGB, 255, 255, 255);
//  fill(255, 255, 255);
  pop();
    
//  textSize(10);
//  colorMode(RGB, 255, 255, 255);
//  fill(255, 255, 255);
////  text('11:06', 10, height - 200);
//  text(city + ' ' + date + ' ' + daydayday + ' ' + index + 'h', 10, height - 175);
//  text(antenna + '_sites: ' + siteCount, 10, height - 160);
//
//  fill(255);
//  push();
//  translate(10,480);
//  text('Data traffic: ', 0, -10);
//  for (var i = 0; i < index; i++) {
////    rect(2*i,20,2,map(trafficArray[i], tminMax[0], tminMax[1], 0, -20));
//      rect(2*i,20,2,map(trafficArray[i], tmin, tmax, 0, -20));
//  }
//  rect(0,20,48,1);
//  rect(0,20,1,-20);
//  text(trafficPerhour.toFixed(2) + ' GB/h' + '  Total: ' + trafficTotal.toFixed(2) + ' GB', 0, 36);
//  pop();
//  
//  push();
//  translate(10,556);
//  text('Energy consumption: ', 0, -10);
//  for (var i = 0; i < index; i++) {
////    rect(2*i,20,2,map(energyArray[i], eminMax[0], eminMax[1], 0, -20));
//      rect(2*i,20,2,map(energyArray[i], emin, emax, 0, -20));
//  }
//  rect(0,20,48,1);
//  rect(0,20,1,-20);
//  text(energyPerhour.toFixed(2) + ' KWh/h' + '  Total: ' + energyTotal.toFixed(2) + ' KWh', 0, 36);
//  pop();


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