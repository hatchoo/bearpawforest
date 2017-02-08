var express = require('express');
var app = express();
var server = require('http').createServer(app); //require http library, linking server with express (in this case called app)
var io = require('socket.io')(server);
var port = process.env.PORT || 8080; //locally = 8080; if you share its process environment PORT
var allClients="";

server.listen(port, function(){
	console.log('Server listening on ' + port);
});

io.on('connection',function(client){
	console.log('Socket connected...'); //prints the message when connection is on (?)
	client.emit('messages', {alertBox:'hi there'});

	client.on('setClientName', function(data){ //if client is on and hear this msg from the client do this; setclientname is also a funcion
		console.log(data + " has connected");
		client.clientName = data;
		//allClients += data + " ";
	});

	client.on('submission', function(data){ //when people start typing a msg in the start input field 
											//- client.broadcast.emit = client sends msg to server and 
											//server send/broadcast it to the other clients
											//there are two type of info sent: clientname and content (data, what they typed);
		client.broadcast.emit('submission',  {
			clientName: client.clientName,
			content: data});
		console.log("submission: " + data); //sends msg to console log before sending it out
	});

	client.on('getOthersNames', function(){
		client.emit('getOthersNames', {list: allClients});

	});

});

app.get('/', function(req,res){ //when you first connect to the local host, 
								//you should go straight to the directory 
								//we're inside and points client to index.html
	console.log('serving index.html');
	res.sendFile(__dirname + '/index.html');

});