var cvsstart = document.getElementById("cvsstart");
var ctxstart = cvsstart.getContext("2d");
var load=null;
function loading() {
    load=new Loading();
    load.update();
}
function Loading() {
    var _this = this;
    this.x=100;
    this.y=550;
    this.lw=1000;
    this.lh=50;
    this.inx=0;
    this.update=function () {
        if(_this.inx<=1000){
            ctxstart.clearRect(0,0,cvs.width,cvs.height);
            ctxstart.lineWidth = 3;
            ctxstart.strokeStyle='blue';
            ctxstart.strokeRect(_this.x,_this.y,_this.lw+2,_this.lh);
            _this.inx++;
            ctxstart.fillStyle='gold';
            ctxstart.fillRect(_this.x,_this.y+1,_this.inx,_this.lh-2);
            ctxstart.beginPath();
            ctxstart.font = 'normal 20px Arial';
            ctxstart.textAlign = 'center';
            ctxstart.fillStyle = "rgba(58,73,94,0.8)";
            ctxstart.fillText(Math.floor(_this.inx/10)+'%', _this.x+_this.lw/2, _this.y+_this.lh/2+5);
        }
        if (_this.inx>1000){
            starts();
            return;
        }
        window.requestAnimationFrame(_this.update);
    };
}