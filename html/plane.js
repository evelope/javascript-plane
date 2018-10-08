window.onload = function () {
	function Game(options) {
		this.status = false;
		this.game = Game.$("game");
		this.myPlane = Game.$("myPlane");
		this.gameStart = Game.$("gameStart");
		this.startGame = this.gameStart.firstElementChild;
		this.gameEnter = Game.$("gameEnter");
		this.bulletsParent = Game.$("bullets");
		this.bullets = [];
		this.bulletW = 6;
		this.bulletH = 14;
		this.enemy = Game.$("enemy");
		this.scores = 0;
		this.scoresContent = Game.$("scoreTotal").firstElementChild.firstElementChild;
		this.enemyObj = {
			enemy1: {
				width: "34px",
				height: "24px",
				score: 100
			},
			enemy2: {
				width: "46px",
				height: "60px",
				score: 500
			},
			enemy3: {
				width: "110px",
				height: "164px",
				score: 1000
			}
		};
		this.init();
	}
	Game.prototype = {
		init: function () {
			this.start();
		},
		start: function () {
			var that = this;
			this.startGame.startRun = this.startGameRun(that);
			this.addEvent(this.startGame, "click", this.startGame.startRun);
		},
		startGameRun: function (that) {
			return function (e) {
				that.status = true;
				that.gameStart.style.display = "none";
				that.gameEnter.style.display = "block";
				that.removeEvent(that.startGame, "click", that.startGame.startRun);
				that.myMove();
				that.shot();
				that.enemyAppear();
			}
		},
		myMove: function (evt) {
			var that = this;
			document.mousemoveRun = this.myMoveRun(that);
			this.addEvent(document, "mousemove", document.mousemoveRun);
		},
		myMoveRun: function (that) {
			return function (evt) {
				// 执行事件
				var e = evt || window.event;
				var mouse_x = e.x || e.pageX
					, mouse_y = e.y || e.pageY;
				var myPlaneW = that.getStyle(that.myPlane, "width")
					, myPlaneH = that.getStyle(that.myPlane, "height");
				var gameW = that.getStyle(that.game, "width")
					, gameH = that.getStyle(that.game, "height");
				var my_x = mouse_x - myPlaneW / 2 - that.getStyle(that.game, "marginLeft");
				var my_y = mouse_y - myPlaneH / 2 - that.getStyle(that.game, "marginTop");
				if (my_x <= 0) {
					my_x = 0;
				} else if (my_x >= gameW - myPlaneW) {
					my_x = gameW - myPlaneW;
				}
				if (my_y <= 0) {
					my_y = 0;
				} else if (my_y >= gameH - myPlaneH) {
					my_y = gameH - myPlaneH;
				}
				that.myPlane.style.left = my_x + "px";
				that.myPlane.style.top = my_y + "px";
				// 删除事件
				// that.removeEvent(document,"mousemove",document.mousemoveRun);
			}
		},
		shot: function () {
			var that = this;
			setInterval(function () {
				that.createBullet(that);
			}, 100);
		},
		createBullet: function () {
			var bullet = new Image();
			bullet.src = "image/bullet1.png";
			bullet.className = "b";
			bullet.style.top = this.myPlane.offsetTop - 14 + "px";
			bullet.style.left = this.myPlane.offsetLeft - 3 + this.myPlane.offsetWidth / 2 + "px";
			this.bulletsParent.appendChild(bullet);
			this.bulletMove(bullet, "top");
			this.bullets.push(bullet);
		},
		bulletMove: function (ele, attr) {
			var that = this;
			var speed = -4;
			ele.timer = setInterval(function () {
				var moveVal = that.getStyle(ele, attr);
				if (moveVal <= -ele.offsetHeight) {
					ele.parentNode.removeChild(ele);
					that.bullets.shift();
				} else {
					ele.style[attr] = moveVal + speed + "px";
				}
			}, 10);
		},
		danger: function (ele, enemyW, enemyH) {
			var that = this;
			for (var i = 0; i < that.bullets.length; i++) {
				var bullet = that.bullets[i];
				var bulletL = bullet.offsetLeft
					, bulletT = bullet.offsetTop;
				// 检测每一颗子弹和每一个运动的敌机是否碰撞
				var enemyL = ele.offsetLeft
					, enemyT = ele.offsetTop;
				if (bulletT <= enemyT + enemyH && bulletL + that.bulletW >= enemyL && bulletL <= enemyL + enemyW && bulletT + that.bulletH >= enemyT) {
					if (ele && bullet.parentNode) {
						that.bullets.splice(i, 1);
						bullet.parentNode.removeChild(bullet);
						ele.hp--;
						if (ele.hp <= 0) {
							ele.src = ele.src.replace(/(\w+\/)([a-zA-Z]+)(\d{1}\.)([a-zA-Z]+)/, function ($1, $2, $3, $4, $5) {
								$3 = "bz";
								$5 = "gif";
								return $2 + $3 + $4 + $5;
							});
							setTimeout(function () {
								if (ele.parentNode) {
									ele.parentNode.removeChild(ele);
									that.scores += ele.s;
									that.scoresContent.innerHTML = that.scores;
								}
							}, 50);
						}
					}
				}
			}
		},
		enemyAppear: function () {
			var that = this;
			var a = setInterval(function () {
				that.createPlane();
			}, 1000);
		},
		createPlane: function () {
			var appearChancing = [1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
			var img = new Image();
			// 敌机
			// 敌机类型 
			var enemyT = appearChancing[Math.floor(Math.random() * appearChancing.length)];
			var enemyName = "enemy" + enemyT;
			img.src = "image/" + enemyName + ".png";
			var pObj = this.enemyObj["enemy" + enemyT];
			img.style.width = pObj.width;
			img.style.height = pObj.height;
			img.style.top = "-" + pObj.height;
			img.style.left = Math.floor(Math.random() * (this.game.offsetWidth - parseInt(pObj.width))) + "px";
			img.hp = Math.pow(enemyT, 3);
			img.s = pObj.score;
			this.enemy.appendChild(img);
			this.enemyPlaneMove(img, "top", enemyT);

		},
		enemyPlaneMove: function (ele, attr, enemyType) {
			var that = this;
			var speed = null;
			if (enemyType == 1) { // 大飞机
				speed = 1.5;
			} else if (enemyType == 2) { // 中飞机
				speed = 1;
			} else {
				speed = 0.5;
			}
			var enemyW = ele.offsetWidth
				, enemyH = ele.offsetHeight;
			ele.timer = setInterval(function () {
				var moveVal = that.getStyle(ele, attr);
				// 敌机的高度
				if (moveVal >= that.game.offsetHeight + ele.offsetHeight) {
					if (ele)
						ele.parentNode.removeChild(ele);
				} else {
					ele.style[attr] = moveVal + speed + "px";
				}
				that.danger(ele, enemyW, enemyH);

			}, 10);
		},
		addEvent: function (ele, clickName, fn) {
			var that = this;
			if (ele.attachEvent) {
				ele.attachEvent("on" + clickName, fn);
			} else if (ele.addEventListener) {
				ele.addEventListener(clickName, fn, false);
			} else {
				ele["on" + clickName] = fn;
			}
		},
		removeEvent: function (ele, clickName, fn) {
			if (ele.detachEvent) {
				ele.detachEvent("on" + clickName, fn);
			} else if (ele.addEventListener) {
				ele.removeEventListener(clickName, fn, false);
			} else {
				ele["on" + clickName] = null;
			}
		},
		getStyle: function (ele, attr) {
			var res = null;
			if (ele.currentStyle) {
				res = ele.currentStyle[attr];
			} else {
				res = window.getComputedStyle(ele, null)[attr];
			}
			return parseFloat(res);
		}
	}
	Game.$ = function (idName) {
		return document.getElementById(idName);
	}
	new Game();
}