//////////////////////
// Game State Class //
//////////////////////
// Author: Jarod Kachovich
// Description: Inherited from State, this class
// 		

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


GameState.prototype = {

	init: function(){

		////////////
		// Camera //
		////////////

		// Place the camera default position (0,0,500),
		// pull it back (z = 500) and set the angle towards
		// the scene origin
		camera.position.set(0,200,700);
		camera.lookAt(new THREE.Vector3(0,100,0) );

		/////////////
		// Shaders //
		/////////////

		var shaderlist = LoadMaterialShader("Water");
		this.testMaterial = new THREE.ShaderMaterial( {
		    uniforms: { 
		        columnLimit: { // float initialized to 0
		            type: "f", 
		            value: 7000.0 
		        },
		        rowLimit: { // float initialized to 0
		            type: "f", 
		            value: 7000.0 
		        },
		        magnitude: { // float initialized to 0
		            type: "f", 
		            value: 12.0 
		        },
		        time: { // float initialized to 0
		            type: "f", 
		            value: 0.0 
		        },
		        time2: { // float initialized to 0
		            type: "f", 
		            value: 0.0 
		        },
		        seed: { // float initialized to 0
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
	        new THREE.PlaneGeometry( 7000, 7000 ,200,200), 
	        this.testMaterial 
	    );
		mesh.rotation.x = -1.57;
	    scene.add( mesh );

		this.gui = new dat.gui.GUI({
		    height : 4 * 32 - 1
		});

		this.gui.add(this.testMaterial.uniforms[ 'columnLimit' ], 'value', 0, 10000).name("Column Limit");
		this.gui.add(this.testMaterial.uniforms[ 'rowLimit' ], 'value', 0, 10000).name("Row Limit");
		this.gui.add(this.testMaterial.uniforms[ 'magnitude' ], 'value', -20, 50).name("Magnitude");
		this.gui.add(this.testMaterial.uniforms[ 'seed' ], 'value', 0, 120).name("Seed");

		// var light = new THREE.SpotLight( 0xffffff, 1.5 );
		// 		light.position.set( 0, 500, 2000 );
		// 		light.castShadow = true;

		// 		light.shadowCameraNear = 200;
		// 		light.shadowCameraFar = camera.far;
		// 		light.shadowCameraFov = 50;

		// 		light.shadowBias = -0.00022;
		// 		light.shadowDarkness = 0.5;

		// 		light.shadowMapWidth = 2048;
		// 		light.shadowMapHeight = 2048;
	},

	////////////
	// Update //
	////////////
	// This function gets called every frame.

	Update: function(){
		amount = Date.now() - this.start;
		this.testMaterial.uniforms[ 'time' ].value  = .00025 * ( amount );
		this.testMaterial.uniforms[ 'time2' ].value = .00001 * ( amount );
	}
};