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

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.maxPolarAngle = Math.PI / 2;

// add basic green cube to scene
const boxgeometry = new THREE.BoxGeometry();
const boxmaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
const cube = new THREE.Mesh(boxgeometry, boxmaterial);
cube.translateY(1);
scene.add(cube);

// transparent material
const transparentmaterial = new THREE.MeshPhongMaterial(
{
	color: 0xFFFFFF,
	opacity: 0.5,
	transparent: true,
	side: THREE.DoubleSide,
});

// fbx model loader
const loader = new FBXLoader();

loader.load
(
	"http://10.1.11.197:8080/resources/room.fbx", function (fbx) 
		{
			scene.add(fbx);
		}, 
		undefined, 
		function (error ) 
		{
			console.error(error);
		}
);

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

function main()
{
	drawScene();
}

// render loop
function drawScene()
{
	requestAnimationFrame(drawScene);
	
	// stuff to do inside the loop
	// i.e. updating stuff like animation
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	
	// camera controls update
	controls.update();
	
	renderer.render(scene, camera);
}

main();