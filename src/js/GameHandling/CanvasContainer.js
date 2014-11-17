//Canvas container class holds all the basic variables for ThreeJS
function CanvasContainer(){
	//Make Canvas Global and Singleton
	try{
		//Return singleton if error is thrown
		if(CanvasC !== undefined){
			console.error('CanvasContainer already instantiated!');
			return CanvasC;
		} 
	}catch(e){
		CanvasC = this;

		//Init the canvas
		this.init();

		//Tell the console it was created
		console.log('CanvasContainer instantiated');
	}
};

CanvasContainer.prototype.init = function(){
	///////////
	// SCENE //
	///////////
	scene = new THREE.Scene();

	////////////
	// Camera //
	////////////
	
	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = 1920 / 1080, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);	
	
	//////////////
	// Renderer //
	//////////////
	
	// create and start the renderer; choose antialias setting.
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0x181a1b, 1);
	
	// Create the div at runtime, use:
	container = document.createElement( 'div' );
	document.body.appendChild( container );	
	
	// attach renderer to the container div
	container.appendChild( renderer.domElement );
	
	////////////
	// Events //
	////////////

	// automatically resize renderer
	THREEx.WindowResize(renderer, camera);
	// toggle full-screen on given key press
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	
	//////////////
	// Controls //
	//////////////

	// move mouse and: left   click to rotate, 
	//                 middle click to zoom, 
	//                 right  click to pan
	//controls = new THREE.OrbitControls( camera, renderer.domElement );

	////////////
	// Timers //
	////////////
 
	//Create a new clock in global space and delta time
	clock = new THREE.Clock(true);
	deltaTime = clock.getDelta();

	///////////
	// Stats //
	///////////
	
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

};