// imports
import React, { Component } from "react";
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
var width, height;
// server address
var serverAddress;
// three.js basic functionality
var scene, camera, controls, renderer, canvas, offsetx, offsety, minPan, maxPan, v;
// model loader and scene loader
let fbxloader, sceneloader;
// outline effect use
let composer, renderPass, outlinePass, effectFXAA;
// basic geometry shapes
let box, sphere, grid, plane;
// raycasting and picking
let mouse, mouseradius, raycaster, ghost, LIGHTINTERSECTED, PLANEINTERSECTED;
var LCTRLdown = false;
var toggle = false;
var Lmouseup = false;
var Rmouseup = false;
// selection box
var selectedlights = [];
var selectedStart = false;
var selectionBox, selectionBoxHelper;
// arrays used for raycasting and picking
var LightArray = [];
var PlaneArray = [];
// filename
var filename = "";
// array of lights to be saved/loaded
var LightData = [];
// plane to display floorplan on
var displayPlane;
// text display
var text, error;
// gui for id modification
var searchgui, textgui, buttongui;
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

var cube;

// three.js scene component
class ThreeJsScene extends Component 
{
    // threejs functions
    InitThreeJs()
    {
        // define dimensions
        width = this.mount.clientWidth;
        height = this.mount.clientHeight;
        console.log(width, height);
        // init scene to grey/silver colour
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xC0C0C0);
        // args: fov, aspect ratio, near plane, far plane
        camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
        // initial settings
        camera.position.y = 2;
        camera.position.z = 10;
        // init renderer
        renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        // event listener to track window resize
        window.addEventListener("resize", function()
        {
            console.log(width, height);

            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        
            console.log(width, height);
        }, false);
        // add renderer to page
        this.mount.appendChild(renderer.domElement);

        // add test cube
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
    }

    InitCameraControls()
    {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.mouseButtons ={LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE};
        controls.enableDamping = false;
        //controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = this.Rad(86);
        // camera initial facing
        controls.target.set(0.0, 0.0, 0.0);
        camera.position.set(0.0, 45.4, 0.0);
        controls.update();
        // limit camera panning
        minPan = new THREE.Vector3(-40.0, -40.0, -20.0);
        maxPan = new THREE.Vector3(40.0, 40.0, 20.0);
        v= new THREE.Vector3();
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
    }

    // helper functions

    // convert degrees to radians
    Rad(deg)
    {
	    return deg * Math.PI / 180;
    }

    // "main"
	componentDidMount() 
	{
        // define server address
        serverAddress = "http://10.1.11.197:8080/";

        // scene init
        this.InitThreeJs();
        this.InitCameraControls();

        // render loop
        var DrawScene = function () 
        {
    	  	requestAnimationFrame( DrawScene );
    	  	cube.rotation.x += 0.01;
    	  	cube.rotation.y += 0.01;
    	  	renderer.render( scene, camera );
    	};
		DrawScene();
    }

    // cleanup
    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onWindowResize);
    }

    // event handlers

    // canvas size
    render() 
    {
	    return (<div 
            style={{ 
                position: "absolute", 
                //width: "70%", height: "70%",
                //left: "200px", top: "100px" 
            }}
	        ref={mount => { this.mount = mount}}
	    />)
	}
}

export default ThreeJsScene;