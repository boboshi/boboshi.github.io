// imports
import * as THREE from "../node_modules/three/build/three.module.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {FBXLoader} from "../node_modules/three/examples/jsm/loaders/FBXLoader.js";
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import {ShaderPass} from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import {OutlinePass} from "../node_modules/three/examples/jsm/postprocessing/OutlinePass.js";
import {FXAAShader} from "../node_modules/three/examples/jsm/shaders/FXAAShader.js";
import {GUI} from "../node_modules/three/examples/jsm/libs/dat.gui.module.js"
import {SelectionBox} from "../node_modules/three/examples/jsm/interactive/SelectionBox.js";
import {SelectionHelper} from "../node_modules/three/examples/jsm/interactive/SelectionHelper.js";

// global variable declarations

// width and height of window
var innerWidth, innerHeight;
// server address
var serverAddress;
// three.js basic functionality
let scene, camera, controls, renderer, canvas, offsetx, offsety;
// model loader
let loader;
// outline effect use
let composer, renderPass, outlinePass, effectFXAA;
// basic geometry shapes
let box, sphere, grid, plane;
// raycasting and picking
let mouse, mouseradius, raycaster, ghost, LIGHTINTERSECTED, PLANEINTERSECTED;
var LCTRLdown = false;
var Lmouseup = false;
var Rmouseup = false;
// selection box
var selectedlights = [];
var selectionBox, selectionBoxHelper;
// arrays used for raycasting and picking
var LightArray = [];
var PlaneArray = [];
// floorplan name
var DisplayFloorPlan = "";
// array of lights to be saved/loaded
var LightData = [];
// plane to display floorplan on
var displayPlane;
// bool for add/view mode
var addMode = false;
// text display
var text, error;
// gui for id modification
var textgui, buttongui;
var currname = "";

// class for holding light object properties
class Light
{
	constructor(name, pos)
	{
		this.name = name;
		this.pos = pos;
	}
}

// "enum" for light status
const STATUS = 
{
	OFF : 1,
	ON : 2,
	NORMAL : 3,
}

// colour codes for quick access
const WHITE = 0xFFFFFF;
const RED = 0xFF0000;
const GREEN = 0x00FF00;
const LIGHTBLUE = 0x7EC0EE;
const YELLOW = 0xF8FF33;
const GREY = 0x808080;

// initialise basic functionality
function InitThreeJs()
{
	// define dimensions
	innerWidth = window.innerWidth;
	innerHeight = window.innerHeight;
	// init scene to grey/silver colour
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xC0C0C0);
	// args: fov, aspect ratio, near plane, far plane
	camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
	// initial settings
	camera.position.y = 2;
	camera.position.z = 10;
	// init renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(innerWidth, innerHeight);
	// reposition canvas (if needed)
	canvas = renderer.domElement;
	canvas.style.position = "absolute";
	offsetx = 0;
	offsety = 0;
	canvas.style.left = offsetx + "px";
	canvas.style.top = offsety + "px";
	// event listener to track window resize
	window.addEventListener("resize", onWindowResize, false);
	// add renderer to HTML
	document.body.appendChild(renderer.domElement);
}

// initialise orbitcontrols camera controls
function InitCameraControls()
{
	// camera controls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.mouseButtons ={LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE};
	controls.enableDamping = false;
	//controls.dampingFactor = 0.05;
	controls.rotateSpeed = 0.5;
	controls.screenSpacePanning = false;
	controls.maxPolarAngle = Rad(86);
	// camera initial facing
	controls.target.set(0.0, 0.0, 0.0);
	camera.position.set(0.0, 45.4, 0.0);
	controls.update();
	// limit camera panning
	var minPan = new THREE.Vector3(-40.0, -40.0, -20.0);
	var maxPan = new THREE.Vector3(40.0, 40.0, 20.0);
	var v = new THREE.Vector3();
	// limit camera zoom
	controls.minDistance = 5.0;
	controls.maxDistance = 45.4;
	// event listener to limit camera panning
	controls.addEventListener("change", function()
	{
		v.copy(controls.target);
		controls.target.clamp(minPan, maxPan);
		v.sub(controls.target);
		camera.position.sub(v);
	});

	// event listener to disable right click context menu
	document.addEventListener("contextmenu", onContextMenu, false);

	// event listeners to track mouse clicks (pointerup because of orbicontrols)
	renderer.domElement.addEventListener("pointerup", onDocumentMouseUp, false);
	renderer.domElement.addEventListener("pointerdown", onDocumentMouseDown, false);

	// event listeners to track key presses
	document.addEventListener("keydown", onKeyDown, false);
	document.addEventListener("keyup", onKeyUp, false);
}

// initialise default scene lights
function InitSceneLights()
{
	// ambient light
	//const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
	//scene.add(ambientLight);

	// directional light
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	scene.add(directionalLight);
}

// initialise outline effects
function InitOutline()
{
	// outline effect parameters
	const params = {
		edgeStrength: 5.0,
		edgeGlow: 0.0,
		edgeThickness: 5.0,
		pulsePeriod: 0,
		rotate: false,
		usePatternTexture: false
	};

	function Configuration()
	{
		this.visibleEdgeColor = "#F8FF33";
		this.hiddenEdgeColor = "#F8FF33";
	}
	
	const conf = new Configuration();

	// init postprocessing layers
	composer = new EffectComposer(renderer);
	renderPass = new RenderPass(scene, camera);
	outlinePass = new OutlinePass(new THREE.Vector2(innerWidth, innerHeight), scene, camera);
	effectFXAA = new ShaderPass(FXAAShader);

	// configure edge colours
	outlinePass.visibleEdgeColor.set(conf.visibleEdgeColor);
	outlinePass.hiddenEdgeColor.set(conf.hiddenEdgeColor);
	effectFXAA.uniforms["resolution"].value.set(1/innerWidth, 1/innerHeight);

	// add postprocessing effects
	composer.addPass(renderPass);
	composer.addPass(outlinePass);
	composer.addPass(effectFXAA);
}

// initialise basic geometry shapes for use with meshes
function InitGeometry()
{
	// cube
	box = new THREE.BoxBufferGeometry();

	// sphere
	sphere = new THREE.SphereBufferGeometry();
	sphere.scale(0.35, 0.35, 0.35);

	// grid
	const size = 100;
	const divisions = 100;
	grid = new THREE.GridHelper(size, divisions);

	// plane
	plane = new THREE.PlaneBufferGeometry();
	plane.scale(100, 71, 71);
}

// initialise model loader
function InitFBXLoader()
{
	loader = new FBXLoader();
}

// initialise raycasting and picking
function InitPicking()
{
	mouse = new THREE.Vector2();
	mouseradius = 100;
	raycaster = new THREE.Raycaster();

	// create "ghost" sphere for placing lights
	ghost = new THREE.Mesh(sphere, translucentMat);
	scene.add(ghost);
	ghost.visible = false;

	// selection box
	var styles = `
		.selectBox
		{
			border: 1px solid #55aaff;
			background-color: rgba(75, 160, 255, 0.3);
			position: fixed;
		}
		`;
	var styleSheet = document.createElement("style");
	styleSheet.type = "text/css"
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);

	selectionBox = new SelectionBox(camera, scene);
	selectionBoxHelper = new SelectionHelper(selectionBox, renderer, "selectBox");

	// event listener to track mouse move
	document.addEventListener("pointermove", onDocumentMouseMove, false);
}

// initialise light data text display
function InitTextDisplay()
{
	// light data display setup
	text = document.createElement("div");
	text.style.position = "absolute";
	text.style.width = 100;
	text.style.height = 100;
	text.style.backgroundColor = "black";
	text.style.color = "white";
	text.innerHTML = "";
	text.style.top = offsety + "px";
	text.style.left = offsetx + "px";
	text.style.fontSize = 30 + "px";
	text.style.fontFamily = "Calibri";
	document.body.appendChild(text);

	// error display setup
	error = document.createElement("div");
	error.style.position = "absolute";
	error.style.width = 100;
	error.style.height = 100;
	error.style.backgroundColor = "black";
	error.style.color = "white";
	error.innerHTML = "";
	error.style.bottom = offsety + "px";
	error.style.left = offsetx + "px";
	error.style.fontSize = 30 + "px";
	error.style.fontFamily = "Calibri";
	document.body.appendChild(error);
}

// initialise gui
function InitGUI()
{
	textgui = new GUI();
	buttongui = new GUI();

	// input field gui
	const params = 
	{
		"Change Name": ""
	}
	textgui.add(params, "Change Name").onChange(function(value)
	{
		currname = value;
	});

	textgui.domElement.style.position = "absolute";
	textgui.domElement.style.top = offsety + "px";
	textgui.domElement.style.right = "0px";

	// input closed by default
	textgui.closed = true;

	// button gui
	var offbutton = { OFF:function(){ SetSelectedLightStatus(selectedlights, STATUS.OFF) }};
	var onbutton = { ON:function(){ SetSelectedLightStatus(selectedlights, STATUS.ON) }};
	var normalbutton = { NORMAL:function(){ SetSelectedLightStatus(selectedlights, STATUS.NORMAL) }};

	buttongui.add(offbutton,"OFF");
	buttongui.add(onbutton,"ON");
	buttongui.add(normalbutton,"NORMAL");

	buttongui.domElement.style.position = "absolute";
	buttongui.domElement.style.top = offsety + 45 + "px";
	buttongui.domElement.style.right = "0px";

	// buttons closed by default
	buttongui.closed = true;
}

// event handlers

// mouseup event
function onDocumentMouseUp(event)
{
	event.preventDefault();

	switch(event.which)
	{
		// lmb
		case 1:
			Lmouseup = true;
			controls.enableRotate = true;

			if(LCTRLdown)
			{
				selectionBox.endPoint.set
				(
					 (event.clientX / innerWidth) * 2 - 1,
					-(event.clientY / innerHeight) * 2 + 1,
					 0.5
				)

				if (selectedlights.length > 0)
					buttongui.closed = false;
				else
					buttongui.closed = true;
			}

			break;
		// rmb
		case 3:
			Rmouseup = true;
			break;
		default:
			break;
	}
}

// mousedown event
function onDocumentMouseDown(event)
{
	event.preventDefault();

	switch(event.which)
	{
		// lmb
		case 1:
			if (LCTRLdown)
			{
				selectedlights = [];
				outlinePass.selectedObjects = [];

				selectionBox.startPoint.set
				(
					 (event.clientX / innerWidth) * 2 - 1,
					-(event.clientY / innerHeight) * 2 + 1,
					 0.5
				);
			}

			break;
		// rmb
		case 3:

			break;
		default:
			break;
	}
}

// key events
function onKeyDown(event)
{
	switch(event.code)
	{
		case "ControlLeft":
			LCTRLdown = true;
			controls.enablePan = false;
			controls.enableRotate = false;
			break;
		default:
			break;
	}
}

function onKeyUp(event)
{
	switch(event.code)
	{
		case "Space":
			// toggle add/view mode (with lctrl pressed)
			if (LCTRLdown)
			{
				addMode = !addMode;
				ghost.visible = !ghost.visible;
				textgui.closed = !addMode;
			}
			break;
		case "KeyS":
			// save into json and download
			if (!addMode)
				DownloadData();
			break;
		case "KeyD":
			// load c1basement1
			if (!addMode)
				LoadData("c1basement1");
			break;
		case "KeyF":
			// load c1basement2
			if (!addMode)
				LoadData("c1basement2");
			break;
		case "KeyC":
			if (!addMode)
				ResetCamera();
			break;
		case "ControlLeft":
			LCTRLdown = false;
			controls.enablePan = true;
			controls.enableRotate = true;
			break;
		case "KeyB":
			//if(LightArray.find(light => light.userData.name == "lighttest0"))
			//	MoveToLight("lighttest0");
			break;
		default:
			break;
	}
}

// disable context menu
function onContextMenu(event)
{
	event.preventDefault();
	return false;
}

// mouse position tracking
function onDocumentMouseMove(event)
{
	event.preventDefault();

	mouse.x =  ((event.clientX - offsetx) / innerWidth) * 2 - 1;
	mouse.y = -((event.clientY - offsetx) / innerHeight) * 2 + 1;

	// selection
	if (selectionBoxHelper.isDown && LCTRLdown)
	{
		selectionBox.endPoint.set
		(
			 (event.clientX / innerWidth) * 2 - 1,
			-(event.clientY / innerHeight) * 2 + 1,
			0.5 
		);

		const allSelected = selectionBox.select();
		for (var i = 0; i < allSelected.length; ++i)
		{
			// check if object selected is a light
			if (allSelected[i].userData.name)
			{
				// select object
				if (selectedlights.indexOf(allSelected[i].userData.name) == -1)
				{
					outlinePass.selectedObjects.push(allSelected[i]);
					selectedlights.push(allSelected[i].userData.name);
				}
			}
		}
	}
}

// resize handling
function onWindowResize() 
{
	innerWidth = window.innerWidth;
	innerHeight = window.innerHeight;

	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(innerWidth, innerHeight);
}

// helper functions

// translucent material
const translucentMat = new THREE.MeshPhongMaterial(
	{
		color: WHITE,
		opacity: 0.5,
		transparent: true,
		side: THREE.DoubleSide,
	});

// reset camera
function ResetCamera()
{
	controls.target.set(0.0, 0.0, 0.0);
	camera.position.set(0.0, 45.4, 0.0);
	controls.update();
}

// load model into scene (default material is translucent)
function LoadModel(model, xscale, yscale, zscale, material = translucentMat)
{
	// load and add test model to scene
	loader.load
	(
		serverAddress + "/resources/" + model + ".fbx", function (fbx) 
			{
				fbx.scale.set(xscale, yscale, zscale);
				
				// apply transparent material to model
				fbx.traverse(function(child)
				{
					if (child instanceof THREE.Mesh)
					{
						// use predefined translucent material
						child.material = material;
					}
				});
				
				scene.add(fbx);
			}, 
			undefined, 
			function (error ) 
			{
				console.error(error);
			}
	);
}

// clear error display
function ClearError()
{
	error.innerHTML = "";
}

// userData has 5 properties
// - name (string)
// - selected (bool for internal use)
// - last heard (string)
// - last status (int? enum?)
//	- 1 - off 
//	- 2 - on
//	- 3 - normal
// - pvm level (int)

// helper for adding new light objects to the scene
function AddLight(name, pos)
{
	// check for existing light with same name
	var find = FindLight(name);
	if(find)
	{
		console.log("duplicate name found");
		error.innerHTML = "Error: duplicate light name";
		setTimeout(ClearError, 3000);
		return null;
	}

	// init mesh and data
	const lightmesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ({color:GREY}));
	
	// not sure why position.set doesn't work, this is okay though
	lightmesh.position.x = pos.x;
	lightmesh.position.y = pos.y;
	lightmesh.position.z = pos.z;

	// add lightdata into the three.js mesh
	lightmesh.userData = {name: name, selected: false, lastheard: "test", status: STATUS.OFF, pvm: 0};
	
	// add mesh to array (for raycasting/picking)
	LightArray.push(lightmesh);
	
	// add mesh to scene (for rendering)
	scene.add(lightmesh);
	
	return lightmesh;
}

// helper for finding light in lightarray
function FindLight(name)
{
	return LightArray.find(light => light.userData.name === name);
}

// helper for removing light objects from the scene
function RemoveLight(name)
{
	// find and remove light from LightArray
	var index = LightArray.findIndex(light => light.userData.name === name);
		
	// find and remove object from scene
	LightArray[index].parent.remove(LightArray[index]);
		
	if(index != -1)
		LightArray.splice(index, 1);
}

// helper for setting light status
function SetSelectedLightStatus(selected, status)
{
	for (var i = 0; i < selected.length; ++i)
	{
		var find = FindLight(selected[i]);

		if (find)
		{
			find.userData.status = status;
		}
	}
}

// move camera to selected light
function MoveToLight(name)
{
	var find = FindLight(name);

	if (find)
	{
		find.userData.selected = true;
		controls.target.set(find.position.x, find.position.y, find.position.z);
		camera.position.set(find.position.x, find.position.y + 10, find.position.z);
		outlinePass.selectedObjects = [find];
		controls.update();
	}
}

// light data update
function LightArrayUpdate()
{
	// only display data of selected light on screen
	var foundselected = false;
	// loop through all lights and update data accordingly
	for (var i = 0; i < LightArray.length; ++i)
	{
		var light = LightArray[i];

		// status display (off/on/normal)
		if (light.userData.status == STATUS.OFF)
			light.material.color.setHex(GREY);
		else if (light.userData.status == STATUS.ON)
			light.material.color.setHex(LIGHTBLUE);
		else
			light.material.color.setHex(GREEN);

		// data display
		// check for currently clicked on light
		if (selectedlights.length == 1)
		{
			if (light.userData.name == selectedlights[0])
			{
				foundselected = true;
				outlinePass.selectedObjects = [light];
				DisplayLightData(light.userData.name);
			}
		}
		else
		{
			// selected check
			if (!foundselected && light.userData.selected === true)
			{
				foundselected = true;
				outlinePass.selectedObjects = [light];
				DisplayLightData(light.userData.name);
			}
		}
	}
	
	// if none are selected, turn off data display
	if (!foundselected)
		ClearDisplayLightData();
}

// display data of light given name/ids
function DisplayLightData(name)
{
	find = FindLight(name);
	var laststatus;

	if (find.userData.status == STATUS.OFF)
		laststatus = "OFF";
	else if (find.userData.status == STATUS.ON)
		laststatus = "ON";
	else
		laststatus = "NORMAL";

	// <br/> is a newline, parseFloat sets it to 1 decimal place
	text.innerHTML = "Name: " + find.userData.name + "<br/>" +
					"Last Heard: " + find.userData.lastheard + "<br/>" +
					"Last Status: " + laststatus + "<br/>" +
					"PVM Level: " + find.userData.pvm;
	// top and left specifies the position of the data
	//text.style.top = window.innerHeight - 100 + "px";
	//text.style.left = 500 + "px";
}

// clear display
function ClearDisplayLightData()
{
	text.innerHTML = "";
}

// file saving and loading

// function to save current light data
function SaveLightData()
{
	for (var i = 0; i < LightArray.length; ++i)
	{
		var ld = new Light
		(
			LightArray[i].userData.name,
			new THREE.Vector3(LightArray[i].position.x, LightArray[i].position.y, LightArray[i].position.z)
		)
		
		LightData.push(ld);
	}
}

// fetch helper function
async function FetchData(j = "default")
{
	let url = serverAddress + "resources/" + j + ".json";
	const response = await fetch(url);
	if(response.ok)
	{
		const data = await response.json();

		return data;
	}
}

// load data from json
async function LoadData(j = "default")
{
	//const response = await fetch(url);
	const out = await FetchData(j);

	if(out)
	{
		// get floorplan file name
		DisplayFloorPlan = out.floorplan;
		// clear existing data
		for (var i = 0; i < LightArray.length; ++i)
		{
			// find and remove object from scene
			LightArray[i].parent.remove(LightArray[i]);
		}
		LightArray = [];

		// add lights to scene
		for (var i = 0; i < out.lightdata.length; ++i)
		{
			AddLight(out.lightdata[i].name, out.lightdata[i].pos);
		}

		// add plane
		var texture = new THREE.TextureLoader().load(serverAddress + "resources/" + DisplayFloorPlan);
		var planeMat = new THREE.MeshLambertMaterial({map: texture});
		displayPlane = new THREE.Mesh(plane, planeMat);
		displayPlane.receiveShadow = true;
		displayPlane.rotateX(Rad(-90));
		PlaneArray.push(displayPlane);
		scene.add(displayPlane);
	}
	else
	{
		console.log("failed to load data");
	}
}

// save data to json
function DownloadData()
{
	var saveData = (function () 
	{
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		return function (data, fileName) {
			var json = JSON.stringify(data, null, 2),
				blob = new Blob([json], {type: "octet/stream"}),
				url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = fileName;
			a.click();
			window.URL.revokeObjectURL(url);
		};
	}());
	
	SaveLightData();
	
	var save = 
	{
		floorplan: DisplayFloorPlan,
		lightdata: LightData
	}

	saveData(save, DisplayFloorPlan.replace(/\..+$/, '') + ".json");
}

// convert degrees to radians
function Rad(deg)
{
	return deg * Math.PI / 180;
}

function main()
{
	// specify server address
	serverAddress = "http://10.1.11.197:8080/";

	// scene init
	InitThreeJs();
	InitCameraControls();
	InitSceneLights();
	InitOutline();
	InitGeometry();
	InitFBXLoader();
	InitPicking();
	InitTextDisplay();
	InitGUI();

	// load default data (includes floorplan and light data)
	LoadData();
	
	// testing
	//scene.add(grid);
	
	//const cube = new THREE.Mesh(box, new THREE.MeshBasicMaterial({color:GREEN}));
	//cube.translateX(3);
	//cube.translateY(1);
	//scene.add(cube);

	//LoadModel("cottage", 0.005, 0.005, 0.005);
	
	// call the render loop
	drawScene();
}

// render loop
function drawScene()
{
	requestAnimationFrame(drawScene);
	// stuff to do inside the loop
	// i.e. updating stuff like animation
	
	// update light data
	LightArrayUpdate();

	// keeps focus on input field for light name
	var tmp = document.getElementsByTagName("INPUT");
	if (addMode)
		tmp[0].focus();
	else
		tmp[0].blur();

	// intersection checks for picking
	raycaster.setFromCamera(mouse, camera);
	
	// disable orbitcontrols if viewing
	controls.enabled = !addMode;

	const intersects = raycaster.intersectObjects(LightArray);
	const planeintersects = raycaster.intersectObjects(PlaneArray);
	var tmp2 = false;

	// light
	if(intersects.length > 0)
	{
		if(LIGHTINTERSECTED != intersects[0].object)
		{
			// select the intersected object
			LIGHTINTERSECTED = intersects[0].object;
			// onenter
			// check if light has been clicked on
			if (selectedlights.length > 0)
			{
				// clear display
				for (var i = 0; i < LightArray.length; ++i)
				{
					LightArray[i].userData.selected = false;
				}
			}
		}
		else
		{
			// onstay
			intersects[0].object.userData.selected = true;
			
			if(Lmouseup)
			{	
				// don't have to set lmouseup to false, done at end of loop
				// check if in view mode
				if(!addMode)
				{
					// select this light
					selectedlights = [intersects[0].object.userData.name];
					tmp2 = true;
					buttongui.closed = false;
					// move camera to light
					MoveToLight(LIGHTINTERSECTED.userData.name);
				}
			}
			
			// removing
			if(Rmouseup)
			{
				// check if in add mode
				if(addMode)
				{
					RemoveLight(LIGHTINTERSECTED.userData.name);
				}
			}
		}
	}
	else
	{
		if(LIGHTINTERSECTED)
		{
			// BUG IS SOMEWHERE HERE PLS TAKE NOTE

			// onexit
			// clear display and outline if no light clicked
			if (selectedlights.length < 1)
			{
				ClearDisplayLightData();
				outlinePass.selectedObjects = [];
			}
			
			LIGHTINTERSECTED.userData.selected = false;
		}
		LIGHTINTERSECTED = null;
	}
	
	// plane
	if(addMode)
	{
		if(planeintersects.length > 0)
		{
			if (PLANEINTERSECTED != planeintersects[0].object)
			{
				// select the intersected object
				PLANEINTERSECTED = planeintersects[0].object;
				// onenter
			}
			else
			{
				// onstay
				if(Lmouseup)
				{
					// intersects[0].point returns vector3 of collision point
					if(currname == "")
						AddLight("lighttest", planeintersects[0].point);
					else
						AddLight(currname, planeintersects[0].point);
				}

				// update "ghost" sphere
				if (addMode)
				{
					ghost.position.x = planeintersects[0].point.x;
					ghost.position.y = planeintersects[0].point.y;
					ghost.position.z = planeintersects[0].point.z;
				}
			}
		}
		else
		{
			if(PLANEINTERSECTED)
			{
				// onexit
			}
			PLANEINTERSECTED = null;
		}
	}
	else
	{
		// deselect light if left clicked in view mode
		if (Lmouseup && (selectedlights.length > 0) && !tmp2 && !LCTRLdown)
		{
			buttongui.closed = true;
			selectedlights = [];
			ClearDisplayLightData();
			outlinePass.selectedObjects = [];
		}
	}

	// reset mouse click event bools	
	Lmouseup = false;
	Rmouseup = false;

	// update the global transform of the camera object
	camera.updateMatrixWorld();
	
	// camera controls update
	controls.update();
	
	// render (use composer.render if postprocessing is used)
	composer.render();
	//renderer.render(scene, camera);
}

main();