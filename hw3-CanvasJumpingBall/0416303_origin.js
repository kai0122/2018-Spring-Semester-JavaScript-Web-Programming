var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var allBalls = [];
var ballColor = ["#F06292", "#BA68C8", "#80DEEA", "#FFEA00", "#B3E5FC", "#CFD8DC", "#EF9A9A", "#F50057", "#DCE775", "#76FF03"];

//	*********************************
//				Multi-ball
//	*********************************

var ballNumber = Math.floor(Math.random() * 8 + 3);
class ballArray {
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
	    this.dx = dx;
        this.dy = dy;   
    }
}

//  *********************************
//         Ball-Initialization
//  *********************************

function initialize(){
    for(i=0;i<ballNumber;i++){
        do{
        var dx = Math.floor(Math.random() * 5 + -2);
        var dy = Math.floor(Math.random() * 5 + -2);
        }while(dx == 0 && dy == 0);
        var firstBall = new ballArray(canvas.width/2, canvas.height/2, dx, dy);
        allBalls.push(firstBall);
        console.log(dx, dy);
    }
}

//  *********************************
//              Drawing
//  *********************************

function drawBall(index) {
    ctx.beginPath();
    ctx.arc(allBalls[index].x, allBalls[index].y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor[index%10];
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(i=0;i<ballNumber;i++){
        drawBall(i);
        if(allBalls[i].x + allBalls[i].dx > canvas.width-ballRadius || allBalls[i].x + allBalls[i].dx < ballRadius) {
            allBalls[i].dx = -allBalls[i].dx;
            allBalls[i].dy = Math.floor(Math.random() * 11 + -5);
        }
        if(allBalls[i].y + allBalls[i].dy < ballRadius || allBalls[i].y + allBalls[i].dy > canvas.height-ballRadius) {
            allBalls[i].dx = Math.floor(Math.random() * 11 + -5);
            allBalls[i].dy = -allBalls[i].dy;
        }
        allBalls[i].x += allBalls[i].dx;
        allBalls[i].y += allBalls[i].dy;
    }
}

//  *********************************
//              Add-Ball
//  *********************************

function addBall(){
    do{
    var dx = Math.floor(Math.random() * 5 + -2);
    var dy = Math.floor(Math.random() * 5 + -2);
    }while(dx == 0 && dy == 0);
    
    var firstBall = new ballArray(canvas.width/2, canvas.height/2, dx, dy);
    allBalls.push(firstBall);
    ballNumber++;
}

//  *********************************
//             Mouse-Press
//  *********************************

var container = document.querySelector("#myCanvas"); 
container.addEventListener("click", getClickPosition, false);
 
function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    for(i=0;i<ballNumber;i++){
        allBalls[i].x = e.clientX - parentPosition.x;
        allBalls[i].y = e.clientY - parentPosition.y;
    }
}
 
// get an element's exact position
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    }
    else{
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

//  *********************************
//               Start
//  *********************************

initialize();
setInterval(draw, 10);
