var cvs=document.getElementById('cvs');
var ctx=cvs.getContext('2d');
var gGame=null;
var arr=[200,500,800];
var i=0;
var n=0;
var cvsend=document.getElementById('cvsend');
function gameStart() {
    gGame=new Game();
    gGame.draw();
    gGame.update();
}
function Game() {
    var _this=this;
    this.miner=new Miner();
    this.gold=[];
    this.stone=[];
    this.score=new Score();
    this.counts=new Count();
    this.aimscore=new AimScore();
    this.fire=5;
    this.frame = true;
    this.currentBoom = null;
    this.timeFrame = 0;
    this.lastFrame = 0;
    this.CD = 60;
    this.draw=function () {
        for (var i=0;i<=5;i++){
            _this.gold.push(new Gold());
            _this.gold.forEach(function (item) {
                item.draw();
            });
            _this.stone.push(new Stone());
            _this.stone.forEach(function (item) {
                item.draw();
            })
        }
    };
    this.update=function () {
        ctx.clearRect(0,0,cvs.width,cvs.height);
        _this.counts.draw();
        _this.score.draw();
        _this.aimscore.draw();
        ctx.beginPath();
        var booms=new Image();
        booms.src='img/booms.png';
        ctx.drawImage(booms,950,10,50,50);
        ctx.beginPath();
        ctx.font='bold 40px Arial';
        ctx.strokeStyle='black';
        ctx.strokeText('剩余 '+_this.fire,1000,50);
        if(_this.gold.length>=0){
            _this.gold.forEach(function (item,index) {
                item.draw();
                if(Math.abs(item.x - (_this.miner.x+_this.miner.mw/2)) <= item.r &&
                    Math.abs(item.y - (_this.miner.y+_this.miner.mh+_this.miner.linedown)) <= item.r){
                    _this.miner.ups=true;
                    _this.miner.downs=false;
                    item.x=_this.miner.x+_this.miner.mw/2;
                    item.y=_this.miner.y+_this.miner.mh+_this.miner.linedown+item.r-10;
                    _this.miner.speed=1-item.r/100;
                }
                if(item.y<=_this.miner.y+_this.miner.mh+item.r){
                    _this.gold.splice(index,1);
                    _this.miner.rights=true;
                    _this.miner.lefts=true;
                    _this.miner.linedown=0;
                    _this.score.num+=Math.floor(item.r*1.5);
                }
            })
        }
        if(_this.stone.length>=0){
            _this.stone.forEach(function (item,index) {
                item.draw();
                if(Math.abs(item.x - (_this.miner.x+_this.miner.mw/2)) <= item.r &&
                    Math.abs(item.y - (_this.miner.y+_this.miner.mh+_this.miner.linedown)) <= item.r){
                    _this.miner.ups=true;
                    _this.miner.downs=false;
                    item.x=_this.miner.x+_this.miner.mw/2;
                    item.y=_this.miner.y+_this.miner.mh+_this.miner.linedown+item.r-10;
                    _this.miner.speed=1-item.r/80;
                }
                if(item.y<=_this.miner.y+_this.miner.mh+item.r){
                    _this.stone.splice(index,1);
                    _this.miner.rights=true;
                    _this.miner.lefts=true;
                    _this.miner.linedown=0;
                    _this.score.num+=Math.floor(item.r/5);
                }
            })
        }
        if(_this.miner.y+_this.miner.mh+_this.miner.linedown>=cvs.height){
            _this.miner.ups=true;
            _this.miner.downs=false;
            if(_this.miner.y+_this.miner.mh+_this.miner.linedown<=200){
                _this.miner.downs=true;
                _this.miner.lefts=true;
                _this.miner.rights=true;
                _this.miner.ups=false;
            }
        }
        _this.miner.down();
        _this.miner.up();
        _this.miner.draw();
        if(_this.counts.total<=0){
            gameover();
            if(_this.score.num>=_this.aimscore.sum){
                cvsend.style.backgroundImage='url("img/overbg1.png")';
            }else if(_this.score.num<_this.aimscore.sum){
                cvsend.style.backgroundImage='url("img/overbg2.png")';
            }
        }
        if(!_this.frame) {
            _this.timeFrame++;
            if(_this.timeFrame - _this.lastFrame >= _this.CD) {
                _this.frame = true;
                _this.lastFrame = _this.timeFrame;
            }
            var imgboom=new Image();
            imgboom.src='img/boom.png';
            ctx.drawImage(imgboom,_this.currentBoom.x-_this.currentBoom.r,_this.currentBoom.y-_this.currentBoom.r,_this.currentBoom.r*2,_this.currentBoom.r*2);
        }
        window.requestAnimationFrame(_this.update);

    };
    document.onkeydown=function (e) {
        switch(e.keyCode){
            case 37:{
                if(_this.miner.lefts){
                    if(_this.miner.x>0){
                        _this.miner.x-=_this.miner.step;
                    }else {
                        _this.miner.x=0;
                    }
                }
                break;
            }//left
            case 39:{
                if(_this.miner.rights){
                    if(_this.miner.x<cvs.width-100){
                        _this.miner.x+=_this.miner.step;
                    }else {
                        _this.miner.x=cvs.width-100;
                    }
                }
                break;
            }//right
            case 40:{
                _this.miner.downs=true;
                _this.miner.lefts=false;
                _this.miner.rights=false;
                _this.miner.ups=false;
                break;
            }//down
            case 38:{
                if(_this.fire>0){
                    _this.gold.forEach(function (item,index) {
                        if(Math.abs(item.x - (_this.miner.x+_this.miner.mw/2)) <= item.r &&
                            Math.abs(item.y - (_this.miner.y+_this.miner.mh+_this.miner.linedown)) <= item.r){
                            _this.frame = false;
                            _this.currentBoomIndex = index;//保存当前下标
                            _this.currentBoom = item;//保存当前数组元素
                            _this.gold.splice(index,1);
                            _this.fire--;
                            _this.miner.speed=2;
                        }
                    });
                    _this.stone.forEach(function (item,index) {
                        if(Math.abs(item.x - (_this.miner.x+_this.miner.mw/2)) <= item.r &&
                            Math.abs(item.y - (_this.miner.y+_this.miner.mh+_this.miner.linedown)) <= item.r){
                            _this.frame = false;
                            _this.currentBoomIndex = index;//保存当前下标
                            _this.currentBoom = item;//保存当前数组元素
                            _this.stone.splice(index,1);
                            _this.miner.speed=2;
                            _this.fire--;
                        }
                    })
                }
            }
        }
    };
    setInterval(_this.counts.update,1000);
}
function Gold() {
    var _this=this;
    this.x=Math.random()*1060+70;
    this.y=Math.random()*360+270;
    this.r=Math.random()*40+30;
    this.draw=function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(_this.x,_this.y,_this.r,0,Math.PI/180*360);
        ctx.clip();
        ctx.translate(_this.x-_this.r,_this.y-_this.r);
        var img=new Image();
        img.src='img/gold100.png';
        ctx.drawImage(img,0,0,_this.r*2,_this.r*2);
        ctx.restore();
    }
}
function Stone() {
    var _this=this;
    this.x=Math.random()*1060+70;
    this.y=Math.random()*360+270;
    this.r=Math.random()*40+30;
    this.draw=function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(_this.x,_this.y,_this.r,0,Math.PI/180*360);
        ctx.clip();
        ctx.translate(_this.x-_this.r,_this.y-_this.r);
        var img=new Image();
        img.src='img/rock.png';
        ctx.drawImage(img,0,0,_this.r*2,_this.r*2);
        ctx.restore();
    }
}
function Miner() {
    var _this=this;
    var img=new Image();
    img.src='img/miner.png';
    var imgs=new Image();
    imgs.src='img/hook.png';
    this.x=0;
    this.y=100;
    this.step=10;
    this.mw=100;
    this.mh=90;
    this.linedown=1;
    this.lineup=1;
    this.downs=false;
    this.ups=false;
    this.lefts = true;
    this.rights=true;
    this.speed=2;
    this.draw=function () {
        ctx.beginPath();
        ctx.drawImage(img,_this.x,_this.y,_this.mw,_this.mh);
        ctx.beginPath();
        ctx.strokeStyle='black';
        ctx.moveTo(_this.x+_this.mw/2,_this.y+_this.mh);
        ctx.lineTo(_this.x+_this.mw/2,_this.y+_this.mh+20);
        ctx.stroke();
        ctx.drawImage(imgs,_this.x+_this.mw/2-25,_this.y+_this.mh+_this.linedown+10,_this.mw/2,_this.mh/4);
        ctx.beginPath();
    };
    this.down=function () {
        if(_this.downs){
            _this.speed=2;
            ctx.beginPath();
            ctx.strokeStyle='black';
            ctx.moveTo(_this.x+_this.mw/2,_this.y+_this.mh);
            ctx.lineTo(_this.x+_this.mw/2,_this.y+_this.mh+_this.linedown+15);
            ctx.stroke();
            _this.linedown+=_this.speed;
        }
    };
    this.up=function () {
        if(_this.ups&&_this.linedown>=0){
            _this.downs=false;
            ctx.beginPath();
            ctx.strokeStyle='black';
            ctx.moveTo(_this.x+_this.mw/2,_this.y+_this.mh);
            ctx.lineTo(_this.x+_this.mw/2,_this.y+_this.mh+_this.linedown+10);
            ctx.stroke();
            _this.linedown-=_this.speed;
            if(_this.y+_this.mh+_this.linedown<=200){
                _this.downs=false;
                _this.lefts=true;
                _this.rights=true;
                _this.ups=false;
            }
        }
    }
}
function Score() {
    var _this=this;
    this.x=500;
    this.y=50;
    this.num=n;
    this.draw=function () {
        ctx.font='bold 40px Arial';
        ctx.fillText('得分：'+_this.num,_this.x,_this.y);
    }
}
function AimScore() {
    var _this=this;
    this.x=20;
    this.y=50;
    this.sum=arr[i];
    this.draw=function () {
        ctx.font='bold 40px Arial';
        ctx.fillText('目标得分：'+_this.sum,_this.x,_this.y);
    }
}
function Count() {
    var _this=this;
    this.total=50+i*10;
    this.alltime=_this.total;
    this.x=800;
    this.y=50;
    this.ratio = _this.total / _this.alltime * 2 * Math.PI;
    this.draw=function () {
        ctx.clearRect(0,0,cvs.width,cvs.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(242,242,242,.8)';
        ctx.beginPath();
        ctx.arc(_this.x, _this.y,40,0,Math.PI/180*360);
        ctx.stroke();
        ctx.save();
        ctx.translate(_this.x, _this.y);
        ctx.beginPath();
        ctx.rotate(-90 * Math.PI / 180);
        ctx.strokeStyle = 'rgba(26,188,156,0.8)';
        ctx.arc(0, 0, 40, 0, _this.ratio);
        ctx.stroke();
        ctx.rotate(90 * Math.PI / 180);
        ctx.beginPath();
        ctx.font = 'normal 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = "rgba(58,73,94,0.8)";
        ctx.fillText(''+_this.total, 0, 10);
        ctx.restore();
    };
    this.update=function () {
        if(_this.total>0){
            _this.total--;
            _this.ratio = _this.total / _this.alltime * 2 * Math.PI;
        }
    }
}