//https://www.kabanoki.net/948/
let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    moveflg = 0,
    Xpoint,
    Ypoint;

//初期値（サイズ、色、アルファ値）の決定
let defSize = 7,
    defColor = "#555";

// キャンバスを白色に塗る
ctx.fillStyle = 'rgb(255,255,255)';

// ストレージの初期化
let myStorage = localStorage;
window.onload = initLocalStorage();

// PC対応
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);
// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);

function startPoint(e) {
    e.preventDefault();
    ctx.beginPath();

    Xpoint = e.layerX;
    Ypoint = e.layerY;

    ctx.moveTo(Xpoint, Ypoint);
}

function movePoint(e) {
    if (e.buttons === 1 || e.witch === 1 || e.type == 'touchmove') {
        Xpoint = e.layerX;
        Ypoint = e.layerY;
        moveflg = 1;

        ctx.lineTo(Xpoint, Ypoint);
        ctx.lineCap = "round";
        ctx.lineWidth = defSize * 2;
        ctx.strokeStyle = defColor;
        ctx.stroke();
    }
}

function endPoint(e) {
    if (moveflg === 0) {
        ctx.lineTo(Xpoint - 1, Ypoint - 1);
        ctx.lineCap = "round";
        ctx.lineWidth = defSize * 1;
        ctx.strokeStyle = defColor;
        ctx.stroke();

    }
    moveflg = 0;
    setLocalStoreage();
}

function clearCanvas() {
    initLocalStorage();
    temp = [];
    resetCanvas();
}

function resetCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    ctx.fillStyle = 'rgb(255,255,255)';
}

function chgImg() {
    let png = canvas.toDataURL();
    document.getElementById("newImg").src = png;
}

function initLocalStorage() {
    myStorage.setItem("__log", JSON.stringify([]));
}
function setLocalStoreage() {
    let png = canvas.toDataURL();
    let logs = JSON.parse(myStorage.getItem("__log"));

    setTimeout(function () {
        logs.unshift({ png: png });
        myStorage.setItem("__log", JSON.stringify(logs));
        temp = [];
    }, 0);
}

function prevCanvas() {
    let logs = JSON.parse(myStorage.getItem("__log"));

    if (logs.length > 0) {
        temp.unshift(logs.shift());

        setTimeout(function () {
            myStorage.setItem("__log", JSON.stringify(logs));
            resetCanvas();
            draw(logs[0]['png']);
        }, 0);
    }
}

function nextCanvas() {
    let logs = JSON.parse(myStorage.getItem("__log"));

    if (temp.length > 0) {
        logs.unshift(temp.shift());

        setTimeout(function () {
            myStorage.setItem("__log", JSON.stringify(logs));
            resetCanvas();
            draw(logs[0]['png']);
        }, 0);
    }
}

// let colorBack = document.getElementById('colorBack');
// colorBack.value = "#00F000";
// colorBack.addEventListener('change', function () {
//     canvas.style.background = this.value;
// });

// let colorFore = document.getElementById('colorFore');
// colorFore.value = "#000000";
// colorFore.addEventListener('change', function () {
//     canvas.style.color = this.value;
// });

function draw(src) {
    let img = new Image();
    img.src = src;

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    }
}

function sendImage(event) {
    let file = event.target.files[0];

    let reader = new FileReader();

    reader.onload = function (event) {
        socket.emit('image', event.target.result);
    };
    // Data URLで画像を読み込む
    reader.readAsDataURL(file);
}

//audio
const bgm1 = document.querySelector("#bgm1");
const btn = document.querySelector("#btn-play");

btn.addEventListener("click", () => {
    if (!bgm1.paused) {
        btn.innerHTML = '<img src="./img/play.png">';
        bgm1.pause();
    }
    else {
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        bgm1.play();
    }
});

bgm1.addEventListener("ended", () => {
    bgm1.currentTime = 0;
    btn.innerHTML = '<i class="fas fa-play"></i>';
});


//fileを変更したら
$('.img__file').on('change', function () {
    var file = $(this).prop('files')[0];
    $('.img__select').text(file.name);
});

//ファイルを読み込むボタンのリスナー登録
let file = document.getElementById('file');
file.addEventListener('change', sendImage, false);

const nbtn = document.querySelector('.btn');
const form = document.querySelector('.form__control');
const fg = document.querySelector('.form__group');
const chatlog = document.querySelector('.chat');
nbtn.addEventListener('click', function () {
    fg.style.display = 'none';
    chatlog.style.height = '83vh';
    const num = form.selectedIndex;
    const str = form.options[num].textContent;
    document.getElementById('rn').textContent = str;
},
    { once: true }
);

let w = $('.cg').width();
let h = $('.cg').height();
$('#canvas').attr('width', w);
$('#canvas').attr('height', 265);