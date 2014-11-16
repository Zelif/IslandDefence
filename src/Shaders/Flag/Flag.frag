varying vec2 vUv;
uniform sampler2D menuTexture;

void main() {
    gl_FragColor = texture2D(menuTexture, vUv);
}