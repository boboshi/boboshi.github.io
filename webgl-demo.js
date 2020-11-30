main();

function main()
{	
	// <br> for newline when printing to html
	document.write("<br>Hello World!");
	// select canvas and get gl context
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	
	// check if webgl init successfully
	if (!gl)
	{
		alert("webgl gg bro");
		return;
	}
	
	// get vertex positions and matrices
	const shaderProgram = initShaderProgram(gl, vertexSource, fragmentSource);
	const programInfo = {program: shaderProgram,
						 attribLocations: {
							 vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
							 vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
						 },
						 uniformLocations: {
							 projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
							 modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
						 },
						};
	
	const buffers = initBuffers(gl);
	
	drawScene(gl, programInfo, buffers);
}

// load shader
function loadShader(gl, type, source)
{
	const shader = gl.createShader(type);
	
	// take source and compile
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	// check if shader compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert("shader compile gg bro: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	
	return shader;
}

// initialise shader program
function initShaderProgram(gl, vertexSource, fragSource)
{
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragSource);
	
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	// check if program created successfully
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
		alert("shader program gg bro: " + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	
	return shaderProgram;
}

// buffer for vertex positions
function initBuffers(gl)
{
	const positionBuffer = gl.createBuffer();
	const colorBuffer = gl.createBuffer();
	
	// positions for a 2D square
	const positions = 
	[
		-1.0,	1.0,
		 1.0,	1.0,
		-1.0,  -1.0,
		 1.0,  -1.0,
	];
	
	// colours for vertices
	const colors = 
	[
		1.0,  1.0,  1.0,  1.0,    // white
		1.0,  0.0,  0.0,  1.0,    // red
		0.0,  1.0,  0.0,  1.0,    // green
		0.0,  0.0,  1.0,  1.0,    // blue
	];
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	return {position: positionBuffer,
			color: colorBuffer,};
}

function drawScene(gl, programInfo, buffers)
{
	// clear everything (to black)
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL); // near things obscure far things????
	
	// clear canvas before drawing
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// create perspective matrix (for camera)
	const fov = 45 * Math.PI / 180;
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();
	
	mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
	
	// draw at centre of scene
	const modelViewMatrix = mat4.create();
	
	// translate second arg and put into first arg, by the amount in third arg
	mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
	
	// positions
	{
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}
	
	// colors
	{
		const numComponents = 4;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
	}
	
	gl.useProgram(programInfo.program);
	
	// set shader uniforms
	gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
	gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}