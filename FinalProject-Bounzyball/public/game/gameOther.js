//  ********************************************
//              Elements for me
//  ********************************************

var canvas2 = document.getElementById("myCanvas2");
var ctx2 = canvas2.getContext("2d");
var SCORE2 = document.getElementById("words2");
SCORE2.innerHTML = "SCORE: 0 " + "  BALL: 1";
var ballRadius2 = 12;
var brickColor2 = ["#F06292", "#BA68C8", "#80DEEA", "#FFEA00", "#B3E5FC", "#CFD8DC", "#EF9A9A", "#F50057", "#DCE775", "#76FF03"];
var brickWidth2 = 60;
var brickHeight2 = 60;
var brickPadding2 = 5;
var brickOffsetTop2 = 40;
var brickOffsetLeft2 = 5;

//  ********************************************
//      Elements needed by building the game
//  ********************************************

var scoreTotal2 = 0;
var ifGameOver2 = 0;
var time2 = 0;
var start2;
var addTime2 = 0;
var upPressed2 = 0;
var ballGone2 = 0;

//	*********************************
//				Multi-ball
//	*********************************

var ballNumber2 = 1;
var temp2;
class ballArray2 {
	constructor(x, y, z, dx, dy) {
		this.x = x;
		this.y = y;
        this.z = z; //  0: onground, 1: not ongound
	    this.dx = dx;
        this.dy = dy;   
    }
}

var allBalls2 = [];
var addBall2 = 0;
var firstBall2 = new ballArray2(canvas2.width/2, canvas2.height-30, 0, 0, -2);
allBalls2.push(firstBall2);

//	*********************************
//			Bricks Variables
//	*********************************

var brickRowCount2 = 3;
var brickColumnCount2 = 7;
var bricks2 = [];

var prev_message = "-";
var othersGameMessage;
var othersGameMessageC;
var othersGameMessageR;
document.addEventListener("DOMContentLoaded", () => {
    socket.on("gamePsent", function(G){
        console.log("get");
        if(G.name != document.getElementById("name").value) othersGameMessage = G.gameMessage;
        //prev_message = othersGameMessage;
        var newMessage = othersGameMessage; // get message
        //console.log(Number(othersGameMessage.split(",")[7]), Number(othersGameMessage.split(",")[8]));
        var message2 = newMessage.split(",");

        scoreTotal2 = Number(message2[0]);
        if(message2[1] <= 1)
            ifGameOver2 = Number(message2[1]);
        time2 = Number(message2[2]);
        addTime2 = Number(message2[3]);
        addBall2 = Number(message2[4]);
        ballNumber2 = Number(message2[5]);
        //temp2 = message2[8];
        brickRowCount2 = Number(message2[7]);
        brickColumnCount2 = Number(message2[8]);
        upPressed2 = Number(message2[9]);
        ballGone2 = Number(message2[10]);

        var counter = 11;
        for(c=0; c<brickColumnCount2; c++) {
            bricks2[c] = [];
            for(r=0; r<brickRowCount2; r++, counter += 5) {
                bricks2[c][r] = { x: Number(message2[counter]), y: Number(message2[counter+1]), status: Number(message2[counter+2]) , number: Number(message2[counter+3]), color: Number(message2[counter+4])};
            }
        }


        ballNumber2 = Number(message2[counter++]);
        /*
        for(var i=0;i<ballNumber2;i++, counter += 5)
            allBalls2[i] = new ballArray2(Number(message2[counter]), Number(message2[counter+1]), Number(message2[counter+2]), Number(message2[counter+3]), Number(message2[counter+4]));
         */
        SCORE2.innerHTML = "SCORE: " + scoreTotal2 + "  BALL: " + ballNumber2;
    });

    socket.on("gamePsentblack", function(G){
        
        if(G.name != document.getElementById("name").value){
            othersGameMessageC = G.c;
            othersGameMessageR = G.r;
            console.log("getblack -> c: " + othersGameMessageC + " r: " +  othersGameMessageR);
        }

        if(othersGameMessageC < brickRowCount2){
            if(bricks[othersGameMessageC][othersGameMessageR].status == 0 || bricks[othersGameMessageC][othersGameMessageR].status == -1){
                //  create black brick
                bricks[othersGameMessageC][othersGameMessageR].color = -1;
                bricks[othersGameMessageC][othersGameMessageR].number = 1;
                bricks[othersGameMessageC][othersGameMessageR].status = 1;
            }
            else if(bricks[othersGameMessageC][othersGameMessageR].status == 1 && bricks[othersGameMessageC][othersGameMessageR].color != -1){
                //  add brick number
                bricks[othersGameMessageC][othersGameMessageR].number += 15;
            }
        }
    });
    
});

//  ********************************************
//                  Functions
//  ********************************************

//	*********************************
//			Draw Bricks
//	*********************************

function drawBricks2() {
    for(c=0; c<brickColumnCount2; c++) {
        for(r=0; r<brickRowCount2; r++) {
            if(bricks2[c][r].status == 1 && bricks2[c][r].number > 0) {
                // draw brick
                var brickX2 = (c*(brickWidth2+brickPadding2))+brickOffsetLeft2;
                var brickY2 = (r*(brickHeight2+brickPadding2))+brickOffsetTop2;
				bricks2[c][r].x = brickX2;
                bricks2[c][r].y = brickY2;
                ctx2.beginPath();
                ctx2.rect(brickX2, brickY2, brickWidth2, brickHeight2);
                var rectHeight = 50;
                
                
                //var randColorNum = Math.floor(Math.random() * 9 + 0);
                //ctx.fillStyle = brickColor[randColorNum];
                if(bricks2[c][r].color == -1){
                    //  black brick
                    ctx2.fillStyle = "black";
                    ctx2.fill();
                    ctx2.font="30px Georgia";
                    ctx2.textAlign="center"; 
                    ctx2.fillStyle = "white";
                    ctx2.fillText(bricks2[c][r].number, brickX2 + brickWidth2/2, brickY2 + brickHeight2/2);
                    ctx2.closePath();
                }
                else{
                    ctx2.fillStyle = brickColor2[bricks2[c][r].color];
                    ctx2.fill();
                    ctx2.font="30px Georgia";
                    ctx2.textAlign="center"; 
                    ctx2.fillStyle = "black";
                    ctx2.fillText(bricks2[c][r].number, brickX2 + brickWidth2/2, brickY2 + brickHeight2/2);
                    ctx2.closePath();
                }
				
				//	*************************
				//		Test if game over
				//	*************************
				
				if(brickY2 + brickHeight2/2 > canvas2.height-30){
                    // Game Over
                    ifGameOver2 = 1;
                }
            }
            else if(bricks2[c][r].status == 2){
				//  draw circle
                var brickX2 = (c*(brickWidth2+brickPadding2))+brickOffsetLeft2;
                var brickY2 = (r*(brickHeight2+brickPadding2))+brickOffsetTop2;
				bricks2[c][r].x = brickX2;
                bricks2[c][r].y = brickY2;
                ctx2.beginPath();
                ctx2.arc(brickX2 + brickWidth2/2, brickY2 + brickHeight2/2, ballRadius2 + 10, 0, Math.PI*2);
                //var randColorNum = Math.floor(Math.random() * 9 + 0);
                ctx2.fillStyle = "#9E9E9E";
                ctx2.fill();
                ctx2.closePath();
            }
        }
    }
}


function draw2(i) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If ball is still at sky
    if(allBalls2[i].z == 1){
        //drawBall2(i);
        //collisionDetection2(i);

        if(allBalls2[i].x + allBalls2[i].dx > canvas2.width-ballRadius2 || allBalls2[i].x + allBalls2[i].dx < ballRadius2) {
            allBalls2[i].dx = -allBalls2[i].dx;
        }
        if(allBalls2[i].y + allBalls2[i].dy < ballRadius2) {
            allBalls2[i].dy = -allBalls2[i].dy;
        }
        else if(allBalls2[i].y + allBalls2[i].dy > canvas2.height-ballRadius2){
            allBalls2[i].x = canvas2.width/2;
            allBalls2[i].y = canvas2.height-30;
            allBalls2[i].z = 0;
            allBalls2[i].dx = 0;
            allBalls2[i].dy = -2;

            var ballIndex;
            for(ballIndex = 0;ballIndex<ballNumber2;ballIndex++){
                if(allBalls2[ballIndex].z == 1)  //  if some ball is still at sky
                    break;
            }
            if(ballIndex == ballNumber2){
                //  all ball on ground
                ballGone2 = true;
                time2 = 0;
                addTime2 = 0;

                ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                upPressed2 = false;  
                
                //  ***************************
                //        If Add New Ball
                //  ***************************
                while(addBall2){
                    addBall2--;
                    ballNumber2++;
                    temp2 = new ballArray(canvas2.width/2, canvas2.height-30, 0, 0, -2);
                    allBalls2.push(temp2);        
                }
                SCORE2.innerHTML = "SCORE: " + scoreTotal2 + "  BALL: " + ballNumber2;
            }

            
            //document.location.reload();
        }
        
        allBalls2[i].x += allBalls2[i].dx;
        allBalls2[i].y += allBalls2[i].dy;
    }
    
    
    //console.log(i + "," + "(" + allBalls[i].x + "," + allBalls[i].y + ")\n");
}

function startTime2(){
    if(!addTime2) return;
    time2++;
	setTimeout(startTime2, 100);
}

function setBallz2(){
    for(var i = 0;i<ballNumber2;i++)
        allBalls2[i].z = 1;
}

function start2(){
    //deCodeString();
	if(ifGameOver2 == 0){
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
		//drawBall2(0);
		drawBricks2();

		if(upPressed2){
			if(time2 == 0){
			  addTime2 = 1;
			  startTime2();
			  draw2(0);
			}
		}
		if(ballGone2 == false && upPressed2){
			for(var i = 0;i<ballNumber2;i++){
				if(i < time2){
					draw2(i);
				}
			}
		}
		else if(ballGone2 == true){
			ballGone2 = false;
		}
	}
	else if(ifGameOver2 == 1)
		gameOver2();
}

function gameOver2(){
    console.log("gameOver2");
	ctx2.beginPath();
    ctx2.rect(0, 0, canvas2.width, canvas2.height);
    ctx2.fillStyle = "rgba(255, 255, 255, 0.8)";
    //var randColorNum = Math.floor(Math.random() * 9 + 0);
    //ctx.fillStyle = brickColor[randColorNum];
    ctx2.fill();
	
	ctx2.font="50px Georgia";
    ctx2.textAlign="center"; 
    ctx2.fillStyle = "red";
    ctx2.fillText("GAME OVER", canvas2.width/2, canvas2.height/2-75);
    
    ctx2.font="50px Georgia";
    ctx2.textAlign="center"; 
    ctx2.fillStyle = "black";
    ctx2.fillText("FINAL SCORE:", canvas2.width/2, canvas2.height/2);

	ctx2.font="50px Georgia";
    ctx2.textAlign="center"; 
    ctx2.fillStyle = "black";
    ctx2.fillText(scoreTotal2, canvas2.width/2, canvas2.height/2+75);
	
	ctx2.closePath();
	
	ifGameOver2 = 2;
}

setInterval(start2, 2);
