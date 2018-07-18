const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
let onlineCount = 0;
var roomTo;

//  ***************************
//      Room person number
//  ***************************

var totalRoom = 0;
class roomNode{
    constructor(num, id) {
        this.num = num;
        this.id = id;   
    }
}

var rooms = [];
var newRoom;
//var newRoom = new roomNode(1, roomTo);
//rooms.push(newRoom);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connect', (socket) => {
    var myroom;
    onlineCount++;

    socket.on('room', function(room){
        if(room.length < 3){
            console.log("Room length < 3: " + room);
            return;
        }

        var count = 2;
        while(1){
            var i;
            for(i=0;i<totalRoom;i++){
                if(rooms[i].id == room)
                    break;
            }
            if(i == totalRoom){
                //  new room
                console.log("New Room: " + room);
                totalRoom++;
                socket.join(room);
                newRoom = new roomNode(1, room);
                rooms.push(newRoom);
                roomTo = room;
                io.in(room).emit("online", 1);
                io.in(room).emit("roomName", room);
                myroom = room;
                break;
            }
            else{
                // room exist
                if(rooms[i].num == 1){
                    console.log("In old Room: " + room);
                    socket.join(room);
                    rooms[i].num++;
                    roomTo = room;
                    io.in(room).emit("online", 2);
                    io.in(room).emit("roomName", room);
                    myroom = room;
                    break;
                }
                else{
                    //  room full
                    room += count.toString();
                    count++;
                }
            }         
        }
        
    });

    socket.on("send", (msg, room) => {
        // name or message are empty
        console.log(msg);  
        if (Object.keys(msg).length < 2) return;
        io.in(room).emit("receive", msg);
    });

    socket.on("sendstartgame", (room) => {
        // name or message are empty
        console.log("Room start game: " + room); 
        io.in(room).emit("startgame", "1");
    });

    socket.on('disconnect', function() {
        leaveRoom();
    });

    var winnerSend = 0;
    socket.on("winner", (input, room) => {
        console.log("Winner Data: " + input);
        if(input == "tie" && winnerSend == 0){
            var MessagePackage = {};
            MessagePackage["name"] = "Server";
            MessagePackage["msg"] = "This is a tie game!!!!!";
            io.in(room).emit("receive", MessagePackage);
            winnerSend = 1;
        }
        else if(winnerSend == 0){
            var MessagePackage = {};
            MessagePackage["name"] = "Server";
            MessagePackage["msg"] = input + " is the winner!!!!!";
            io.in(room).emit("receive", MessagePackage);
            winnerSend = 1;
        }    
    });

    var leaveRoom = function() {
        var i;
        for(i=0;i<totalRoom;i++){
            if(rooms[i].id == myroom)
                break;
        }
        if(totalRoom == 0 || i == totalRoom){
            console.log("Leave Room error...");
            return;
        }
        
        console.log("Leave Room: " + myroom);
        rooms[i].num--;
        io.to(myroom).emit('online', rooms[i].num);
        if(rooms[i].num == 0){
            totalRoom--;
            rooms = rooms.slice(0,i).concat(rooms.slice(i+1));
        }
    };

    socket.on('game', (GP, room) =>{
        //console.log("GP sent!");
        io.in(room).emit("gamePsent" ,GP);
    });

    socket.on('gameblack', (GP, room) =>{
        //console.log("GP sent!");
        io.in(room).emit("gamePsentblack" ,GP);
    });

    socket.on('getuserinfo', (msg) =>{
        console.log("Get User Info. : " + msg);
    });
});

server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});