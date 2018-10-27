var http = require('http');
var fs = require('fs');
var ent = require('ent');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

//Connexion d'un client
io.sockets.on('connection', function (socket, pseudo) {
    //** A modifier avec le middleware session.socket.io **/
    //Reception du pseudo
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        //Recupération du pseudo pour informer les autres clients
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    //Reception de "message" et "pseudo" de client sur le server
    socket.on('message', function (message) {
        message = ent.encode(message);
        //Envoi variable message et pseudo contenan les informations clients
        socket.broadcast.emit('message',{pseudo: socket.pseudo, message: message});
       //console.log('pseudo: ' + socket.pseudo + ' - message: ' + message);
    });
    socket.on('disconnect', function(){
        test = socket.pseudo;
        socket.broadcast.emit('user_dec',test);
    });

});

server.listen(8080);