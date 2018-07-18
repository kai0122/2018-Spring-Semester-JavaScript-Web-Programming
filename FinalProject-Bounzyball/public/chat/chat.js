        document.addEventListener("DOMContentLoaded", () => {
            var content = document.getElementById("content");
            var numberofmessage = 0;
            var lastSender;
            var disconnect = 0;
            var myname = "0";
            while(myname.length < 3){
                myname = prompt("Please enter your user name, message sent from empty user name will be avoided. (Length must larger than 3.)");
                console.log("name: " + myname);
            }
            document.getElementById("name").value = myname;
            
            var room = "0";
            while(room.length < 3){
                room = prompt("Please enter your room name, empty room name will be avoided. (Length must larger than 3.)");
                console.log("room: " + room);
            }
            document.getElementById("room").value = room;
            socket.emit('getuserinfo', myname + " / " + room);
            socket.emit("sendstartgame", room);

            socket.on("connect", function() {
                disconnect = 0;
                document.getElementById("status").innerText = "Connected.";
                socket.emit('room', room);
            });

            socket.on("disconnect", function() {
                disconnect = 1;
                document.getElementById("status").innerText = "Disconnected.";
            });


            socket.on("online", function(amount) {
                document.getElementById("online").innerText = amount;
            });

            socket.on("roomName", function(name) {
                document.getElementById("roomName").innerText = name;
                room = name;
                document.getElementById("room").value = name;
            });

            socket.on("receive", function(P) { // P for package
                if (lastSender != P.name) { // CSS for received message
                    var nameBox = document.createElement("span");
                    nameBox.className = "name";
                    var name = document.createTextNode(P.name);
                    nameBox.appendChild(name);
                    lastSender = P.name;
                    if (P.name == myname) {
                        nameBox.className = "myname";
                    }
                    content.appendChild(nameBox);
                }

                var msgbox = document.createElement("span");
                msgbox.className = "msg";
                var msg = document.createTextNode(P.msg);
                msgbox.appendChild(msg);
                var msgBox = document.createElement("div");
                msgBox.style = "width: 100%; float: right;";
                msgBox.appendChild(msgbox);

                if (P.name == myname) msgbox.className = "msg_from_me";
                if (P.name == "Server") msgbox.className = "server_msg";
                if (lastSender == P.name) msgbox.style = "margin-top: 0.25%;";
                msgBox.id = numberofmessage.toString();

                content.appendChild(msgBox);
                numberofmessage++;

                //for auton scroll down on everytime oneself's message being sent
                if (P.name == myname)
                    document.getElementById((numberofmessage).toString()).scrollIntoView();

            });

            var SendForm = document.getElementById("form");
            SendForm.addEventListener("submit", function(e) {
                e.preventDefault();

                var MessagePackage = {};
                var NoEmptyMessageAndName = true;
                var CSSforSendBox = document.getElementById("msg");
                MessagePackage["name"] = myname;
                for (var i = 0; i < SendForm.childElementCount; i++) {
                    var ithchild = SendForm.children[i];
                    if (ithchild.name == "msg") {
                        if (ithchild.value == "" || !ithchild.value) {
                            NoEmptyMessageAndName = false;
                            CSSforSendBox.style = "border: 3px solid red;";
                            CSSforSendBox.placeholder = "Empty message having been avoided";
                        } else {
                            MessagePackage[ithchild.name] = ithchild.value;
                            CSSforSendBox.style = "border: 3px solid rgb(41, 182, 37);";
                        }
                    }
                }
                if (NoEmptyMessageAndName) socket.emit("send", MessagePackage, room);
                msg.value = ""; // clear html input buffer
            });

            document.addEventListener('keydown', function(e) {
                if(e.keyCode == 37) {
                    var MessagePackage = {};
                    MessagePackage["name"] = myname;
                    MessagePackage["msg"] = "Σ(・ω・ノ)ノ ┴─┴ 加油加油!!!";

                    socket.emit("send", MessagePackage, room);
                }
                else if(e.keyCode == 38) {
                    var MessagePackage = {};
                    MessagePackage["name"] = myname;
                    MessagePackage["msg"] = "(=^_^=) 爽拉哈哈哈";

                    socket.emit("send", MessagePackage, room);
                }
                else if(e.keyCode == 39) {
                    var MessagePackage = {};
                    MessagePackage["name"] = myname;
                    MessagePackage["msg"] = "╭∩╮（￣▽￣）╭∩╮ 嘿嘿嘿你慘了";

                    socket.emit("send", MessagePackage, room);
                }
                else if(e.keyCode == 40) {
                    var MessagePackage = {};
                    MessagePackage["name"] = myname;
                    MessagePackage["msg"] = "o(〒﹏〒)o 嗚嗚要輸了>3<";

                    socket.emit("send", MessagePackage, room);
                }
            });
        });