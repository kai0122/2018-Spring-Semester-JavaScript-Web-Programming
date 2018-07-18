//	localhost: 8080/find or 8080/findName --> 個人查詢
//	localhost: 8080/listSchool
//	localhost: 8080/listDepart?School=???
//	localhost: 8080/listRoll?depcode=????

var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");
var mysql = require('mysql');
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "uac"
});

db.connect(function(err){
	if(err) throw err;
	console.log("Connected!");
});

http.createServer(function(request, response){
	var pathname = url.parse(request.url).pathname;
	// retrieve query string ==> a['school']
	if(request.method == 'POST'){
		var body = '';
		request.on('data', function(data){
			body += data;
		});
		request.on('end', function(){
			var query = qs.parse(body);
			main(response, pathname, query);
		});
	}
	else{	//	console.log('GET...')
		var query = qs.parse(url.parse(request.url).query);
		main(response, pathname, query);
	}
}).listen(8080, '127.0.0.1', function(){
	console.log("HTTP listening at http://%s:%s/",
	this.address().address,this.address().port);
});

function main(response, pathname, query){
	switch(pathname){
		case "/find": uacFind(response, query); break;
		case "/findName": uacFindName(response, query); break;
		case "/listSchool": uacListSchool(response); break;
		case "/listDepart": uacListDepart(response, query); break;
		case "/listRoll": uacListRoll(response, query); break;
		case "/index.html": case '/index.htm': case "default.html":
		case "/": toClient(response, ""); break;	//	uac.html
		default: // /favicon.ico, /uac.css, /uac.js
			fs.createReadStream('.' + pathname)
			.on('error', function(e){
				console.log('Caught', e);
				response.end(pathname + ' file not found');
			})
			.on('readable', function(){this.pipe(response)});
			break;
	}
}

function uacFindName(response, query){
	db.query("select eid,name,school,depname from roll,depart where name like '%" + query['name'] + "%' and roll.depcode = depart.depcode", function (err, result) {
	    var i, out;
	    out = '<table>';
	  	for(i=0;i<result.length;i++){
	  		for(j=0;j<4;j++){
		  		if(j % 4 == 0) {	out += "<tr>"; }
		  		switch(j){
		  			case 0: out += '<td>' + result[i].eid + '</td>'; break;
		  			case 1: out += '<td>' + result[i].name + '</td>'; break;
		  			case 2: out += '<td>' + result[i].school + '</td>'; break;
		  			case 3: out += '<td>' + result[i].depname + '</td>'; break;
		  			default: break;
		  		}
		  		if(j % 4 == 3) {	out += '</tr>'; }	
	  		}
	  	}
	  	out += '</table>';
	  	toClient(response, out);
	});
}

function uacFind(response, query){
	db.query("select eid,name,school,depname from roll,depart where eid like '" + query['eid'] + "%' and roll.depcode = depart.depcode", function (err, result) {
	    var i, out;
	    out = '<table>';
	  	for(i=0;i<result.length;i++){
	  		for(j=0;j<4;j++){
		  		if(j % 4 == 0) {	out += "<tr>"; }
		  		switch(j){
		  			case 0: out += '<td>' + result[i].eid + '</td>'; break;
		  			case 1: out += '<td>' + result[i].name + '</td>'; break;
		  			case 2: out += '<td>' + result[i].school + '</td>'; break;
		  			case 3: out += '<td>' + result[i].depname + '</td>'; break;
		  			default: break;
		  		}
		  		if(j % 4 == 3) {	out += '</tr>'; }	
	  		}
	  	}
	  	out += '</table>';
	  	toClient(response, out);
	});
}

function uacListSchool(response){
	// connect DB
	// Query
	// Generate table html
	// Response
	db.query("select distinct school,schcode from depart", function (err, result) {
	    var i, out;
	    if (err) throw err;
	   	out = "<table>";
	  	for(i=0;i<result.length;i++){
	  		if(i % 4 == 0) {	out += "<tr>"; }
	  		out += '<td><a href = "/listDepart?school=' + result[i].schcode + '">' + result[i].school + '<\a>' + '</td>';
	  		if(i % 4 == 3) {	out += '</tr>'; }
	  	}
	  	out += "</table>";
	  	toClient(response, out);
	});
}

function uacListDepart(response, query){
	db.query("select distinct depname,depcode from depart where schcode='" + query['school'] + "'", function (err, result) {
	    var i, out;
	    out = '<table>';
	  	for(i=0;i<result.length;i++){
	  		if(i % 4 == 0) {	out += "<tr>"; }
	  		out += '<td><a href = "/listRoll?depcode=' + result[i].depcode + '">' + result[i].depname + '<\a>' + '</td>';
	  		if(i % 4 == 3) {	out += '</tr>'; }
	  	}
	  	out += '</table>';
	  	toClient(response, out);
	});
}

function uacListRoll(response, query){
	db.query("select eid,name from roll where depcode='" + query['depcode'] + "'", function (err, result) {
	    var i, out;
	    out = '<table>';
	  	for(i=0;i<result.length;i++){
	  		if(i % 4 == 0) {	out += "<tr>"; }
	  		out += '<td>' + result[i].eid + '  ' + result[i].name + '</td>';
	  		if(i % 4 == 3) {	out += '</tr>'; }
	  	}
	  	out += '</table>';
	  	toClient(response, out);
	});
}

function toClient(response, out){
	var str = fs.readFileSync('index.view', "utf8")
	response.writeHead(200, {
		'Content-Type':'text/html; charset=utf-8;'
	});
	response.end(str.replace('{{variable}}', out))
}