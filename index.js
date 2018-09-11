var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var userList = ["aaa"];
io.on("connection", function(socket){
    socket.on("disconnect", function() {
        console.log(socket.id + " Da ngat ket noi");
    });
    socket.on("clien_send_login", function(info) {
        //console.log(info);
        //io.sockets.emit (send all user)
        //io.to(socketID).emit (Send data to custom socket)
        //socket.emit (send for socket.id)
        //socket.broadcast.emit (send all user not socket.id)
        console.log(userList.indexOf(info.username));
        if(userList.indexOf(info.username) >= 0) {
            var result = {code: 1001, message: "Username đã tồn tại", Data: ''};
        } else {
            userList.push(info.username);
            var result = {code: 0, message: "Dang nhap thanh cong", data: info.username};
            socket.username = info.username;
            io.sockets.emit("update_list_user", userList);
        }
        socket.emit("result_login", result);
    });
    socket.on("clien_send_message", function(messages){
        var dataMessage = {username: socket.username, message: messages};
        socket.broadcast.emit("update_message_all", dataMessage);
        socket.emit("update_message_user", dataMessage);
    });
});


app.get("/", function(req, res){
    res.render("home");
});