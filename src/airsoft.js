const {TextView, ImageView, Composite, CollectionView} = require('tabris');
const {Slider, Canvas, ui} = require('tabris');

const Board = 400, Target = 200, Mic = 220; // mm
const ring10 = 11.5, ringN = 16, ringLine = 0.5, Pellet = 6; // mm
const B = 300, T = 150, W = screen.width; // pixel
const pixF = 300/400;

const V = 350; //575; // m/sec
const F = 48000000; // Hz 

const dg = ['\u{24FF}', '\u{2776}', '\u{2777}', '\u{2778}', '\u{2779}', '\u{277A}',
  '\u{277B}', '\u{277C}', '\u{277D}', '\u{277E}', '\u{277F}'];
let hitNo = 0, hitScore = 0, Score = 0, Average = 0, arrow = '\u2192';
let X = 0, Y = 0, arrowAngle = 0, zoomF = 1; 
let playbutton = false, hitcomposetoggle = false;
let zoomcheck = false, tapcheck = true, highscorecheck = true, timercheck = true;
////////////////////////////////////////////
ui.statusBar.displayMode = 'hide';
ui.contentView.background = 'black'; //'rgb(60, 60, 50)'
////////////////////////////////////////////
zoomF = 1;

let Compose1 = new Composite({
  top: (W - B)/2, left: (W - B)/2, width: B, height: B, visible: true, background: 'black'     
}).appendTo(ui.contentView);

let Canvas11 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose1);
let ctx11 = Canvas11.getContext('2d', B, B);
ctx11.fillStyle = 'white';
ctx11.moveTo(15, 0);
ctx11.lineTo(285,0);
ctx11.arc(285, 15, 15, (3/2)*Math.PI, 0);
ctx11.lineTo(300,285);
ctx11.arc(285, 285, 15, 0, (1/2)*Math.PI);
ctx11.lineTo(15,300);
ctx11.arc(15, 285, 15, (1/2)*Math.PI, Math.PI);
ctx11.lineTo(0,15);
ctx11.arc(15, 15, 15, Math.PI, (3/2)*Math.PI);
ctx11.fill();

let Canvas12 = new Canvas({
  top: (B - T)/2, left: (B - T)/2, width: T, height: T,   background: 'rgb(240, 230, 140)'
}).appendTo(Compose1);
let ctx12 = Canvas12.getContext('2d', T, T);
ctx12.lineWidth = ringLine*pixF*zoomF;
ctx12.font = 'bold 5px'; // 12px/zoomF
for (let i = 4; i <= 9; i++){
  ctx12.arc(T/2, T/2, (((i*ringN) + ring10)*pixF)/2, 0, 2*Math.PI);
}
ctx12.stroke();
for (let i = 3; i <= 8; i++){
  ctx12.fillText(String(9 - i), (T/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 1, T/2 + 2);
  ctx12.fillText(String(9 - i), (T/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 4), T/2 + 2);   
  ctx12.fillText(String(9 - i), T/2 - 2.5, (T/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 4);  
  ctx12.fillText(String(9 - i), T/2 - 2.5, (T/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 1));       
}

let Canvas13 = new Canvas({
  top: (B - T)/2, left: (B - T)/2, width: T, height: T
}).appendTo(Compose1);
let ctx13 = Canvas13.getContext('2d', T, T);
ctx13.arc(T/2, T/2, (((3*ringN) + ring10)*pixF)/2, 0, 2*Math.PI);
ctx13.fill();

let Canvas14 = new Canvas({
  top: (B - T)/2, left: (B - T)/2, width: T, height: T,
}).appendTo(Compose1);
let ctx14 = Canvas14.getContext('2d', T, T);
ctx14.lineWidth = ringLine*pixF*zoomF;
ctx14.strokeStyle = 'white';
ctx14.fillStyle = 'white';
ctx14.font = 'bold 5px'; // 12px/zoomF
for (let i = 1; i <= 3; i++){
  ctx14.arc(T/2, T/2, (((i*ringN) + ring10)*pixF)/2, 0, 2*Math.PI);
}
ctx14.stroke();
/*
for (let i = 1; i <= 2; i++){
  ctx14.fillText(String(9 - i), (T/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 1, T/2 + 2);
  ctx14.fillText(String(9 - i), (T/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 4), T/2 + 2);   
  ctx14.fillText(String(9 - i), T/2 - 2.5, (T/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 4);  
  ctx14.fillText(String(9 - i), T/2 - 2.5, (T/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 1));       
}
*/
let Canvas15 = new Canvas({
  top: (B - T)/2, left: (B - T)/2, width: T, height: T
}).appendTo(Compose1);
let ctx15 = Canvas15.getContext('2d', T, T);
ctx15.fillStyle = 'rgb(240, 230, 140)';
ctx15.arc(T/2, T/2, (ring10*pixF)/2, 0, 2*Math.PI);
ctx15.fill();

zoomF = B/T;

let Compose2 = new Composite({
  top: (W - B)/2, left: (W - B)/2, width: B, height: B, visible: false
}).appendTo(ui.contentView);

let Canvas21 = new Canvas({
  top: 0, left: 0, width: B, height: B, background: 'rgb(240, 230, 140)'
}).appendTo(Compose2);
let ctx21 = Canvas21.getContext('2d', B, B);
ctx21.lineWidth = ringLine*pixF*zoomF;
for (let i = 4; i <= 9; i++){
  ctx21.arc(B/2, B/2, (((i*ringN) + ring10)*pixF*zoomF)/2, 0, 2*Math.PI);
}
ctx21.stroke();
for (let i = 3; i <= 8; i++){
  ctx21.fillText(String(9 - i), (B/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 2, B/2 + 3);
  ctx21.fillText(String(9 - i), (B/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 9), B/2 + 3);   
  ctx21.fillText(String(9 - i), B/2 - 3, (B/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 10);  
  ctx21.fillText(String(9 - i), B/2 - 3, (B/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 1));       
}

let Canvas22 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose2);
let ctx22 = Canvas22.getContext('2d', B, B);
ctx22.arc(B/2, B/2, (((3*ringN) + ring10)*pixF*zoomF)/2, 0, 2*Math.PI);
ctx22.fill();

let Canvas23 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose2);
let ctx23 = Canvas23.getContext('2d', B, B);
ctx23.lineWidth = ringLine*pixF*zoomF;
ctx23.strokeStyle = 'white';
ctx23.fillStyle = 'white';
for (let i = 1; i <= 3; i++){
  ctx23.arc(B/2, B/2, (((i*ringN) + ring10)*pixF*zoomF)/2, 0, 2*Math.PI);
}
ctx23.stroke();
for (let i = 1; i <= 2; i++){
  ctx23.fillText(String(9 - i), (B/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 2, B/2 + 3);
  ctx23.fillText(String(9 - i), (B/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 9), B/2 + 3);
  ctx23.fillText(String(9 - i), B/2 - 3, (B/2) + (((i*ringN) + ring10)*pixF*zoomF)/2 + 10);  
  ctx23.fillText(String(9 - i), B/2 - 3, (B/2) - ((((i*ringN) + ring10)*pixF*zoomF)/2 + 1));
}

let Canvas24 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose2);
let ctx24 = Canvas24.getContext('2d', B, B);
ctx24.fillStyle = 'rgb(240, 230, 140)';
ctx24.arc(B/2, B/2, (ring10*pixF*zoomF)/2, 0, 2*Math.PI);
ctx24.fill();

let Canvas1 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose1);
let canvas1 = Canvas1.getContext('2d', B, B);
canvas1.fillStyle = 'white';

let onCanvas1 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose1);
let oncanvas1 = onCanvas1.getContext('2d', B, B);
oncanvas1.fillStyle = 'blue';

let Canvas2 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose2);
let canvas2 = Canvas2.getContext('2d', B, B);
canvas2.fillStyle = 'white';

let onCanvas2 = new Canvas({
  top: 0, left: 0, width: B, height: B
}).appendTo(Compose2);
let oncanvas2 = onCanvas2.getContext('2d', B, B);
oncanvas2.fillStyle = 'blue';

let targetCanvas = new Canvas({
  top: (W - B)/2, left: (W - B)/2, width: B, height: B
}).on({tap: ({touches}) => {
  if (tapcheck === true) {
    X = touches[0].x;
    Y = touches[0].y;
    renderXY();
  }
}
}).appendTo(ui.contentView);

zoomF = 1;
////////////////////////////////////////////
let timerCheck = new ImageView({
  top: 365, left: 310, width: 30, height: 30, 
  image: 'src/images/otimer.png', scaleMode: 'stretch',
}).on('tap', () => {
  timercheck = !timercheck;
  timerCheck.opacity = timercheck ? 1 : 0.5;  
  minSlider.visible = timercheck ? true : false;
  secSlider.visible = timercheck ? true : false;
  minuteView.visible = timercheck ? true : false;
  secondView.visible = timercheck ? true : false;
  dotView.visible = timercheck ? true : false;
}).on('enabledChanged', ({value}) => {
  if (value === true){
    minSlider.visible = timercheck ? true : false;
    secSlider.visible = timercheck ? true : false;
  } else {
    minSlider.visible = false;
    secSlider.visible = false;
  }
}).appendTo(ui.contentView);

let highscoreCheck = new ImageView({
  top: 365, left: 270, width: 30, height: 30, 
  image: 'src/images/ohigh.png', scaleMode: 'stretch',
}).on('tap', () => {
  highscorecheck = !highscorecheck;
  highscoreCheck.opacity = highscorecheck ? 1 : 0.5;
  highscoreSlider.visible = highscorecheck ? true : false; 
  highscoreView.visible = highscorecheck ? true : false;
}).on('enabledChanged', ({value}) => {
  if (value === true){
    highscoreSlider.visible = highscorecheck ? true : false;
  } else {
    highscoreSlider.visible = false;
  }
}).appendTo(ui.contentView);

let tapCheck = new ImageView({
  top: 365, left: 230, width: 30, height: 30, 
  image: 'src/images/otap.png', scaleMode: 'stretch',
}).on('tap', () => {
  tapcheck = !tapcheck;
  tapCheck.opacity = tapcheck ? 1 : 0.5;  
}).appendTo(ui.contentView);

let zoomCheck = new ImageView({
  top: 365, left: 190, width: 30, height: 30, 
  image: 'src/images/ozoom.png', scaleMode: 'stretch', opacity: 0.5
}).on('tap', () => {
  zoomcheck = !zoomcheck;
  zoomCheck.opacity = zoomcheck ? 1 : 0.5;
  Compose1.visible = zoomcheck ? false : true;
  Compose2.visible = zoomcheck ? true : false;
  zoomF = zoomcheck ? B/T : 1;
}).appendTo(ui.contentView);

let playButton = new ImageView({
  top: 345, left: 20, width: 50, height: 50, image: 'src/images/oplay.png', scaleMode: 'stretch'
}).on('tap', () => {
  PlayStop();
}).appendTo(ui.contentView);

function PlayStop(){
  playbutton = !playbutton;
  playButton.image = playbutton ? 'src/images/ostop.png' : 'src/images/oplay.png';
  timerCheck.enabled = playbutton ? false : true;  
  highscoreCheck.enabled = playbutton ? false : true;  
  if (playbutton === true){
    let canvas1 = Canvas1.getContext('2d', B, B);
    canvas1.fillStyle = 'white';
    let oncanvas1 = onCanvas1.getContext('2d', B, B);
    oncanvas1.fillStyle = 'blue';
    let canvas2 = Canvas2.getContext('2d', B, B);
    canvas2.fillStyle = 'white';
    let oncanvas2 = onCanvas2.getContext('2d', B, B);
    oncanvas2.fillStyle = 'blue';
    hitNo = 0, hitScore = 0, Score = 0, hits = [{}], hits.length = 0, scoreList.itemCount = 0;  
    hitNoView.text = 0, hitscoreView.text = '\u{24FF}', averageView.text = '0.0';
    scoreView.text = 0, scoreView.visible = true; 
    hitCompose.background = 'rgb(78, 93, 114)', hitcomposetoggle = false;
    //scoreView.textColor = 'white';
    minuteView.text = minSlider.selection, secondView.text = secSlider.selection;  
    arrowView.transform = {rotation: 0};        
  } 
}

//let freeShootViewView = new TextView({
//  top: 330, left: 0, right: 0, alignment: 'center',
//  text: 'Free Shooting', font: '18px', textColor: 'white'
//}).appendTo(ui.contentView);
////////////////////////////////////////////
let scoreList = new CollectionView({
  top: 420, left: 10, right: 130, height: 200, cellHeight: 20, itemCount: 0,
  createCell: () => {
    let cell = new Composite();
    new TextView({
      right: 180, alignment: 'right', font: '16px', id: 'txt1', textColor: 'white'
    }).appendTo(cell);
    new TextView({
      right: 141, alignment: 'right', font: '16px', id: 'txt2', textColor: 'white'
    }).appendTo(cell);
    new TextView({
      right: 101, alignment: 'right', font: '16px', id: 'txt3', text: arrow, textColor: 'white'
    }).appendTo(cell);
    new TextView({
      right: 54, alignment: 'right', font: '16px', id: 'txt4', textColor: 'white'
    }).appendTo(cell);
    new TextView({
      right: 3, alignment: 'right', font: '16px', id: 'txt5', textColor: 'white'
    }).appendTo(cell);
    return cell;
  },
  updateCell: (cell, index) => {
    cell.find('#txt1').set('text', hits[index].hitN);
    cell.find('#txt2').set('text', dg[hits[index].hitS]);
    cell.find('#txt4').set('text', hits[index].Avg);
    cell.find('#txt5').set('text', hits[index].Scr);
    if (hits[index].hitS < 10){
      cell.find('#txt3').set('text', arrow);
      cell.find('#txt3').set('transform', {rotation: hits[index].arrowAng});       
    } else {       
      cell.find('#txt3').set('text', '\u{2713}');
      cell.find('#txt3').set('transform', {rotation: 0});
    }  
  }                                               
}).appendTo(ui.contentView);
  
let secSlider = new Slider({
  top: 537, left: 251, width: 150, tintColor: 'white', 
  transform: {rotation: Math.PI *3/2}, minimum: 0, maximum: 59, selection: 0
}).on('selectionChanged', ({value}) => {
  secondView.text = value;
}).appendTo(ui.contentView);

let minSlider = new Slider({
  top: 537, left: 222, width: 150, tintColor: 'white', 
  transform: {rotation: Math.PI *3/2}, minimum: 0, maximum: 9, selection: 1
}).on('selectionChanged', ({value}) => {
  minuteView.text = value;
}).appendTo(ui.contentView);

let highscoreSlider = new Slider({
  top: 537, left: 193, width: 150, tintColor: 'white', 
  transform: {rotation: Math.PI *3/2}, minimum: 0, maximum: 100, selection: 16
}).on('selectionChanged', ({value}) => {    
  highscoreView.text = 5*value;
}).appendTo(ui.contentView);

let sliderDown = new TextView({
  top: 612, right: 22, width: 90, height: 1, background: 'white'
}).appendTo(ui.contentView);
////////////////////////////////////////////
let hitCompose = new Composite({
  top: 400, left: 10, right: 10, height: 40, background: 'rgb(78, 93, 114)'
}).appendTo(ui.contentView);

let secondView = new TextView({
  top:2, left: 310, alignment: 'left', 
  text: 0, font: '24px', textColor: 'white'
}).appendTo(hitCompose);

let dotView = new TextView({
  top:2, right: 35, alignment: 'right', 
  text: ':', font: '24px', textColor: 'white'  
}).appendTo(hitCompose);

let minuteView = new TextView({
  top:2, right: 45, alignment: 'right', 
  text: 1, font: '24px', textColor: 'white'
}).appendTo(hitCompose);

let highscoreView = new TextView({
  top:2, right: 70, alignment: 'right', 
  text: 80, font: '24px', textColor: 'white' 
}).appendTo(hitCompose);

let scoreView = new TextView({
  top:2, right: 120, alignment: 'right', 
  text: 0, font: '24px', textColor: 'white'
}).appendTo(hitCompose);

let averageView = new TextView({
  top:2, right: 170, alignment: 'right', 
  text: '0.0', font: '24px', textColor: 'white'
}).appendTo(hitCompose);
  
let arrowView = new TextView({
  top: 0, right: 215, alignment: 'center',
  text: arrow, font: '28px', textColor: 'white'//, visible: false
}).appendTo(hitCompose);

let hitscoreView = new TextView({
  top: 0, right: 255, alignment: 'right', 
  text: '\u{24FF}', font: '28px', textColor: 'white'
}).appendTo(hitCompose);

let hitNoView = new TextView({
  top:2, right: 295, alignment: 'right', 
  text: 0, font: '24px', textColor: 'white' 
}).appendTo(hitCompose);
////////////////////////////////////////////
function renderXY(){ 
  if (playbutton === true && hitNo < 999) {
    hitNo = hits.length + 1;       
    calculate();
    hitNoView.text = hitNo;    
    hitscoreView.text = dg[hitScore];
    scoreView.text = Score;  
    averageView.text = Average;
    hits.unshift({hitN: hitNo, hitS: hitScore, arrowAng: arrowAngle, 
      Avg: Average, Scr: Score});
    scoreList.load(hits.length);
    scoreList.reveal(0);
    
    let zoff1 = Number(zoomcheck)*((B - T)/2);
    let zoff2 = Number(!zoomcheck)*((B - T)/2);
    
    canvas1.arc(X/zoomF + zoff1, Y/zoomF + zoff1, 
      (Pellet*pixF)/2, 0, 2 * Math.PI);
    canvas1.stroke();
    canvas1.fill();        
    let oncanvas1 = onCanvas1.getContext('2d', B, B);
    oncanvas1.fillStyle = 'blue';
    oncanvas1.strokeStyle = 'red';/////////////
    oncanvas1.arc(X/zoomF + zoff1, Y/zoomF + zoff1, 
      (Pellet*pixF)/2, 0, 2 * Math.PI);
    oncanvas1.fill();
    oncanvas1.arc(X/zoomF + zoff1, Y/zoomF + zoff1, 
      ((Pellet*pixF)/2)*3, 0, 2 * Math.PI);////////////
    oncanvas1.stroke();/////////////


    canvas2.arc(((X - zoff2)*(B/T))/zoomF, ((Y - zoff2)*(B/T))/zoomF, 
      (Pellet*pixF*(B/T))/2, 0, 2 * Math.PI);
    canvas2.stroke();///////////////
    canvas2.fill();  
    let oncanvas2 = onCanvas2.getContext('2d', B, B);
    oncanvas2.fillStyle = 'blue';
    oncanvas2.strokeStyle = 'red';/////////////
    oncanvas2.arc(((X - zoff2)*(B/T))/zoomF, ((Y - zoff2)*(B/T))/zoomF, 
      (Pellet*pixF*(B/T))/2, 0, 2 * Math.PI);
    oncanvas2.fill();
    oncanvas2.arc(((X - zoff2)*(B/T))/zoomF, ((Y - zoff2)*(B/T))/zoomF, 
      ((Pellet*pixF*(B/T))/2)*3, 0, 2 * Math.PI);/////////////
    oncanvas2.stroke();/////////////
    // Final !!!!     
    if (highscorecheck === true){ 
      if (Score >= highscoreView.text){
        if (timercheck === false){
          PlayStop();
        }
      }
    }  
  }
}
////////////////////////////////////////////
function calculate(){  
  // Score XY  
  let x = Math.abs(X - (B/2));
  let y = Math.abs(Y - (B/2));
  let r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  let rN = r - ((ring10/2)*pixF*zoomF);
  let r10 = r - rN;
  hitScore = 10 - (Math.floor((rN / ((ringN/2)*pixF*zoomF)) + (r10 / ((ring10/2)*pixF*zoomF))));
  if (hitScore < 1) {hitScore = 0;}
  Score += hitScore; 
  Average = (Score/hitNo).toFixed(1);
  // Arrow XY   
  if (hitScore < 10){ 
    arrowView.text = arrow;
    if ((X - (B/2)) === 0){X += 0.001;} 
    arrowAngle = Math.atan((Y - (B/2)) / (X - (B/2))); 
    if ((X - (B/2)) < 0){arrowAngle += Math.PI;}
    arrowView.transform = {rotation: arrowAngle};    
  } else {
    arrowView.text = '\u{2713}';
    arrowView.transform = {rotation: 0};    
  }   
}
////////////////////////////////////////////
setInterval(() => {    
  if (playbutton === true) {
    if (timercheck === true) {
      secondView.text -= 1;
      if (secondView.text < 0) {      
        if (minuteView.text <= 0) {
          secondView.text = 0;
          PlayStop();
        } else {minuteView.text -= 1;
          secondView.text = 59;
        } 
      }    
    }
  }
}, 1000);

setInterval(() => {
  hitcomposetoggle = !hitcomposetoggle;
  if (highscorecheck === true){
    if (Score >= highscoreView.text){
      hitCompose.background = hitcomposetoggle? 'green' : 'rgb(78, 93, 114)';
      //scoreView.textColor = 'green';
      //scoreView.visible = !scoreView.visible;        
    } else if (playbutton === false){
      hitCompose.background = hitcomposetoggle? 'red' : 'rgb(78, 93, 114)';      
      //scoreView.textColor = 'white';
      //scoreView.visible = !scoreView.visible;
    }
  }
}, 500);

setInterval(() => {
  if (playbutton === true){
    loadData();
  }
}, 100);
////////////////////////////////////////////
function loadData() {   
  fetch('http://192.168.2.215:80')
    .then(response => response.text())
    .then((text) => {
      // get tick
      console.log('ticks:');
      let tick = text.split(' ');
      for (let i = 0; i <= 3; i++){
        console.log(tick[i]);
      }      
      // tick TO time
      let time = [];
      console.log('times:');
      for (let i = 0; i <= 3; i++){
        time[i] = tick[i] / F; // sec
        console.log(time[i]);
      }
      // time TO distance
      let dist = [];
      console.log('distances:');
      for (let i = 0; i <= 3; i++){
        dist[i] = (time[i] * V) * 1000;  // mm
        console.log(dist[i]);
      }

      //dist[0] = 0;
      //dist[1] = 0;
      //dist[2] = 140;
      //dist[3] = 140;

      // XY mm
      let z = (- Math.pow(dist[0],2) + Math.pow(dist[1],2) 
               - Math.pow(dist[2],2) + Math.pow(dist[3],2))
                 / (2*dist[0] - 2*dist[1] + 2*dist[2] - 2*dist[3]);
      X = (Math.pow((z + dist[0]),2) - Math.pow((z + dist[3]),2) + Math.pow(Mic,2)) / (2*Mic);
      Y = (Math.pow((z + dist[0]),2) - Math.pow((z + dist[1]),2) + Math.pow(Mic,2)) / (2*Mic);
      Y = Mic - Y; // from target bottom left to device top left
      console.log('XY:');
      console.log(X);
      console.log(Y);
      // XY pixel
      X += ((Board - Mic)/2), Y += ((Board - Mic)/2);
      X = X*pixF, Y = Y*pixF;
      renderXY();      
    }).catch((err) => {
      //console.log(err);
      //console.log('no data');
    });
}

