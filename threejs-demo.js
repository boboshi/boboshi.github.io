// imports
import * as THREE from "../node_modules/three/build/three.module.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {FBXLoader} from "../node_modules/three/examples/jsm/loaders/FBXLoader.js";
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "../node_modules/three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "../node_modules/three/examples/jsm/shaders/FXAAShader.js";

// define width and height (window.innerWidth/Height for default)
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

// init scene, camera and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC0C0C0);
// args: fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );

renderer.setSize(innerWidth, innerHeight);

// add renderer to HTML
document.body.appendChild(renderer.domElement);

// camera

// initial settings
camera.position.y = 2;
camera.position.z = 10;
// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons ={LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE};
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// colour codes for quick access
const WHITE = 0xFFFFFF;
const GREEN = 0x00FF00;
const LIGHTBLUE = 0x7EC0EE;
const YELLOW = 0xF8FF33;

// materials

// translucent material
const translucentMat = new THREE.MeshPhongMaterial(
{
	color: WHITE,
	opacity: 0.5,
	transparent: true,
	side: THREE.DoubleSide,
});

// geometry shapes

// cube (green)
const boxgeometry = new THREE.BoxBufferGeometry();

// sphere (light blue)
const spheregeometry = new THREE.SphereBufferGeometry();
spheregeometry.scale(0.35, 0.35, 0.35);

// grid
const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);

// plane
const planegeometry = new THREE.PlaneBufferGeometry();

// fbx model loader
const loader = new FBXLoader();

// lights

// ambient light
//const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
//scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// picking
const mouse = new THREE.Vector2();
const radius = 100;
let LIGHTINTERSECTED;
let PLANEINTERSECTED;

const raycaster = new THREE.Raycaster();

// mouse position tracking
document.addEventListener("mousemove", onDocumentMouseMove, false);
function onDocumentMouseMove(event)
{
	event.preventDefault();
	mouse.x =  (event.clientX / innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / innerHeight) * 2 + 1;
}

// resize handling
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() 
{
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(innerWidth, innerHeight);
}

// outline effect
const params = {
	edgeStrength: 3.0,
	edgeGlow: 0.0,
	edgeThickness: 3.0,
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
let composer = new EffectComposer(renderer);
let renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
let outlinePass = new OutlinePass(new THREE.Vector2(innerWidth, innerHeight), scene, camera);
outlinePass.visibleEdgeColor.set(conf.visibleEdgeColor);
outlinePass.hiddenEdgeColor.set(conf.hiddenEdgeColor);
composer.addPass(outlinePass);
let effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(1/innerWidth, 1/innerHeight);
composer.addPass(effectFXAA);

// array for raycasting/picking
const LightArray = [];
const PlaneArray = [];

// helper functions

// userData currently has 2 properties
// - name
// - selected (bool)
// - testproperty
// further properties can be added to and accessed from userData

// helper for adding new light objects to the scene
function AddLight(name, testproperty, pos)
{
	// init mesh and data
	const lightmesh = new THREE.Mesh(spheregeometry, new THREE.MeshBasicMaterial ({color:LIGHTBLUE}));
	
	// not sure why position.set doesn't work, this is okay though
	lightmesh.position.x = pos.x;
	lightmesh.position.y = pos.y;
	lightmesh.position.z = pos.z;
	
	// add lightdata into the three.js mesh
	lightmesh.userData = {name: name, selected: false, testproperty: testproperty};
	
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

// move camera to selected light
function MoveToLight(name)
{
	find = FindLight(name);

	if (find)
	{
		find.userData.selected = true;
		controls.target.set(find.position.x, find.position.y, find.position.z);
		camera.position.set(find.position.x, find.position.y + 5, find.position.z);
		outlinePass.selectedObjects = [find];
		controls.update();
	}
}

// light data update
function LightArrayUpdate()
{
	// randomly modify userData properties of first two lights for testing
	if(Math.floor(Math.random() * 2) == 0)
	{
		if(LightArray[0])
			LightArray[0].userData.testproperty += 0.005;
		if(LightArray[1])
			LightArray[1].userData.testproperty += 0.005;
	}
	else
	{
		if(LightArray[0])
			LightArray[0].userData.testproperty -= 0.005;
		if(LightArray[1])
			LightArray[1].userData.testproperty -= 0.005;
	}
	
	// only display data of first selected light on screen
	var foundselected = false;
	// loop through all lights and update accordingly
	for (var i = 0; i < LightArray.length; ++i)
	{
		// selected check
		if(!foundselected && LightArray[i].userData.selected === true)
		{
			foundselected = true;
			DisplayLightData(LightArray[i].userData.name);
			outlinePass.selectedObjects = [LightArray[i]];
		}
	}
	
	// if none are selected, turn off display
	if (!foundselected)
		ClearDisplayLightData();
}

// display data of light given name/ids
function DisplayLightData(name)
{
	find = FindLight(name);
	
	// parseFloat sets it to 1 decimal place
	text.innerHTML = "Name: " + find.userData.name + "<br/>" +
					"TestProperty: " + parseFloat(find.userData.testproperty).toFixed(1);
	//text.style.top = window.innerHeight - 100 + "px";
	//text.style.left = 500 + "px";
}

// clear display
function ClearDisplayLightData()
{
	text.innerHTML = "";
}

// convert degrees to radians
function Rad(deg)
{
	return deg * Math.PI / 180;
}

// key events
var Lmouseup = false;
var Rmouseup = false;

// mouseup event (use pointer because of orbitcontrols)
document.addEventListener("pointerup", onDocumentMouseUp, false);
function onDocumentMouseUp(event)
{
	event.preventDefault();
	
	switch(event.which)
	{
		// lmb
		case 1:
			Lmouseup = true;
			break;
		// rmb
		case 3:
			Rmouseup = true
			break;
	}
}

// key events
document.addEventListener("keyup", onKeyUp, false);
function onKeyUp(event)
{
	// spacebar
	if(event.code == "Space")
	{
		addMode = !addMode;
	}
	
	// b
	if(event.code == "KeyB")
	{
		MoveToLight("lighttest0");
	}
}

// disable right click context menu (for view mode especially)
document.addEventListener("contextmenu", onContextMenu, false);
function onContextMenu(event)
{
	event.preventDefault();
	return false;
}

// bool for add/view mode
var addMode = false;
// int for keeping track of lights added
var lightsAdded = 0;

// light data display setup
var text = document.createElement("div");
text.style.position = "absolute";
text.style.width = 100;
text.style.height = 100;
text.style.backgroundColor = "black";
text.style.color = "white";
text.innerHTML = "";
text.style.top = 0 + "px";
text.style.left = 0 + "px";
text.style.fontSize = 30 + "px";
text.style.fontFamily = "Calibri";
document.body.appendChild(text);

function main()
{
	// add plane for testing
	planegeometry.scale(75, 75, 75);
	// load test image as material
	var texture = new THREE.TextureLoader().load("http://10.1.11.197:8080/resources/c1basement1.jpg");
	var planeMat = new THREE.MeshLambertMaterial({map: texture});
	const plane = new THREE.Mesh(planegeometry, planeMat);
	plane.receiveShadow = true;
	plane.rotateX(Rad(-90));
	// translate by z instead of y to move up because it is rotated
	plane.translateZ(10);
	PlaneArray.push(plane);
	scene.add(plane);
	
	// add grid
	scene.add(gridHelper);
	
	// add light (NOT three.js lights) objects (AddLight will add to scene on its own)
	//var light0 = AddLight("light0", 26.7, new THREE.Vector3(-3.5, 4, 0));
	//var light1 = AddLight("light1", 26.7, new THREE.Vector3(3.5, 4, 0));
	
	// position cube and add to scene
	const cube = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial({color:GREEN}));
	cube.translateX(3);
	cube.translateY(1);
	scene.add(cube);
	
	// load and add test model to scene
	loader.load
	(
		"http://10.1.11.197:8080/resources/cottage.fbx", function (fbx) 
			{
				fbx.scale.set(0.005, 0.005, 0.005);
				
				// apply transparent material to model
				fbx.traverse(function(child)
				{
					if (child instanceof THREE.Mesh)
					{
						child.material = translucentMat;
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
	
	// intersection checks for picking
	raycaster.setFromCamera(mouse, camera);
	
	// disable orbitcontrols if viewing
	controls.enabled = !addMode;
	
	const intersects = raycaster.intersectObjects(LightArray);
	const planeintersects = raycaster.intersectObjects(PlaneArray);
	
	// light
	if(intersects.length > 0)
	{
		if(LIGHTINTERSECTED != intersects[0].object)
		{
			// select the intersected object
			LIGHTINTERSECTED = intersects[0].object;
			// onenter
			
			// clear display first
			for (var i = 0; i < LightArray.length; ++i)
			{
				LightArray[i].userData.selected = false;
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
					console.log("clicked on light in view mode");
					MoveToLight(LIGHTINTERSECTED.userData.name);
				}
			}
			
			// removing
			if(Rmouseup)
			{
				// check if in add mode
				if(addMode)
				{
					console.log("remove light");
					RemoveLight(LIGHTINTERSECTED.userData.name);
				}
			}
		}
	}
	else
	{
		if(LIGHTINTERSECTED)
		{
			// onexit
			// clear display and outline
			ClearDisplayLightData();
			outlinePass.selectedObjects = [];
			
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
					AddLight("lighttest" + lightsAdded.toString(), 0.0, planeintersects[0].point);
					lightsAdded += 1;
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

	// reset mouse event bools
	Lmouseup = false;
	Rmouseup = false;
	
	// update the global transform of the camera object
	camera.updateMatrixWorld();
	
	// camera controls update
	controls.update();
	
	// render (use composer.render if postprocessing is used
	composer.render();
	//renderer.render(scene, camera);
}

main();