// imports
import * as THREE from "../node_modules/three/build/three.module.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js"
import {FBXLoader} from "../node_modules/three/examples/jsm/loaders/FBXLoader.js"

// init scene, camera and renderer
const scene = new THREE.Scene();
// args: fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.y = 2;
camera.position.z = 10;

// add renderer to HTML
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons ={LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE};

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.maxPolarAngle = Math.PI / 2;

// materials

// translucent material
const translucentMat = new THREE.MeshPhongMaterial(
{
	color: 0xFFFFFF,
	opacity: 0.5,
	transparent: true,
	side: THREE.DoubleSide,
});

// colour codes for quick access
const GREEN = 0x00FF00;
const LIGHTBLUE = 0x7EC0EE;
const YELLOW = 0xF8FF33;

// geometry shapes

// cube (green)
const boxgeometry = new THREE.BoxBufferGeometry();

// sphere (light blue)
const spheregeometry = new THREE.SphereBufferGeometry();
spheregeometry.scale(0.5, 0.5, 0.5);

// fbx model loader
const loader = new FBXLoader();

// draw grid
const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// ambient light
//const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
//scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// picking
const mouse = new THREE.Vector2();
const radius = 100;
let INTERSECTED;

const raycaster = new THREE.Raycaster();
document.addEventListener("mousemove", onDocumentMouseMove, false);

function onDocumentMouseMove(event)
{
	event.preventDefault();
	mouse.x =  (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// resize handling
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

const LightArray = [];

// userData currently has 2 properties
// - name
// - testproperty
// further properties can be added to and accessed from userData

function AddLight(name, testproperty, pos)
{
	// init mesh and data
	const lightmesh = new THREE.Mesh(spheregeometry, new THREE.MeshBasicMaterial ({color:LIGHTBLUE}));
	
	// not sure why position.set doesn't work, this is okay though
	lightmesh.position.x = pos.x;
	lightmesh.position.y = pos.y;
	lightmesh.position.z = pos.z;
	
	// add lightdata into the three.js mesh
	lightmesh.userData = {name: name, testproperty: testproperty};
	
	// add mesh to array (for raycasting/picking)
	LightArray.push(lightmesh);
	
	// add mesh to scene (for rendering)
	scene.add(lightmesh);
	
	return lightmesh;
}

function main()
{
	// add light objects (AddLight will add to scene on its own)
	var light0 = AddLight("light0", 26.7, new THREE.Vector3(-3.5, 4, 0));
	var light1 = AddLight("light1", 26.5, new THREE.Vector3(3.5, 4, 0));
	
	// position cube and add to scene
	const cube = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial({color:GREEN}));
	cube.translateX(3);
	cube.translateY(1);
	scene.add(cube);
	
	// add test model to scene
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
	
	drawScene();
}

// light data display
var text2 = document.createElement("div");
text2.style.position = "absolute";
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "black";
text2.style.color = "white";
text2.innerHTML = "";
text2.style.top = 0 + "px";
text2.style.left = 0 + "px";
text2.style.fontSize = 30 + "px";
text2.style.fontFamily = "Calibri";
document.body.appendChild(text2);

// render loop
function drawScene()
{
	requestAnimationFrame(drawScene);
	
	// stuff to do inside the loop
	// i.e. updating stuff like animation
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	
	camera.updateMatrixWorld();
	
	// intersection checks for picking
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(LightArray);
	
	if(intersects.length > 0)
	{
		if(INTERSECTED != intersects[0].object)
		{
			if(INTERSECTED)
			{
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			}
			
			// select the intersected object
			INTERSECTED = intersects[0].object;
			// onenter
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.color.setHex(0xF8FF33);
		}
		else
		{
			// onstay
			text2.innerHTML = "Name: " + intersects[0].object.userData.name + "<br/>" +
							  "TestProperty: " + intersects[0].object.userData.testproperty;
			//text2.style.top = window.innerHeight - 100 + "px";
			//text2.style.left = 500 + "px";
		}
	}
	else
	{
		if(INTERSECTED)
		{
			// onexit
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			text2.innerHTML = "";
		}
		INTERSECTED = null;
	}
	
	// camera controls update
	controls.update();
	
	renderer.render(scene, camera);
}

main();