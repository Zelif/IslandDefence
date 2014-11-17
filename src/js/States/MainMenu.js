///////////////////////
// Main Menu's Class //
///////////////////////
// Author: Jarod Kachovich
// Description: Main menu class for setting up the
// 		menu's scene and any interaction the user
//		has with this scene.

function MainMenu () {
	// Link State's constructor
	State.call(this,"MainMenu");

	// An array to hold the buttons
	this.ButtonList = [];
	this.waveTimer = 0;

	// Check for the options menu
	this.optionsEnabled = false;

	// Sorage for the raycaster
	this.raycaster = new THREE.Raycaster();
}

// Inherit from State
MainMenu.prototype = Object.create(State.prototype);

// Set the "constructor" property to refer to MainMenu
MainMenu.prototype.constructor = MainMenu;

///////////////////////////
// Main Menu's Functions //
///////////////////////////

MainMenu.prototype = {

	///////////////////////////
	// Initialise this scene //
	///////////////////////////
	// Any setup for this scene should be done in
	// this function as it is called just before
	// running.

	init: function(){

		////////////
		// Camera //
		////////////
		
		// Set the camera's position to control any changed camera
		camera.position.set(0,0,1300);
		// Make sure the camera is looking at 0,0,0
		camera.lookAt(new THREE.Vector3(0,0,0) );
		

		////////////////
		// Foreground //
		////////////////

		// Create the back plane to use for fade effect
		this.FadeObject = {
			meshdata: new THREE.Mesh( 
		        new THREE.PlaneGeometry( 500, 500 ), 
		        new THREE.MeshBasicMaterial({ 
		        	color: 0x000000,
		        	transparent: true
		        }) 
	    	),
			fadeSpeed: 0.8
		};

		// Position close to the camera at (0,0,1100)
		this.FadeObject.meshdata.position.set(0,0,1100);
		scene.add(this.FadeObject.meshdata);

		////////////////
		// Background //
		////////////////

		// Set the canvas background to this red/grey to match the images
		renderer.setClearColor(0x210202, 1);

		// Load the Background menu graphic
		this.Background = new THREE.Mesh( 
	        new THREE.PlaneGeometry( 1920, 1080 ), 
	        new THREE.MeshBasicMaterial({    
			    map: THREE.ImageUtils.loadTexture( 'Graphics/Game/MainMenu.png' )
			}) 
		);

		scene.add(this.Background);

		/////////////
		// Shaders //
		/////////////

		// Create an array to hold the loaded shaders(temp)
		var shaderlist = [];
		// Add the Flag shader to the list ready for use
		shaderlist.push(LoadMaterialShader("Flag"));
		// Construct the material for the flag
		this.flagMaterial = new THREE.ShaderMaterial( {
		    uniforms: { 
		        menuTexture: {
					type: "t", 
		        	value: THREE.ImageUtils.loadTexture( "Graphics/Game/Menu.png"  ) 
		        },
		        time: { 
		            type: "f", 
		            value: 0.0 
		        }
		    },
		    vertexShader: shaderlist[0].Vertex.textContent,
		    fragmentShader: shaderlist[0].Fragment.textContent
		    
		});

		// Store the created flag ready to be used elsewhere
		// and add to the scene. 100 x 100 subdivisions was
		// used to make it more wavey.
		this.flag = new THREE.Mesh( 
	        new THREE.PlaneGeometry( 500, 754 , 100 , 100), 
	       this.flagMaterial
		);
		this.flag.position.set(0,-47,100);
		scene.add(this.flag);

		/////////////
		// Buttons //
		/////////////

		// Add the MenuButton shader to the shader list 
		shaderlist.push(LoadMaterialShader("MenuButton"));
		// Create all 4 buttons for the menu
		this.AddButton("NewGame",shaderlist[1]);
		this.AddButton("Stats",shaderlist[1]);
		this.AddButton("Options",shaderlist[1]);
		this.AddButton("Exit",shaderlist[1]);

		////////////
		// Events //
		////////////

		// Register events for mouse actions
		document.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
		document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

	},

	////////////
	// Update //
	////////////
	// This function gets called every frame.

	Update: function(){
		// Fade into this scene
		var FO = this.FadeObject;
		if(FO.meshdata.material.opacity > 0){
			FO.meshdata.material.opacity -= FO.fadeSpeed * deltaTime;
		};
		// Update the flags' waving timer
		this.waveTimer += 0.001;
		this.flagMaterial.uniforms['time'].value = this.waveTimer;
		// Update the buttons' waving timer
		for (var i = this.ButtonList.length - 1; i >= 0; i--) {
			this.ButtonList[i].Mesh.material.uniforms['time'].value = this.waveTimer;
		};
	},

	////////////////
	// Add Button //
	////////////////
	// To add a button you must supply the correct name of the image
	// and a link to the holding class returned by the ShaderLoader.

	AddButton: function(nameOfImage,shader){
		// Get the current position of the button and position it
		var currentPos = this.ButtonList.length;
		var buttonSpacer = 30;
		var startPosition = 180 - ((108 + buttonSpacer) * currentPos);

		// Build the material with the supplied shader and image
		var buttonMaterial = new THREE.ShaderMaterial( {
		    uniforms: { 
		        buttonTexture: {
					type: "t", 
		        	value: THREE.ImageUtils.loadTexture( "Graphics/Game/" + nameOfImage + ".png"  ) 
		        },
		        time: { 
		            type: "f", 
		            value: 0.0 
		        },
		        startPos: {
		        	type: "f",
		        	value: startPosition 
		        },
		        hovering: {
		        	type: "f",
		        	value: 0.0 
		        }
		    },
		    transparent: true,
		    vertexShader: shader.Vertex.textContent,
		    fragmentShader: shader.Fragment.textContent
		});

		// Holding class for the buttons; a mesh and a collision box
		// (Collision box is quicker since it has less checks).
		var buttonHolder = {
			Mesh: new THREE.Mesh( new THREE.PlaneGeometry( 470, 102 , 10 , 10), buttonMaterial),
			Collision:  new THREE.Mesh( new THREE.PlaneGeometry( 470, 102 ) )
		};

		// Add the mesh and collision class to the button list
		this.ButtonList.push(buttonHolder);

		// Set the position and tags for the meshes
		this.ButtonList[currentPos].Mesh.position.set(0,startPosition,106);
		this.ButtonList[currentPos].Collision.position.set(0,startPosition,112);
		this.ButtonList[currentPos].Collision.userData = {buttonID: currentPos, buttonName: nameOfImage};
		this.ButtonList[currentPos].Collision.visible = false;

		// Add both meshes to the scene
		scene.add(this.ButtonList[currentPos].Mesh);
		scene.add(this.ButtonList[currentPos].Collision);
	},

	////////////////////
	// On Click Event //
	////////////////////
	// Hook into the mouse down event and check the buttons
	// when they are pressed, only check the collision boxes.

	onMouseDown: function ( event ) {
		if(this.running == true){
			this.CameraToMouse();
			// Check all buttons
			for (var i = this.ButtonList.length - 1; i >= 0; i--) {
				// Check if the button is active
				if(this.ButtonList[i].Mesh.visible == true){
					// Get the object that was hit
					var intersectedObject = this.raycaster.intersectObject( this.ButtonList[i].Collision );

					// If there was 1 or more objects change the hovering state
					if ( intersectedObject.length > 0 ) {
						this.HandleButtonClick(this.ButtonList[i].Collision);
					};
				};
			};
		};
	},

	///////////////////
	// On Move Event //
	///////////////////
	// Hook into the mouse move event and check the when mouse
	// is hovering over the buttons, change the uniform to 
	// give user feedback of their actions.

	onMouseMove: function( event ){
		// Shoot a ray from the camera to the mouse locaiton
		this.CameraToMouse();
		// Clear all hovered buttons before moving on
		this.ClearButtonHighlight();

		// Check all buttons
		for (var i = this.ButtonList.length - 1; i >= 0; i--) {
			// Check if the button is active
			if(this.ButtonList[i].Mesh.visible == true){
				// Get the object that was hit
				var intersectedObject = this.raycaster.intersectObject( this.ButtonList[i].Collision );

				// If there was 1 or more objects change the hovering state
				if ( intersectedObject.length > 0 ) {
					// Change the hovering uniform to 1 which indicates a hovering state
					this.ButtonList[i].Mesh.material.uniforms[ 'hovering' ].value = 1.0;
				};
			};
		};
	},

	/////////////////////
	// OnClick Buttons //
	/////////////////////
	// Handle how the given button reacts after getting
	// clicked, this comes from onMouseDown a button is
	// passed in to be handled. 
	// Will change the state if needed.

	HandleButtonClick: function(button){
		switch(button.userData['buttonName']){
			case "NewGame":
				this.nextState = new GameState();
				this.running = false;
				break;
			case "Stats":
				// this.nextState = new GameState();
				// this.running = false;
				console.log("No current state created.");
				break;
			case "Options":
				// this.nextState = new GameState();
				// this.running = false;
				console.log("No current state created.");
				break;
			case "Exit":
				// this.nextState = new GameState();
				// this.running = false;
				console.log("No current state created.");
				break;
		}
	},


	////////////////////////
	// Clear Hover States //
	////////////////////////
	// Loop through all the buttons and clear all their hover
	// states so that no hover state stays on screen too long.

	ClearButtonHighlight: function(){
		for (var i = this.ButtonList.length - 1; i >= 0; i--) {
			// Change the hovering uniform to 0 which indicates no hovering state
			this.ButtonList[i].Mesh.material.uniforms['hovering'].value = 0.0;
		};
	},

	//////////////////////////////
	// Ray from Camera to Mouse //
	//////////////////////////////
	// Update the raycaster attatched to this class to the
	// position from the camera to where the mouse is
	// located. 
	// Use intersectObject on the raycaster to find any 
	// objects that this ray hit.

	CameraToMouse:function(){
		event.preventDefault();

		// Get the vector from the camera to the mouse
		var vector = new THREE.Vector3();
		vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		// Undo projection between the points
		vector.unproject( camera );

		// Cast the ray from the camrea in the direction of the vector calculated
		this.raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
	},

	/////////////////////////////////
	// Remove an objects or events //
	/////////////////////////////////
	// This is the place to remove all objects or events
	// that are not needed in the next scene. It will be
	// called right before the new one is created.

	CleanUp: function(){
		scene.remove( this.FadeObject.meshdata );
		scene.remove( this.flag );
		scene.remove( this.Background );
		
		for (var i = this.ButtonList.length - 1; i >= 0; i--) {
			// Remove both meshes to the scene
			scene.remove(this.ButtonList[i].Mesh);
			scene.remove(this.ButtonList[i].Collision);
		};

		document.removeEventListener( 'mousedown', this.onMouseDown, false );
		document.removeEventListener( 'mousemove', this.onMouseMove, false );
	}
};