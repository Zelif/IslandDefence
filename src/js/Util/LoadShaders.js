// Make sure that the shaders are in
// a folder that has the same name as
// the shader(capitalisation matters)
// The way these are loaded is 
// blocking.


//Send a request to get the shader
function LoadShader(name,type){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","Shaders/" + name + "/" + name + "." + type , false);
	xmlhttp.send();
	return xmlhttp.responseText;
}

//Create a HTML Scrip and place the code inside
function ConstructShader(name,type){
	//Create script element
	var script = document.createElement('script');
	//Set the type
	script.type = "x-Shader/" + type;
	//Grab the text from the returned http request
	script.text = LoadShader(name,type);
	return script;
}

//Load the 2 shaders into a class
function LoadMaterialShader(name){
	//Create holding clss
	var shader = {
		Name: name,
		Vertex: ConstructShader(name,"vert"),
		Fragment: ConstructShader(name,"frag")
	};
	//Return the class with both shaders
	return shader;
}