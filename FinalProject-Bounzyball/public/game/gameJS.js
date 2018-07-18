var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var SCORE = document.getElementById("words");
var scoreTotal = 0;
var ifGameOver = 0;
SCORE.innerHTML = "SCORE: " + scoreTotal + "  BALL: 1";
var ballRadius = 12;
var brickColor = ["#F06292", "#BA68C8", "#80DEEA", "#FFEA00", "#B3E5FC", "#CFD8DC", "#EF9A9A", "#F50057", "#DCE775", "#76FF03"];
var startGame = 0;

//var x = canvas.width/2;
//var y = canvas.height-30;
//var dx = 0;
//var dy = -2;
var time = 0;
var start;
var addTime = 0;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var ballGone = false;

//	*********************************
//				Direction
//	*********************************

var paddleHeight = 10;
var paddleWidth = 10;
var paddleX = (canvas.width-paddleWidth)/2;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height * 3 / 4, paddleWidth, paddleHeight);
    ctx.fillStyle = "#F48FB1";
    ctx.fill();
    ctx.closePath();
}

//	*********************************
//				Multi-ball
//	*********************************

var ballNumber = 1;
var temp;
class ballArray {
	constructor(x, y, z, dx, dy) {
		this.x = x;
		this.y = y;
        this.z = z; //  0: onground, 1: not ongound
	    this.dx = dx;
        this.dy = dy;   
    }
}

var allBalls = [];
var addBall = 0;
var firstBall = new ballArray(canvas.width/2, canvas.height-30, 0, 0, -2);
allBalls.push(firstBall);

//	*********************************
//			Bricks Variables
//	*********************************

var brickRowCount = 3;
var brickColumnCount = 7;
var brickWidth = 60;
var brickHeight = 60;
var brickPadding = 5;
var brickOffsetTop = 40;
var brickOffsetLeft = 5;

//	*********************************
//			Create Bricks
//	*********************************

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        var randNum = Math.floor(Math.random() * ballNumber * 2 + 1);
        var randColorNum = Math.floor(Math.random() * 9 + 0);
        var ifAdd = Math.floor(Math.random() * 6 + 0);
        if(ifAdd == 0){
            // no bricks
            bricks[c][r] = { x: 0, y: 0, status: 0 , number: randNum, color: randColorNum};
        }
        else if(ifAdd == 2){
            // add ball brick
            bricks[c][r] = { x: 0, y: 0, status: 2 , number: randNum, color: randColorNum};
        }
        else{
            var ifColorBlack = Math.floor(Math.random() * 6 + 0);   //  if brick is black (special brick)
            if(ifColorBlack == 0){
                //  black brick
                bricks[c][r] = { x: 0, y: 0, status: 1 , number: randNum * 2, color: -1};
            }
            else{
                //  colorful brick
                bricks[c][r] = { x: 0, y: 0, status: 1 , number: randNum, color: randColorNum};    
            }
        }
    }
}

//  *********************************
//          Update Bricks
//  *********************************


function updateBricks(){
    for(c=0; c<brickColumnCount; c++) {
        var randNum = Math.floor(Math.random() * ballNumber * 2 + 1);
        var randColorNum = Math.floor(Math.random() * 9 + 0);
        bricks[c][brickRowCount] = { x: 0, y: 0, status: 1, number: randNum, color: randColorNum};
        for(r=brickRowCount; r>0; r--) {
             bricks[c][r] = bricks[c][r-1];
        }
        var randNum = Math.floor(Math.random() * ballNumber * 2 + 1);
        var randColorNum = Math.floor(Math.random() * 9 + 0);
        var ifAdd = Math.floor(Math.random() * 6 + 0);
        if(ifAdd == 0){
            // no bricks
            bricks[c][0] = { x: 0, y: 0, status: 0 , number: randNum, color: randColorNum};
        }
        else if(ifAdd == 2){
            // add ball brick
            bricks[c][0] = { x: 0, y: 0, status: 2 , number: randNum, color: randColorNum};
        }
        else{
            var ifColorBlack = Math.floor(Math.random() * 6 + 0);   //  if brick is black (special brick)
            if(ifColorBlack == 0){
                //  black brick
                bricks[c][0] = { x: 0, y: 0, status: 1 , number: randNum * 2, color: -1};
            }
            else{
                //  colorful brick
                bricks[c][0] = { x: 0, y: 0, status: 1 , number: randNum, color: randColorNum};    
            }
        }
    }
    brickRowCount++;
}

//	*********************************
//			Draw Bricks
//	*********************************

var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1 && bricks[c][r].number > 0) {
                // draw brick
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                var rectHeight = 50;
                
                
                //var randColorNum = Math.floor(Math.random() * 9 + 0);
                //ctx.fillStyle = brickColor[randColorNum];
                if(bricks[c][r].color == -1){
                    //  black brick
                    ctx.fillStyle = "black";
                    ctx.fill();
                    ctx.font="30px Georgia";
                    ctx.textAlign="center"; 
                    ctx.fillStyle = "white";
                    ctx.fillText(bricks[c][r].number, brickX + brickWidth/2, brickY + brickHeight/2);
                    ctx.closePath();
                }
                else{
                    ctx.fillStyle = brickColor[bricks[c][r].color];
                    ctx.fill();
                    ctx.font="30px Georgia";
                    ctx.textAlign="center"; 
                    ctx.fillStyle = "black";
                    ctx.fillText(bricks[c][r].number, brickX + brickWidth/2, brickY + brickHeight/2);
                    ctx.closePath();
                }
				
				//	*************************
				//		Test if game over
				//	*************************
				
				if(brickY + brickHeight/2 > canvas.height-30){
                    // Game Over
                    ifGameOver = 1;
                }
            }
            else if(bricks[c][r].status == 2){
				//  draw circle
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.arc(brickX + brickWidth/2, brickY + brickHeight/2, ballRadius + 10, 0, Math.PI*2);
                //var randColorNum = Math.floor(Math.random() * 9 + 0);
                ctx.fillStyle = "#9E9E9E";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//	********************************************************************

//	*********************************
//		Collision Detection
//	*********************************

function collisionDetection(i) {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(allBalls[i].y + ballRadius + 0.5 > b.y && allBalls[i].y - (ballRadius + 0.5) < b.y+brickHeight && allBalls[i].x + (ballRadius + 0.5) > b.x && allBalls[i].x - (ballRadius + 0.5) < b.x+brickWidth){
                    var midX = b.x + brickWidth/2;
                    var midY = b.y + brickHeight/2;
                    if(Math.abs(allBalls[i].x - midX) >= Math.abs(allBalls[i].y - midY))
                        allBalls[i].dx = -allBalls[i].dx;
                    else
                        allBalls[i].dy = -allBalls[i].dy;

                    if(b.color != -1){  //  update brick color
                        var randColorNum = Math.floor(Math.random() * 9 + 0);
                        b.color = randColorNum;    
                    }
                    
                    b.number--;
                    if(b.number == 0)
                        b.status = -1;

                    //  Update Score
                    scoreTotal += 50;
                    console.log(scoreTotal);
                    SCORE.innerHTML = "SCORE: " + scoreTotal + "  BALL: " + ballNumber;

                    //  SEND BLACK BRICK INFO.
                    if(b.color == -1){
                        var gamePackage = {};
                        gamePackage["name"] = document.getElementById("name").value;
                        gamePackage["c"] = c;
                        gamePackage["r"] = r;
                        socket.emit("gameblack", gamePackage, document.getElementById("room").value);    
                    }
                }
            }
            else if(b.status == 2){
                if(allBalls[i].y > b.y && allBalls[i].y < b.y+brickHeight && allBalls[i].x > b.x && allBalls[i].x < b.x+brickWidth){
                    b.status = -1;
                    // add ball
                    addBall++;
                }
            }
        }
    }
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    else if(e.keyCode == 38){
    	//upPressed = true;
        // not using now
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall(index) {
    ctx.beginPath();
    ctx.arc(allBalls[index].x, allBalls[index].y, ballRadius, 0, Math.PI*2);
    //var randColorNum = Math.floor(Math.random() * 9 + 0);
    ctx.fillStyle = "#9E9E9E";
    ctx.fill();
    ctx.closePath();
}

function draw(i) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If ball is still at sky
    if(allBalls[i].z == 1){
        drawBall(i);
        collisionDetection(i);

        if(allBalls[i].x + allBalls[i].dx > canvas.width-ballRadius || allBalls[i].x + allBalls[i].dx < ballRadius) {
            allBalls[i].dx = -allBalls[i].dx;
        }
        if(allBalls[i].y + allBalls[i].dy < ballRadius) {
            allBalls[i].dy = -allBalls[i].dy;
        }
        else if(allBalls[i].y + allBalls[i].dy > canvas.height-ballRadius){
            allBalls[i].x = canvas.width/2;
            allBalls[i].y = canvas.height-30;
            allBalls[i].z = 0;
            allBalls[i].dx = 0;
            allBalls[i].dy = -2;

            var ballIndex;
            for(ballIndex = 0;ballIndex<ballNumber;ballIndex++){
                if(allBalls[ballIndex].z == 1)  //  if some ball is still at sky
                    break;
            }
            if(ballIndex == ballNumber){
                //  all ball on ground
                ballGone = true;
                time = 0;
                addTime = 0;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                upPressed = false;  
                
                //  ***************************
                //        If Add New Ball
                //  ***************************
                while(addBall){
                    addBall--;
                    ballNumber++;
                    temp = new ballArray(canvas.width/2, canvas.height-30, 0, 0, -2);
                    allBalls.push(temp);        
                }
                SCORE.innerHTML = "SCORE: " + scoreTotal + "  BALL: " + ballNumber;
                updateBricks();
                //enCodeString();
            }

            
            //document.location.reload();
        }
        
        allBalls[i].x += allBalls[i].dx;
        allBalls[i].y += allBalls[i].dy;
    }
    
    enCodeString();
    //console.log(i + "," + "(" + allBalls[i].x + "," + allBalls[i].y + ")\n");
}

function startTime(){
    if(!addTime) return;
    time++;
	setTimeout(startTime, 100);
}

function setBallz(){
    for(var i = 0;i<ballNumber;i++)
        allBalls[i].z = 1;
}

function start(){
    if(startGame == 1){
        if(ifGameOver == 0 && ifGameOver2 == 0){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall(0);
            drawBricks();
            drawPaddle();
            if(mouse.y < canvas.height-55)
                drawArrow();

            if(!upPressed){
                changeDirection();
                setBallz();
            }
            else{
                if(time == 0){
                  addTime = 1;
                  startTime();
                  draw(0);
                }
            }
            if(ballGone == false && upPressed){
                for(var i = 0;i<ballNumber;i++){
                    if(i < time && allBalls[i].z){
                        draw(i);
                    }
                }
            }
            else if(ballGone == true){
                ballGone = false;
            }
        }
        else if(ifGameOver == 1 || ifGameOver2 == 1){
            ifGameOver = 1;
            ifGameOver2 = 1;
            gameOver();
        }
        else if(ifGameOver == 2 && ifGameOver == 2){
            calculateWinner();
        }    
    }
}


function changeDirection(){
	var newDx = 1000, newDy = 10000;
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 2;
        newDx = 2 * (paddleX - allBalls[0].x) / Math.sqrt((paddleX - allBalls[0].x) * (paddleX - allBalls[0].x) + (canvas.height * 3 / 4 - allBalls[0].y) * (canvas.height * 3 / 4 - allBalls[0].y));
        newDy = 2 * (canvas.height * 3 / 4 - allBalls[0].y) / Math.sqrt((paddleX - allBalls[0].x) * (paddleX - allBalls[0].x) + (canvas.height * 3 / 4 - allBalls[0].y) * (canvas.height * 3 / 4 - allBalls[0].y));
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 2;
        newDx = 2 * (paddleX - allBalls[0].x) / Math.sqrt((paddleX - allBalls[0].x) * (paddleX - allBalls[0].x) + (canvas.height * 3 / 4 - allBalls[0].y) * (canvas.height * 3 / 4 - allBalls[0].y));
        newDy = 2 * (canvas.height * 3 / 4 - allBalls[0].y) / Math.sqrt((paddleX - allBalls[0].x) * (paddleX - allBalls[0].x) + (canvas.height * 3 / 4 - allBalls[0].y) * (canvas.height * 3 / 4 - allBalls[0].y));
    }
    if(newDx != 1000 && newDy != 1000){
        for(var i=0;i<ballNumber;i++){
            allBalls[i].dx = newDx;
            allBalls[i].dy = newDy;
        }    
    }
}


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

//  *********************************
//             Mouse-Press
//  *********************************

var container = document.querySelector("#myCanvas"); 
container.addEventListener("click", getClickPosition, false);

function Mouse(){
    var obj = this;
    this.x = 0;
    this.y = 0;
    container.addEventListener('mousemove',function(e){
        var rect = container.getBoundingClientRect();
        obj.x = e.clientX - rect.left;
        obj.y = e.clientY - rect.top;
    },false);
}

mouse = new Mouse();

function drawArrow(){
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height-30);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#9E9E9E";
    ctx.stroke();
}


function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    if(upPressed == false && (e.clientY - parentPosition.y) < canvas.height+30){
        upPressed = true;
        for(i=0;i<ballNumber;i++){
            allBalls[i].dx = 2 * ((e.clientX - parentPosition.x) - allBalls[0].x) / Math.sqrt(((e.clientX - parentPosition.x) - allBalls[0].x) * ((e.clientX - parentPosition.x) - allBalls[0].x) + (e.clientY - parentPosition.y - allBalls[0].y) * (e.clientY - parentPosition.y - allBalls[0].y));
            allBalls[i].dy = 2 * (e.clientY - parentPosition.y - allBalls[0].y) / Math.sqrt(((e.clientX - parentPosition.x) - allBalls[0].x) * ((e.clientX - parentPosition.x) - allBalls[0].x) + (e.clientY - parentPosition.y - allBalls[0].y) * (e.clientY - parentPosition.y - allBalls[0].y));
            allBalls[i].z = 1;
        }
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

function gameOver(){
    console.log("gameOver");
	ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    //var randColorNum = Math.floor(Math.random() * 9 + 0);
    //ctx.fillStyle = brickColor[randColorNum];
    ctx.fill();
	
	ctx.font="50px Georgia";
    ctx.textAlign="center"; 
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2-75);
    
    ctx.font="50px Georgia";
    ctx.textAlign="center"; 
    ctx.fillStyle = "black";
    ctx.fillText("FINAL SCORE:", canvas.width/2, canvas.height/2);

	ctx.font="50px Georgia";
    ctx.textAlign="center"; 
    ctx.fillStyle = "black";
    ctx.fillText(scoreTotal, canvas.width/2, canvas.height/2+75);
	
	ctx.closePath();
	
	ifGameOver = 2;
}

var message = "";
function enCodeString(){
    message = "";
    message += scoreTotal.toString() + ",";
    message += ifGameOver.toString() + ",";
    message += time.toString() + ",";
    message += addTime.toString() + ",";
    message += addBall.toString() + ",";
    message += ballNumber.toString() + ",";
    message += "asd" + ",";
    message += brickRowCount.toString() + ",";
    message += brickColumnCount.toString() + ",";
    message += upPressed.toString() + ",";
    message += ballGone.toString() + ",";

    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            message += bricks[c][r].x.toString() + ",";
            message += bricks[c][r].y.toString() + ",";
            message += bricks[c][r].status.toString() + ",";
            message += bricks[c][r].number.toString() + ",";
            message += bricks[c][r].color.toString() + ",";
        }
    }

    message += ballNumber.toString();

    /*
    for(var i=0;i<ballNumber;i++){
        message += allBalls[i].x.toString() + ",";
        message += allBalls[i].y.toString() + ",";
        message += allBalls[i].z.toString() + ",";
        message += allBalls[i].dx.toString() + ",";
        message += allBalls[i].dy.toString() + ",";
    }
    */
    
    // send message out
    var gamePackage = {};
    gamePackage["name"] = document.getElementById("name").value;
    gamePackage["gameMessage"] = message;
    socket.emit("game", gamePackage, document.getElementById("room").value);
    //console.log(document.getElementById("name").value+','+message);
}

//  **********************************
//          Calculate Winner  
//  **********************************

function calculateWinner(){
    if(scoreTotal > scoreTotal2){
        socket.emit("winner", document.getElementById("name").value, document.getElementById("room").value);
    }
    else if(scoreTotal == scoreTotal2){
        socket.emit("winner", "tie", document.getElementById("room").value);
    }
    ifGameOver = 3;
}

document.addEventListener("DOMContentLoaded", () => {
    socket.on("startgame", function(SG){
        //  get name and room number: start game
        console.log("START GAME...");
        startGame = 1;
    });
});

setInterval(start, 2);
enCodeString();

