#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;
uniform float time;
uniform float startPos;
uniform sampler2D buttonTexture;

void main(void)
{
	vUv = uv;
	vec3 newPosition = position;

	float height = ( 
		cos(((position.x - 10.0) / 100.0 + time * 16.0 ) * M_PI ) + 
		cos(((position.y + startPos) / 100.0 + time * 16.0 ) * M_PI ) ) *
		(1.0 - ( (position.y + startPos) / 365.0) * 1.0);

	newPosition = position + height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
