var canvas2 = document.getElementById("myCanvas2");
var ctx2 = canvas2.getContext("2d");
var allBalls2 = [];
var middleDist = 15;

//  *********************************
//              Draw-line
//  *********************************

function drawLine(){
    ctx2.beginPath();
    ctx2.moveTo(canvas2.width/2, 0);
    ctx2.lineTo(canvas2.width/2, canvas2.height/2 - middleDist);
    ctx2.moveTo(canvas2.width/2, canvas2.height);
    ctx2.lineTo(canvas2.width/2, canvas2.height/2 + middleDist);
    ctx2.lineWidth = 5;
    ctx2.strokeStyle = "#9E9E9E";
    ctx2.stroke();
}

//	*********************************
//				Multi-ball
//	*********************************

var ballNumber2 = Math.floor(Math.random() * 18 + 13);
class ballArray2 {
	constructor(x, y, dx, dy, w) {
		this.x = x;
		this.y = y;
	    this.dx = dx;
        this.dy = dy;
        this.where = w;
    }
}

//  *********************************
//         Ball-Initialization
//  *********************************

function initialize2(){
    for(i=0;i<ballNumber2;i++){
        do{
        var dx = Math.floor(Math.random() * 5 + -2);
        var dy = Math.floor(Math.random() * 5 + -2);
        }while(dx == 0 && dy == 0);
        var firstBall = new ballArray2(canvas2.width/4, canvas2.height/2, dx, dy, 0);
        allBalls2.push(firstBall);
        console.log(dx, dy);
    }
}

//  *********************************
//      Collision Detection
//  *********************************

function collisionDetection2(i) {
    for(j=0;j<ballNumber2;j++){
        if(j != i){
            // test if collide with other balls
            var disX = Math.abs(allBalls2[i].x-allBalls2[j].x);
            var disY = Math.abs(allBalls2[i].y-allBalls2[j].y);
            if(Math.sqrt(disX * disX + disY * disY) < ballRadius * 2){
                var nextX = Math.abs(allBalls2[i].x + allBalls2[i].dx - allBalls2[j].x - allBalls2[j].dx);
                var nextY = Math.abs(allBalls2[i].y + allBalls2[i].dy - allBalls2[j].y - allBalls2[j].dy);
                if(Math.sqrt(nextX * nextX + nextY * nextY) < Math.sqrt(disX * disX + disY * disY)){
                    var tmp = allBalls2[i].dx;
                    allBalls2[i].dx = allBalls2[j].dx;
                    allBalls2[j].dx = tmp;
                    var tmp2 = allBalls2[i].dy;
                    allBalls2[i].dy = allBalls2[j].dy;
                    allBalls2[j].dy = tmp2;    
                }
            }
        }
    }
}

//  *********************************
//              Drawing
//  *********************************

function drawBall2(index) {
    ctx2.beginPath();
    ctx2.arc(allBalls2[index].x, allBalls2[index].y, ballRadius, 0, Math.PI*2);
    ctx2.fillStyle = ballColor[index%10];
    ctx2.fill();
    ctx2.closePath();
}

function draw2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    drawLine();

    for(i=0;i<ballNumber2;i++){
        drawBall2(i);
        collisionDetection2(i);
        
        // check x position
        if(allBalls2[i].where == 0){
            if(allBalls2[i].x + allBalls2[i].dx > canvas2.width/2-ballRadius || allBalls2[i].x + allBalls2[i].dx < ballRadius) {

                // check if change place
                if(allBalls2[i].x + allBalls2[i].dx > canvas2.width/2-ballRadius && allBalls2[i].y + allBalls2[i].dy < canvas2.height/2 + middleDist && allBalls2[i].y + allBalls2[i].dy > canvas2.height/2 - middleDist){
                    allBalls2[i].where = 1;
                    var disX = Math.abs(allBalls2[i].x + allBalls2[i].dx - canvas2.width/2);
                    var disY1 = Math.abs(allBalls2[i].y + allBalls2[i].dy - (canvas2.height/2 - middleDist));
                    var disY2 = Math.abs(allBalls2[i].y + allBalls2[i].dy - (canvas2.height/2 + middleDist));
                    if(Math.sqrt(disX * disX + disY1 * disY1) < ballRadius || Math.sqrt(disX * disX + disY1 * disY2) < ballRadius){
                        allBalls2[i].dy = -allBalls2[i].dy;
                    }
                }
                else{
                    allBalls2[i].dx = -allBalls2[i].dx;
                    allBalls2[i].dy = Math.floor(Math.random() * 11 + -5);    
                }
            }    
        }
        else{
            if(allBalls2[i].x + allBalls2[i].dx > canvas2.width-ballRadius || allBalls2[i].x + allBalls2[i].dx < ballRadius + canvas2.width/2) {
                
                // check if change place
                if(allBalls2[i].x + allBalls2[i].dx < ballRadius + canvas2.width/2 && allBalls2[i].y + allBalls2[i].dy < canvas2.height/2 + middleDist && allBalls2[i].y + allBalls2[i].dy > canvas2.height/2 - middleDist){
                    allBalls2[i].where = 0;
                    var disX = Math.abs(allBalls2[i].x + allBalls2[i].dx - canvas2.width/2);
                    var disY1 = Math.abs(allBalls2[i].y + allBalls2[i].dy - (canvas2.height/2 - middleDist));
                    var disY2 = Math.abs(allBalls2[i].y + allBalls2[i].dy - (canvas2.height/2 + middleDist));
                    if(Math.sqrt(disX * disX + disY1 * disY1) < ballRadius || Math.sqrt(disX * disX + disY1 * disY2) < ballRadius){
                        allBalls2[i].dy = -allBalls2[i].dy;
                    }
                }
                else{
                    allBalls2[i].dx = -allBalls2[i].dx;
                    allBalls2[i].dy = Math.floor(Math.random() * 11 + -5);    
                }
            }   
        }
        
        // check y position
        if(allBalls2[i].y + allBalls2[i].dy < ballRadius || allBalls2[i].y + allBalls2[i].dy > canvas2.height-ballRadius) {
            allBalls2[i].dx = Math.floor(Math.random() * 11 + -5);
            allBalls2[i].dy = -allBalls2[i].dy;
        }
        allBalls2[i].x += allBalls2[i].dx;
        allBalls2[i].y += allBalls2[i].dy;
    }
}

//  *********************************
//              Add-Ball
//  *********************************

function addBall2(){
    do{
    var dx = Math.floor(Math.random() * 5 + -2);
    var dy = Math.floor(Math.random() * 5 + -2);
    }while(dx == 0 && dy == 0);
    
    var firstBall = new ballArray2(canvas2.width/4, canvas2.height/2, dx, dy, 0);
    allBalls2.push(firstBall);
    ballNumber2++;
}

//  *********************************
//               Start
//  *********************************

initialize2();
setInterval(draw2, 10);
