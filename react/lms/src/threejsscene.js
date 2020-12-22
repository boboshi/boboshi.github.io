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
var scene, camera, controls, renderer, canvas, offsetx, offsety;
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

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height);
		this.mount.appendChild(renderer.domElement);
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		camera.position.z = 5;
    }

    // "main"
	componentDidMount() 
	{
        this.InitThreeJs();
		//var controls = new OrbitControls(camera, renderer.domElement);

    	var animate = function () {
    	  	requestAnimationFrame( animate );
    	  	cube.rotation.x += 0.01;
    	  	cube.rotation.y += 0.01;
    	  	renderer.render( scene, camera );
    	};
		animate();
		
		// end main
  	}
    render() 
    {
	    return (<div 
            style={{ 
                position: "absolute", 
                width: "100%", height: "100%",
                //left: "200px", top: "200px" 
            }}
	        ref={mount => { this.mount = mount}}
	    />)
	}
	  //render() {
	//	return (
	//	  <div ref={ref => (this.mount = ref)} />
	//	)
	  //}
}

export default ThreeJsScene;