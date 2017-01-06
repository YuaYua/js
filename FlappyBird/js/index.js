//封装函数获得className
function getEleByClass(classStr) {
	return document.querySelector("." + classStr)
}
//++++++++++++++++++++全局对象++++++++++++++++++
//全局盒子：100% width，100% height
var flappyBird = getEleByClass('flappyBird');
//开始页面
var start = document.querySelector('.start');
//提示页面
var prompt = document.querySelector('.prompt');
//结束页面
var gameOver = document.querySelector('.gameOver');
//全局小鸟
var bird = document.querySelector('.bird');
//全局管道
var pipe = document.querySelector('.pipe');
//全局分数
var score = document.querySelector('.score');
//地板
var floor=document.querySelector('.floor');

var endMedal=document.querySelector('#end_medal');

var endScore=document.querySelector("#end_score");

var bestScore=document.querySelector('#best_score');

var scoreMusic=document.getElementById('score_music');
//++++++++++++++++++++全局变量++++++++++++++++++
var isReady = false;
var isOver = false;
var upTimer = null;
var downTimer = null;
var maxSpeed = 6;
var speed = maxSpeed;
//生成管道计时器
var pipeTimer = null;
//var liTimer=null;
//检查碰撞定时器
var checkTimer = null;
//得分
var scoreNum=0;

//起跳
function birdUp() {
	bird.style.webkitTransform = 'rotate(-25deg)';
	upTimer = setInterval(function() {
		speed -= 0.4;
		if(speed <= 0) {
			speed = 0;
			clearInterval(upTimer);
			//开始下降
			birdDown();
		}
		//		bird.style.top=bird.offsetTop-speed+'px';

		if(bird.offsetTop > -30) {
			bird.style.top = bird.offsetTop - speed + 'px';
		}
	}, 30);
}
//下落
function birdDown() {
	downTimer = setInterval(function() {
		if(!isOver){
			speed += 0.4;
			var degree = speed * 8 - 20;
			if(degree <= 90) {
				bird.style.webkitTransform = 'rotate(' + degree + 'deg)';
			} else {
				bird.style.webkitTransform = 'rotate(90deg)';
			}
			bird.style.top = bird.offsetTop + speed + 'px';
		}
	}, 30)
}

//3小鸟跳跃
function birdJump() {
	if(isReady && !isOver) {

		prompt.style.display = 'none';
		bird.className = 'bird';
		clearInterval(upTimer);
		clearInterval(downTimer);
		//每次起跳都获得最大速度
		speed = maxSpeed;
		//起跳
		birdUp();
	}

}
//随机函数
function randomNum(min, max) {
	return parseInt(Math.random() * (max - min + 1)) + min;
}
//生成管道
function createPipe() {
	pipe.style.display = 'block';
	pipeTimer = setInterval(function() {
		//创建管道
		var li = document.createElement('li');
		var upDiv = document.createElement('div');
		var downDiv = document.createElement('div');
		upDiv.className = 'pp_up';
		downDiv.className = 'pp_down';
		//一个管道最多增加一分
		var scoreLock=false;
		
		//随机设置管道窟窿位置
		var num = randomNum(40, 200);
		upDiv.style.top = -num + 'px';
		downDiv.style.bottom = num - 240 + 'px';

		//设置上下管道
		li.appendChild(upDiv);
		li.appendChild(downDiv);
		//		添加管道到页面
		pipe.appendChild(li);
		//安全锁:因为定时器检查多次，删除后定时器没结束
		//		var liExist=true;

		//管道运动
		var deviceWidth = flappyBird.offsetWidth;
		li.style.left = deviceWidth + 'px'
		var liTimer = setInterval(function() {
			if(!isOver) {
				deviceWidth -= 2;
				li.style.left = deviceWidth + 'px';
				if(deviceWidth <= -li.offsetWidth) {
					pipe.removeChild(li);
					clearInterval(liTimer);
				}
				if(deviceWidth<(bird.offsetLeft-li.offsetWidth)&&!scoreLock){
					scoreNum++;
					score.children[0].innerText=scoreNum;
					scoreMusic.play();
					scoreLock=true;
				}
			}

		}, 16);
	}, 2000);
}

//检测碰撞
function checkCrash() {
	checkTimer = setInterval(function() {
		//检测和管道是否碰撞
		for(var i = 0; i < pipe.children.length; i++) {
//			console.log(i);
//			console.log(pipe.children.length);
			isCrash(pipe.children[i].children[0]);
			isCrash(pipe.children[i].children[1]);
			//			console.log(pipe.children[i].children[1]);
		}
		//检测和地板相撞
		if(bird.offsetTop + bird.offsetWidth >= 520) {
			//			console.log('撞了地')
			//游戏结束
			gg();
		}
	}, 10)
}

//检测和管道是否碰撞
function isCrash(obj) {
	var objT = obj.offsetTop;
	var objB = obj.offsetTop + obj.offsetHeight;
	var objL = obj.parentElement.offsetLeft;
	var objR = obj.parentElement.offsetLeft + obj.offsetWidth;

	var birdT = bird.offsetTop;
	var birdB = bird.offsetTop + bird.offsetHeight;
	var birdL = bird.offsetLeft;
	var birdR = bird.offsetLeft + bird.offsetWidth;
	if(!(birdT > objB || birdB < objT || birdL > objR || birdR < objL)) {
		//		console.log('撞了管');
		//Gameover
		gg()
	}
}
//游戏结束
function gg() {
	//清除所有定时器
	console.log(upTimer, downTimer, pipeTimer, checkTimer);
	clearInterval(downTimer);
	clearInterval(pipeTimer);
	clearInterval(checkTimer);
	isOver = true;
	//地板停
	floor.children[0].style.webkitAnimationPlayState='paused';
	//翅膀停
	bird.children[0].style.webkitAnimationPlayState='paused';
	//鸟落地
//	bird.style.transform='rotate(90deg)';
	bird.style.top=520-bird.offsetWidth+'px';
//	var fallTimer=setTimeout(function(){
//		
//	},10)
	//	var timer = setTimeout(function() {}, 30);
	//	for(var i = 0; i < timer; i++) {
	//		clearInterval(i);
	//	}
	//结束界面
	gameOver.style.display='block';
	gameOver.children[2].onclick=function(){
		location.reload();
		gameOver.children[2].onclick=null;
	}
	//设置奖牌
	if(scoreNum<3){
		endMedal.style.backgroundImage="url(img/medal/bronze.png)";
	}else if(scoreNum<5){
		endMedal.style.backgroundImage="url(img/medal/silver.png)";
	}else if(scoreNum<7){
		endMedal.style.backgroundImage="url(img/medal/glod.png)";
	}else{
		endMedal.style.backgroundImage="url(img/medal/platinum.png)";
	}
	
	//设置分数
	endScore.innerText=scoreNum;
}

//2预备工作
function promptJob() {
	//短期存活，为了激活一次
	document.onclick = function() {
			//游戏开始，小鸟蹦一下
			birdJump();
			//让该绑定
			document.onclick = null;

			document.addEventListener("click", birdJump);
			createPipe();
			//③检查碰撞
			checkCrash();

		}
		//①点击任何部位小鸟跳跃
		//	document.addEventListener("click",birdJump);
		//②产生管道
		//	prompt.onclick=function(){
		//		createPipe();
		//	}

}
//1.进入游戏
function gameStart(e) {
	var ev = e || event;
	ev.cancelBubble = true;
	start.style.display = 'none';
	prompt.style.display = 'block';
	bird.style.display = 'block';
	score.style.display='block';
	isReady = true;
	//2.预备工作
	promptJob();
}

function initGame() {
	//1.进入游戏
	//	console.log(222)
	start.children[2].addEventListener("click", gameStart);
	//2.预备工作
	//	promptJob();
}
initGame();