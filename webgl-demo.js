main();

// placeholder shader code
// vertex
const vertexSource = `
	attribute vec4 aVertexPosition;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	
	void main()
	{
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertextPosition;
	}
	`;

// fragment
const fragmentSource = `
	void main()
	{
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	`;

function main()
{
	document.write("Hello World!");
	
	// select canvas and get gl context
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	
	// check if webgl init successfully
	if (gl === null)
	{
		alert("webgl gg bro");
		return;
	}
	
	// set global clear colour to black
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// clearrrrr
	gl.clear(gl.COLOR_BUFFER_BIT);
}

// initialise shader program
function initShaderProgram(gl, vertexSource, fragSource)
{
	
}
