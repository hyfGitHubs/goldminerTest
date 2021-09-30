var startbt = document.getElementById('startbt');
var game = document.getElementById('game');
var start = document.getElementById('start');
var end = document.getElementById('end');
startbt.onmouseover = function () {
    startbt.style.transform = 'scale(1.15)';
    startbt.style.cursor = 'pointer';
    startbt.onmouseout = function () {
        startbt.style.transform = 'scale(1)'
    };
    startbt.onmousedown = function () {
        loading();
        startbt.style.display='none';
    };
};
function onLoad() {
    start.style.display = 'block';
    game.style.display = 'none';
    end.style.display = 'none';
}
function starts() {
    start.style.display = 'none';
    game.style.display = 'block';
    end.style.display = 'none';
    gameStart();
}
function gameover() {
    start.style.display = 'none';
    game.style.display = 'none';
    end.style.display = 'block';
}
function reload() {
    location.reload();
}