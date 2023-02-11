let socket = io.connect();
let isEnter = false;
let name = '';

socket.on("server_to_client", function (data) { appendMsg(data.value) });
function appendMsg(text) {
    $("#chatLogs").append("<div>" + text + "</div>");
}

//参加
$(".form").submit(function (e) {
    let message = $("#form__msgForm").val();
    let selectRoom = $("#form__rooms").val();
    $("#form__msgForm").val('');
    if (isEnter) {
        message = "[" + name + "]: " + message;
        socket.emit("client_to_server", { value: message });
    } else {
        name = message;
        let entryMessage = name + "さんが入室しました。";
        socket.emit("client_to_server_join", { value: selectRoom });
        socket.emit("client_to_server_broadcast", { value: entryMessage });
        socket.emit("client_to_server_personal", { value: name });
        changeLabel();
    }
    e.preventDefault();
});

function changeLabel() {
    $(".form__nameLabel").text("メッセージ：");
    $("#form__rooms").prop("disabled", true);
    $(".btn-primary").text("送信");
    isEnter = true;
}

//画像送信
socket.on('image', function (imageData) {
    if (imageData) {
        let img = new Image();
        img.src = imageData;
        img.onload = function (newsize) {
            let targetImg = document.getElementById("chatLogs");
            let orgWidth = targetImg.width;
            let orgHeight = targetImg.height;
            targetImg.width = newsize;
            targetImg.height = orgHeight * (targetImg.width / orgWidth);
            img.className = 'og';
            targetImg.appendChild(img);
        }
    }
});