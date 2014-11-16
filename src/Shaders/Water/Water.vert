#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying float height;
uniform float seed;
uniform float time;
uniform float time2;
uniform float columnLimit;
uniform float rowLimit;
uniform float magnitude;

void main() {

    vUv = uv;

    height = ( 
      cos((position.x / rowLimit+ time / 8.0 )  * M_PI * seed) +
      cos((position.y / columnLimit + time / 2.0  ) * M_PI * seed) +
      sin((position.x / rowLimit + time2) * M_PI * 4.0 * seed ) +
      cos((position.y / columnLimit + time2) * M_PI * 4.0 * seed)) * magnitude;
    
    vec3 newPosition = position + height;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}