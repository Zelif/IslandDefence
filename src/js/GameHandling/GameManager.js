//Game manager class
function GameManager(){
	// Make Gamemanger global and Singleton
	try{
		// Return singleton if error is thrown
		if(Gmanager !== undefined){
			console.error('GameManager already instantiated!');
			return Gmanager;
		}
	}catch(e){
		// Two ways of accessing the same thing
		Gmanager = this;
		GameManager.Instance = this;

		// Private variables
		this.gameRunning = false;
		this.currentstate;

		// Public variables
		this.init();

		// Tell the console it was created
		console.log('GameManager instantiated');
	}
};

//Functions for the GameManager
GameManager.prototype = {
	// Init function for GameManager
	init: function(){
		this.currentstate = new Splash();
		this.currentstate.init();
		
	},

	//Update function for GameManager and current state
	Update: function(){
		if(this.currentstate.running){
			this.currentstate.Update();
		}else{
			this.currentstate.CleanUp();
			this.currentstate = this.currentstate.nextState;
			this.currentstate.init();
			console.log('Changed State.');
		}
	},

	SetState: function(state){
		this.currentstate = state;
	},

	//Check to see when the game is done
	isDone: function(){
		return !this.gameRunning;
	},

	//Quit the game if running
	Quit: function(){
		this.gameRunning = false
		console.log('Quitting....');
	}
};