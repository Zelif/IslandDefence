//vector for the uv map
varying vec2 vUv;
//Texture for the button
uniform sampler2D buttonTexture;
//Variable to indicate if the user is hovering over this object
//0 = no hover
//1 = hovering 
uniform float hovering; 

float getLuma(float texturePosX, float texturePosY){
    // Get the pixel coord of the given position 
    // then divide by the width and height of the
    // image( 476 x 108 )
    // TODO: Make width and height a uniform for custom sizes
    vec2 uv = vec2(vUv.x + texturePosX / 476.0,vUv.y +  texturePosY / 108.0) ;

    // Get the colour that the temp UV is at 
    vec4 pixelColour = texture2D(buttonTexture, uv) ;

    // Return the pixel colour as luma
    return 0.2126 * pixelColour.r + 0.7152 * pixelColour.g + 0.0722 * pixelColour.b;
}

// Simple sobel edge detection
void main(void)
{
    vec4 col = texture2D(buttonTexture,  vUv.xy);
    // Only Apply Edge detection on mouse over
    if(hovering >= 1.0)
    {
        // Horizonal Kernel
        mat3 horizonalKernel = mat3(
            1.0 ,  0.0, -1.0 , 
            2.0 ,  0.0, -2.0 , 
            1.0 ,  0.0, -1.0
        );
        // Loop the matrix and get the sum of all luma 
        // of each surrounding pixels multiplied by kernel
        // x is increased by 2 to avoid the 0 column
        float gx = 0.0;
        for(int y = -1; y < 2; y++){
            for(int x = -1; x < 2; x + 2){
                gx += horizonalKernel[y + 1][x + 1] * getLuma( float(x), float (y) );
            }
        }

        // Vertical Kernel
        mat3 verticalKernel = mat3(
           -1.0 , -2.0 , -1.0, 
            0.0 ,  0.0 ,  0.0, 
            1.0 ,  2.0 ,  1.0
        );
        // Loop the matrix and get the sum of all luma
        // of each surrounding pixels multiplied by kernel
        // y is increased by 2 to avoid the 0 row
        float gy = 0.0;
        for(int y = -1; y < 2; y + 2){
            for(int x = -1; x < 2; x++){
                gy += verticalKernel[y + 1][x + 1] * getLuma( float(x), float (y) );
            }
        }
        
        // Form into a colour 
        // (square root can be done but is costly)
        float g = gx * gx + gy * gy;
        
        // Increase the colour of the selected colour
        col += vec4(0.5 - g, 0.6 - g, 1.0-  g, 0.0);
    }
    // Set the changed colour to the current fragment colour
    gl_FragColor = col;
}