///////////////////////////
// Splash Screen's Class //
///////////////////////////
// Author: Jarod Kachovich
// Description: Inherited from State, this class
//		is to hold all the information to display
//		the splash screen and allow user
//		interaction to skip it as they please.

function Splash () {
	// Link State's constructor
	State.call(this,"Splash");

	// Public Variables
	this.FadeObject;
	this.SplashDispalyList = [];
	this.CurrentItem = 0;
}

// Inherit from State
Splash.prototype = Object.create(State.prototype);

// Set the "constructor" property to refer to Splash
Splash.prototype.constructor = Splash;

///////////////////////////////
// Splash Screen's Functions //
///////////////////////////////

Splash.prototype = {

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

		// Place the camera default position (0,0,1200),
		// pull it back (z = 1200) and set the angle towards
		// the scene origin
		camera.position.set(0,0,1200);
		camera.lookAt(new THREE.Vector3(0,0,0) );

		////////////////
		// Foreground //
		////////////////

		// Create a black plane to fade the screen 
		this.FadeObject = {
			meshdata: new THREE.Mesh( 
		        new THREE.PlaneGeometry( 500, 500 ), 
		        new THREE.MeshBasicMaterial({ 
		        	color: 0x000000,
		        	transparent: true
		        }) 
	    	),
			fadein: true,
			fadeHold: false,
			fadeSpeed: 0.8,
			fadeCoolDown: 0,
			fadeHoldTime: 4
		};
		// Set the position to right in front of the screen and add it to the scene
		this.FadeObject.meshdata.position.set(0,0,1100);
		scene.add(this.FadeObject.meshdata);

		////////////////
		// Background //
		////////////////

		// Set the Background colour to a dark grey to match splash images
		renderer.setClearColor(0x181a1b, 1);

		// Load the logo for Splash
		var LogoMaterial = new THREE.MeshBasicMaterial({    
		    map: THREE.ImageUtils.loadTexture( 'Graphics/Game/logo.png' ,new THREE.UVMapping(), function() { 
		    	// Start rundering after loading(fixes a bug with it not rendering)
		    	renderer.render(scene, camera);
		    })
		});
		// Add the logo object to a list to control what is displayed
		this.SplashDispalyList.push( new THREE.Mesh(new THREE.PlaneGeometry( 500, 220 ), LogoMaterial ));

	    // Load the Splash screen graphic for the game
		var GameTitleMaterial = new THREE.MeshBasicMaterial({    
		     map: THREE.ImageUtils.loadTexture( 'Graphics/Game/splash.png' )
		});

		// Add this to the list of objects to be controlled
		this.SplashDispalyList.push( new THREE.Mesh( 
	        new THREE.PlaneGeometry( 1920, 1080 ), 
	        GameTitleMaterial 
	    ));
	    // Add the first item of the list
	    scene.add( this.SplashDispalyList[0] );

		////////////
		// Events //
		////////////

	    document.addEventListener('click', this.SkipToNext.bind(this) , true);
	},

	//////////////////////
	// Skip the Current //
	//////////////////////
	// When needing to skip the current splash screen
	// this will be called, logic is handled in FadeSplash

	SkipToNext: function(){
		this.FadeObject.fadeHold = false;
		this.FadeObject.fadein = false;
		this.FadeObject.fadeCoolDown = 0;
	},

	////////////////////////
	// Changes the Images //
	////////////////////////
	// Remove the previous object from the screen and
	// then move to the next item in the list.

	SwapImages: function(){
		// Remove the last image
		scene.remove( this.SplashDispalyList[this.CurrentItem] );
		// Increase the current index to the next one
		this.CurrentItem++;
		// Check if the current index has been through all images
		if(this.CurrentItem != this.SplashDispalyList.length ){
			scene.add( this.SplashDispalyList[this.CurrentItem] );
		}
		console.log("Splash image changed.");
	},

	/////////////////////////////////////
	// Control the Fade between Images //
	/////////////////////////////////////
	// Controlling the fade object to and images to
	// emulate fading in and out of the splash screen.

	FadeSplash: function(){
		// Wait for input or timer
		if(this.CurrentItem != this.SplashDispalyList.length ){
			// Place into a easier to work variable
			var FO = this.FadeObject;
			// If the image is not on hold do some fade work
			if(FO.fadeHold == false){
				var opacity = FO.meshdata.material.opacity;
				if( opacity < 1.0 && !FO.fadein){
					opacity += FO.fadeSpeed * deltaTime;				
				} else if(!FO.fadein){
					FO.fadein = true;
					opacity = 1.0;
					this.SwapImages();
				} else if(opacity > 0.0 && FO.fadein ){
					opacity -= FO.fadeSpeed * deltaTime;
				} else if (FO.fadein) {
					FO.fadein = false;
					FO.fadeHold = true;
					opacity = 0.0;
				}
				// Set the opacity back
				FO.meshdata.material.opacity = opacity;
			}else{
				FO.fadeCoolDown += FO.fadeSpeed * deltaTime;
				if(FO.fadeCoolDown >= FO.fadeHoldTime && !FO.fadein){
					this.SkipToNext();
				}
			}
		}else{
			scene.remove( this.FadeObject.meshdata );
			this.running = false;
			this.nextstate = new MainMenu();
		}
	},

	////////////
	// Update //
	////////////
	// This function gets called every frame.

	Update: function(){
		// Every frame call the fade function
		this.FadeSplash();
	},

	/////////////////////////////////
	// Remove an objects or events //
	/////////////////////////////////
	// This is the place to remove all objects or events
	// that are not needed in the next scene. It will be
	// called right before the new one is created.

	CleanUp: function(){
		document.removeEventListener('click', this.SkipToNext.bind(this) , true);
	}
};
