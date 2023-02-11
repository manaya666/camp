const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

io.sockets.on('connection', function (socket) {
    let room = '';
    let name = '';

    socket.on('client_to_server_join', function (data) {
        room = data.value;
        socket.join(room);
    });

    socket.on('client_to_server', function (data) {
        io.to(room).emit('server_to_client', { value: data.value });
    });

    socket.on('client_to_server_broadcast', function (data) {
        socket.broadcast.to(room).emit('server_to_client', { value: data.value });
    });

    socket.on('image', function (imageData) {
        socket.broadcast.emit('image', imageData);
    });

    socket.on('client_to_server_personal', function (data) {
        let id = socket.id;
        name = data.value;
        let personalMessage = name + "さんが入室しました。"
        io.to(id).emit('server_to_client', { value: personalMessage });
    });

    socket.on('disconnect', function () {
        if (name == '') {
            console.log("退出しました。");
        } else {
            let endMessage = name + "さんが退出しました。"
            io.to(room).emit('server_to_client', { value: endMessage });
        }
    });
});


// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// サーバーの起動
server.listen(
    PORT,
    () => {
        console.log('Server on port %d', PORT);
    });