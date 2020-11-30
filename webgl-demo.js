main();

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