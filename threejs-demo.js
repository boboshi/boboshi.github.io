// imports
import * as THREE from "../node_modules/three/build/three.module.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js"
import {FBXLoader} from "../node_modules/three/examples/jsm/loaders/FBXLoader.js"

// init scene, camera and renderer
const scene = new THREE.Scene();
// args: fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

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

// green
const greenMat = new THREE.MeshBasicMaterial ({color:0x00ff00});

// light blue
const lightblueMat = new THREE.MeshBasicMaterial ({color:0x7EC0EE});

// yellow
const yellowMat = new THREE.MeshBasicMaterial ({color:0xF8FF33});

// geometry shapes

// cube (green)
const boxgeometry = new THREE.BoxGeometry();

// sphere (light blue)
const spheregeometry = new THREE.SphereGeometry();

// fbx model loader
const loader = new FBXLoader();

// draw grid
const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// picking

// houselight class
class HouseLight
{
	constructor(id, mesh)
	{
		this.id = id;
		this.collider = collider;
	}
}

function main()
{
	// position cube and add to scene
	const cube = new THREE.Mesh(boxgeometry, greenMat);
	cube.translateX(3);
	cube.translateY(1);
	scene.add(cube);
	
	// position sphere and add to scene
	spheregeometry.scale(0.5, 0.5, 0.5);
	const sphere = new THREE.Mesh(spheregeometry, lightblueMat);
	sphere.translateY(4);
	scene.add(sphere);
	
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

// render loop
function drawScene()
{
	requestAnimationFrame(drawScene);
	
	// stuff to do inside the loop
	// i.e. updating stuff like animation
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	
	// camera controls update
	controls.update();
	
	renderer.render(scene, camera);
}

main();