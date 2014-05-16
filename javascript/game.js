(function() {
	var game = function(options){
		this.merge(options);
		self=this;
	};
	
	game.prototype = {
		
		options : {
			cols		: 6,
			rows		: 3,
			elem		: '#game',
			timerElem	: '#timer',
			shareElem	: '#share',
			frontImg	: 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg',
			debug		: false,
			margin		: 6,
		},
		
		data			:'',
		foundPairs 		: 0,
		moves			:[],
		gameBadges 		:[],
		gameStartTime	: false,
		gameTimer		: false,
		canvas			:'',
		clicks			: 0,
		wait			: false,
		gameStartTime   :'',
		gameTimer 		:'',
		
		merge : function(options){
			if(options !== undefined){
				for(var opt in options)
				self.options[opt] = options[opt];
			}
		},
		
		init : function(data,options){
			self.merge(options);
			if(data === undefined){
				alert('LOAD FAIL !!!! a data não esta defenida')
				return;
			}
			self.data = data;
			self.builtStage(data);
		},
		
		restart : function(){
			s = document.querySelector(self.options.shareElem);
			s.classList.add('hide');
			self.gameBadges =[];
			self.foundPairs = 0;
			self.builtStage(self.data);
		},
		
		finish : function(){
			
			clearInterval(self.gameTimer);
			s = document.querySelector(self.options.shareElem);
			s.classList.remove('hide');
			tempoFinal = document.querySelector(self.options.timerElem).innerHTML;
			aElem = document.querySelector('#twitter');
			aElem.setAttribute('href', 'https://twitter.com/intent/tweet/?text=' + escape('Memory JavaScript FTW em: ' + tempoFinal));
		},
		
		start : function(){
			self.gameStartTime = new Date();
			self.gameTimer = setInterval(function(){
		
				var now = new Date();
				var timeDifference = now.getTime() - self.gameStartTime.getTime();
		
				var gameTime = new Date();
				gameTime.setTime(timeDifference);
		
				var m = gameTime.getMinutes(); if(m < 10) m = '0' + m;
				var s = gameTime.getSeconds(); if(s < 10) s = '0' + s;
				
				t = document.querySelector(self.options.timerElem)
				t.innerHTML = m + ':' + s;
		
			}, 1000);
		},
		
		
		gameClick : function(){
			
			if(this.getAttribute('class') && this.getAttribute('class').match(/(matched|flipped)/)) return;
			if(self.wait)return;
		
			self.moves[self.moves.length] = this.getAttribute('data-id');
			this.setAttribute('class', 'card flipped');
			
			if (self.moves.length == 2){
		
				if(self.gameBadges[self.moves[0]].id == self.gameBadges[self.moves[1]].id){
					
					self.canvas.getElementsByTagName("div")[self.moves[0]].setAttribute('class', 'card matched');
					self.canvas.getElementsByTagName("div")[self.moves[1]].setAttribute('class', 'card matched');
					self.moves = [];
					
					self.foundPairs++;
					if(self.foundPairs == self.pairs()){
						self.finish();
					}
				}
			}
			if(self.moves.length == 2){
				self.wait = true;
				setTimeout(function(){
					self.canvas.getElementsByTagName("div")[self.moves[0]].setAttribute('class', 'card');
					self.canvas.getElementsByTagName("div")[self.moves[1]].setAttribute('class', 'card');
					self.moves=[];
					self.wait = false;
				},750);
			}
		},
		
		builtStage : function(badges){
			
			self.canvas = document.querySelector(self.options.elem);
			self.canvas.innerHTML = '';
			self.canvas.setAttribute('style', 'width:' + ((128+self.options.margin) * self.options.cols)+ 'px;height:' + (148 * self.options.rows) + 'px;');
			
			if(self.options.debug){
				self.canvas.className = self.canvas.className + " debug";
			}
			
			self.fisherYates(badges);
			
			if (badges.length > self.pairs()) {
				for (var i=0; i < self.pairs(); i++) {
					self.gameBadges[self.gameBadges.length] = badges[i];
					self.gameBadges[self.gameBadges.length] = badges[i];
				}
				self.fisherYates(self.gameBadges);
			}
			
			for (var i=0; i < self.gameBadges.length; i++) {
				
				div = document.createElement('div');
				
				front = document.createElement('figure');
				front.setAttribute('class','front');
				front.setAttribute('style','background:url('+self.options.frontImg+') no-repeat center center');
				div.appendChild(front);
				
				back = document.createElement('figure');
				back.setAttribute('class','back');
				back.setAttribute('style','background:url('+ self.gameBadges[i].img+') no-repeat center center');
				div.appendChild(back);
				
				div.setAttribute('class','card');
				div.setAttribute('data-id',i);
				div.addEventListener('click', self.gameClick, true);
				
				self.canvas.appendChild(div);
			}
			self.start();
		},
		/*
			Algorithm
			http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
	
			Credits
			http://sedition.com/perl/javascript-fy.html
		*/
		fisherYates : function( myArray ) {
			var i = myArray.length;
			if ( i == 0 ) return false;
			while ( --i ) {
				var j = Math.floor( Math.random() * ( i + 1 ) );
				var tempi = myArray[i];
				var tempj = myArray[j];
				myArray[i] = tempj;
				myArray[j] = tempi;
			}
		},
		
		pairs : function(){
			return (self.options.cols*self.options.rows)/2;
		},
	};
	
	window.Game = game;
})()
