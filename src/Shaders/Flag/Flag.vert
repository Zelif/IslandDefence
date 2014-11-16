#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;
uniform float time;
uniform sampler2D menuTexture;

void main(void)
{
	vUv = uv;
	vec3 newPosition = position;

	float height = ( 
		cos((position.x / 100.0 + time * 16.0 ) * M_PI ) + 
		cos((position.y / 100.0 + time * 16.0 ) * M_PI ) ) *
		(1.0 - ( position.y / 365.0) * 1.0);

	newPosition = position + height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
