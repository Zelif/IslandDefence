varying vec2 vUv;
varying float height;

void main() {
    gl_FragColor = vec4( vec3( min(height / 10.0, 0.1) , min(height / 100.0, 0.3) , (sin(height / 40.0) + 1.2) / 2.0  ), 1. );
    //max(0.5 , height)
}