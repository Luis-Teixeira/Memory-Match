//aux
var d;
//GAME ELEMENTS
var startBtn = document.getElementById("start-btn");
var clock = document.getElementById("timer");
var restart = document.getElementById("restart");

var game = new Game();
function loadGame(){
	
	startBtn.innerHTML = "A carregar";

	lib.utils.getJSON({"url": "https://services.sapo.pt/Codebits/listbadges", "type": "jsonp"}, function(data){ 
		builtGame(data);
	});
}

function builtGame(data){
	//console.log(data);
	d = JSON.parse(data);
	startBtn.innerHTML = "Load Finished";
	
	game.init(d,{
		debug:false
	});
	
	restart.classList.remove('hide');
	startBtn.className = startBtn.className + " hide";
}

function novoJogo(){
	game.restart();
}