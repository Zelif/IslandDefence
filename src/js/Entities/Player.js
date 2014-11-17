//////////////////
// Player Class //
//////////////////
// Author: Jarod Kachovich
// Description: Player class that will store the
// 		player model, collision and object data. 
// 		This will also handle the players' 
//	 	movement and camera movement.

function Player (posVector) {
	var player = new THREE.BoxGeometry( 20, 50, 20, 1, 1, 1 );
	player.computeBoundingBox ();
	var cube = new THREE.Mesh( 
		player,
		new THREE.MeshLambertMaterial( { color: 0xee1f46 } ) 
	);

	cube.position.set(posVector.x,posVector.y,posVector.z );
	// Public variables

}

///////////////////////
// Players Functions //
///////////////////////

Player.prototype = {

	Init: function(posVector){
		
		scene.add( cube );	
	},

}