//States base class
function State(name){
	//Private variables
	this.running = true;
	this.loading = true;
	this.nextState;
	//Public Variables
	this.name = name;
	
	//Tell the console it was created
	console.log('State '+ this.name + ' instantiated');
};

//Function prototypes for states
State.prototype = {
	//Blank property overwrite in inherited class
	init: undefined,

	//Blank property overwrite in inherited class
	Update: undefined,
};