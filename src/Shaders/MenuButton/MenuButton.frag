//vector for the uv map
varying vec2 vUv;
//Texture for the button
uniform sampler2D buttonTexture;
//Variable to indicate if the user is hovering over this object
//0 = no hover
//1 = hovering 
uniform float hovering; 
uniform float outlineWidth;
uniform float time;


 vec2 size = vec2(outlineWidth,outlineWidth);



float GetLuma(float dx, float dy)
{

	//temp uv co-ords
    vec2 uv = vec2(vUv.x + dx, vUv.y + dy) / size.xy;

    //Get the colour that the temp UV is at 
    vec4 c = texture2D(buttonTexture, vUv.xy - uv);

	// return as luma
    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
}

void main(void)
{   
	// simple sobel edge detection
	// mat3 gxMat = mat3(
	//    -1.0, -2.0, -1.0, 
	//     0.0,  0.0,  0.0, 
	//     1.0,  2.0,  1.0, 
	// );

	// mat3 gyMat = mat3(
	//     1.0,  0.0, -1.0, 
	//     2.0,  0.0, -2.0, 
	//     1.0,  0.0, -1.0,
	// );

    vec4 col = texture2D(buttonTexture,  vUv.xy );

    if(hovering >= 1.0)
    {
        float gx = 0.0;
        //first column
        gx += -1.0 * GetLuma(-1.0, -1.0);
        gx += -2.0 * GetLuma(-1.0,  0.0);
        gx += -1.0 * GetLuma(-1.0,  1.0);
        //second column
        gx +=  1.0 * GetLuma( 1.0, -1.0);
        gx +=  2.0 * GetLuma( 1.0,  0.0);
        gx +=  1.0 * GetLuma( 1.0,  1.0);
        
        float gy = 0.0;
        //first column
        gy += -1.0 * GetLuma(-1.0, -1.0);
        gy += -2.0 * GetLuma( 0.0, -1.0);
        gy += -1.0 * GetLuma( 1.0, -1.0);
        //second column
        gy +=  1.0 * GetLuma(-1.0,  1.0);
        gy +=  2.0 * GetLuma( 0.0,  1.0);
        gy +=  1.0 * GetLuma( 1.0,  1.0);
        
        //Colour one
        float g = gx * gx + gy * gy;
        
        //Increase the colour of the selected colour
        col += vec4(0.5 - g, 0.6 - g, 1.0-  g, 0.0);
    }
    //Set the changed colour to the current fragment colour
    gl_FragColor = col;
}