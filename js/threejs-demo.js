// init scene, camera and renderer
const scene = new THREE.Scene();
// args: fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.z = 5;

// add renderer to HTML
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

THREE.MapControls = function ( object, domElement ) {

	THREE.OrbitControls.call( this, object, domElement );

	this.mouseButtons.LEFT = THREE.MOUSE.PAN;
	this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

	this.touches.ONE = THREE.TOUCH.PAN;
	this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

};

THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.MapControls.prototype.constructor = THREE.MapControls;

// camera controls
const controls = new THREE.MapControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.maxPolarAngle = Math.PI / 2;

// add basic green cube to scene
const boxgeometry = new THREE.BoxGeometry();
const boxmaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
const cube = new THREE.Mesh(boxgeometry, boxmaterial);
scene.add(cube);
	
// add plane
const planegeometry = new THREE.PlaneGeometry(8, 8, 32, 1);
const planematerial = new THREE.MeshBasicMaterial({color:0xffff00, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planegeometry, planematerial);
plane.rotation.x = 90 * Math.PI / 180;
plane.translateZ(2);
scene.add(plane);
	
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
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	
	// camera controls update
	controls.update();
	
	renderer.render(scene, camera);
}

main();