//////////////////////
// Game State Class //
//////////////////////
// Author: Jarod Kachovich
// Description: Inherited from State, this class
// 		contains the main elements for the game,
//		This will be all gameplay and win/loss
//		conditions.

function GameState () {
	// Link State's constructor
	State.call(this,"GameState");

	// Public variables
	this.testMaterial;
	this.gui;
	this.start = Date.now();
}

// Inherit from State
GameState.prototype = Object.create(State.prototype);

// Set the "constructor" property to refer to GameState
GameState.prototype.constructor = GameState;

////////////////////////////
// Game State's Functions //
////////////////////////////

GameState.prototype = {

	init: function(){

		////////////
		// Camera //
		////////////

		// Position the camera 
		camera.position.set(0,500,800);
		camera.lookAt(new THREE.Vector3(0,0,0) );

		/////////////
		// Shaders //
		/////////////

		// Shader for the water
		var shaderlist = LoadMaterialShader("Water");
		this.testMaterial = new THREE.ShaderMaterial( {
		    uniforms: { 
		        columnLimit: {
		            type: "f", 
		            value: 8500.0 
		        },
		        rowLimit: {
		            type: "f", 
		            value: 8800.0 
		        },
		        magnitude: {
		            type: "f", 
		            value: 12.0 
		        },
		        time: { 
		            type: "f", 
		            value: 0.0 
		        },
		        time2: {
		            type: "f", 
		            value: 0.0 
		        },
		        seed: { 
		            type: "f", 
		            value: 10.0 
		        }
		    },
		    vertexShader: shaderlist.Vertex.textContent,
		    fragmentShader: shaderlist.Fragment.textContent
		    
		} );

		//////////
		// Mesh //
		//////////

		var mesh = new THREE.Mesh( 
	        new THREE.PlaneGeometry( 12000, 12000 ,200,200), 
	        this.testMaterial 
	    );
		mesh.rotation.x = -1.57;
	    scene.add( mesh );

		this.gui = new dat.gui.GUI({
		    height : 4 * 32 - 1
		});

		this.gui.add(this.testMaterial.uniforms[ 'columnLimit' ], 'value', 0, 20000).name("Column Limit");
		this.gui.add(this.testMaterial.uniforms[ 'rowLimit' ], 'value', 0, 20000).name("Row Limit");
		this.gui.add(this.testMaterial.uniforms[ 'magnitude' ], 'value', -20, 50).name("Magnitude");
		this.gui.add(this.testMaterial.uniforms[ 'seed' ], 'value', 0, 120).name("Seed");

		// var light = new THREE.SpotLight( 0xffffff, 1.5 );
		// 		light.position.set( -10, 1000, 2000 );
		// 		light.castShadow = true;

		// 		light.shadowCameraNear = 200;
		// 		light.shadowCameraFar = camera.far;
		// 		light.shadowCameraFov = 50;

		// 		light.shadowBias = -0.00022;
		// 		light.shadowDarkness = 0.5;

		// 		light.shadowMapWidth = 2048;
		// 		light.shadowMapHeight = 2048;
		// scene.add(light);

		controls = new THREE.OrbitControls( camera, renderer.domElement );

		////////////
		// Models //
		////////////

		this.CreateIsland(new THREE.Vector3(-50, -25, -50));
		this.CreatePlayer(new THREE.Vector3(50, 110, 50));
		this.CreateHouse(new THREE.Vector3(-80, 110, -140));
		this.AddInformationPanel();

		////////////
		// Skybox //
		////////////

		var skyGeometry = new THREE.BoxGeometry( 12000, 12000, 12000 );	
		var directions = ["left","right","top","bottom","back","front"];
		var materialArray = [];
		for (var i = 0; i <6 ; i++){
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( "Graphics/Game/bluesky_" + directions[i] + ".jpg" ),
				side: THREE.BackSide
			}));
		};
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox );

		////////////
		// Lights //
		////////////

		//Add directional light to the scene
		var directionalLight = new THREE.DirectionalLight( 0xffffff );
	    directionalLight.position.set( 1, 1, 0.5 ).normalize();
	   	scene.add( directionalLight );

		//Add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0x111111);
		scene.add(ambientLight);
	},

	////////////
	// Update //
	////////////
	// This function gets called every frame.

	Update: function(){

		this.AnimateWaves();
	},

	////////////////////////
	// Animates the Waves //
	////////////////////////
	// Calculates the time and sends the uniforms
	// the current time values to progress the waves.

	AnimateWaves: function(){
		// Calculate the time from the start
		amount = Date.now() - this.start;
		// Send the uniforms time
		this.testMaterial.uniforms[ 'time' ].value  = .000125 * ( amount );
		this.testMaterial.uniforms[ 'time2' ].value = .000005 * ( amount );
	},

	//////////////////////
	// Construct Player //
	//////////////////////
	// Creates and adds the player to the game
	// TODO: 	* Attack range box
	//			* JSON Model
	//			* Texture
	//			* Move this to its own class

	CreatePlayer: function(posVector){
		// Colour red
		var player = new THREE.BoxGeometry( 20, 50, 20, 1, 1, 1 );
		player.computeBoundingBox ();
		var cube = new THREE.Mesh( 
			player,
			new THREE.MeshLambertMaterial( { color: 0xee1f46 } ) 
		);

		cube.position.set(posVector.x,posVector.y,posVector.z );
		scene.add( cube );	
	},

	//////////////////
	// Create House //
	//////////////////
	// Creates the house on the island to defend
	// TODO: 	* Attack range box
	//			* JSON Model
	//			* Texture

	CreateHouse:function(posVector){
		// Colour f1c910
		var House = new THREE.BoxGeometry( 100, 150, 100, 1, 1, 1 );
		House.computeBoundingBox ();
		var cube = new THREE.Mesh( 
			House,
			new THREE.MeshLambertMaterial( { color: 0xf1c910 } ) 
		);

		cube.position.set(posVector.x,posVector.y,posVector.z );
		scene.add( cube );	
	},

	//////////////////////
	// Construct Island //
	//////////////////////
	// Creates the island and objects on the island
	// TODO: 	* JSON Model
	//			* Texture

	CreateIsland: function(posVector){
		// Colour light green: 90ee90
		var islandGeometry = new THREE.BoxGeometry( 750, 200, 500, 1, 1, 1 );
		islandGeometry.computeBoundingBox ();
		var cube = new THREE.Mesh( 
			islandGeometry,
			new THREE.MeshLambertMaterial( { color: 0x90ee90 } ) 
		);
		// Position the island
		cube.position.set(posVector.x,posVector.y,posVector.z );
		scene.add( cube );		
	},

	//////////////////////////
	// Loads the info panel //
	//////////////////////////
	// Creates the information panel in html and
	// attatches it to the document, position it
	// in the middle.
	// TODO: 	* Information Bars

	AddInformationPanel: function(){
		// Create the base element
		var infoPanel = document.createElement('div');
		// Style the div to what is needed
		infoPanel.style.position = 'absolute';
		infoPanel.style.top = '10px';
		infoPanel.style.left = '10px';
		infoPanel.style.zIndex = 101;
		infoPanel.style.width = "450px";
		infoPanel.style.height = "100px";
		infoPanel.style.backgroundImage = "url('Graphics/Game/infoHeader.png')";
		infoPanel.style.backgroundSize = "cover";
		// Add the information panel to the document
		container.appendChild( infoPanel );
	},

	////////////////////
	// Spawn a Pirate //
	////////////////////
	// Spawns a pirate in the location supplied
	// TODO: 	* Attack range box
	//			* JSON Model
	//			* Texture
	//			* Add pirate to a list
	//			* Move this to its own class

	SpawnPirate: function(posVector){
		var pirate = new THREE.BoxGeometry( 20, 50, 20, 1, 1, 1 );
		player.computeBoundingBox ();
		var cube = new THREE.Mesh( 
			player,
			new THREE.MeshLambertMaterial( { color: 0xee1f46 } ) 
		);

		cube.position.set(posVector.x,posVector.y,posVector.z );
		scene.add( cube );	
	},

	/////////////////////////////////
	// Remove an objects or events //
	/////////////////////////////////
	// This is the place to remove all objects or events
	// that are not needed in the next scene. It will be
	// called right before the new one is created.

	CleanUp: function(){

	}


};