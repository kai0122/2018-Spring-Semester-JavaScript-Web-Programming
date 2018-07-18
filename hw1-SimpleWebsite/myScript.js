function showTime(){
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var session = "AM";

	if(hour == 0)
		hour = 12;
	else if(hour > 12){
		hour -=12;
		session = "PM";
	}

	hour = (hour < 10) ? "0" + hour : hour;	//	change hour to string, and if is single number -> add "0"
	minute = (minute < 10) ? "0" + minute : minute;	//	change minute to string, and if is single number -> add "0"
	second = (second < 10) ? "0" + second : second;	//	change second to string, and if is single number -> add "0"

	var time = hour + ":" + minute + ":" + second + " " + session;
	document.getElementById("MyClock").innerText = time;
	document.getElementById("MyClock").textContent = time;

	setTimeout(showTime, 1000);	//	every second renew
}

showTime();