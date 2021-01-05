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
var width, height, widthscale, heightscale;
// server address
var serverAddress;
// three.js basic functionality
var scene, camera, controls, renderer, minPan, maxPan, v;
// model loader and scene loader
let fbxloader, sceneloader;
// outline effect use
let composer, renderPass, outlinePass, effectFXAA;
// basic geometry shapes
// let box, grid, plane;
let sphere;
// raycasting and picking
let mouse, raycaster, ghost, LIGHTINTERSECTED, PLANEINTERSECTED;
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
// grouping

// filename
var filename = "";
// text display
var text, error, fwprog;
// gui for id modification
var searchgui, textgui, lightgui, groupidgui, currsearch, currgroupid, currzoneid;
var currname = "";
var ledstatus, resetkey, configrequest, firmwareupdate, currbrightness, changebrightness;

// "enum" for light status
const STATUS = 
{
	ON : 1,
	OFF : 2
}

// colour codes for quick access
const WHITE = 0xFFFFFF;
//const RED = 0xFF0000;
const GREEN = 0x00FF00;
const LIGHTBLUE = 0x7EC0EE;
//const YELLOW = 0xF8FF33;
const GREY = 0x808080;

// translucent material
const translucentMat = new THREE.MeshPhongMaterial(
	{
		color: WHITE,
		opacity: 0.5,
		transparent: true,
		side: THREE.DoubleSide,
	});

// three.js scene component
class ThreeJsScene extends Component 
{
    // bind event handlers
    constructor(props)
    {
        super(props);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onControlsChange = this.onControlsChange.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);

        this.DrawScene = this.DrawScene.bind(this);
        this.SearchGUIHelper = this.SearchGUIHelper.bind(this);
        this.FindLightByName = this.FindLightByName.bind(this);
        this.FindLightByKey = this.FindLightByKey.bind(this);
        this.SetFWVersion = this.SetFWVersion.bind(this);
    }

    // initialisation ===================================================================
    InitThreeJs()
    {
        // define dimensions
        widthscale = 1.0;
        width = this.mount.clientWidth * widthscale;
        heightscale = 1.0;
        height = this.mount.clientHeight * heightscale;

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
        window.addEventListener("resize", this.onWindowResize, false);
        // add renderer to page
        this.mount.appendChild(renderer.domElement);
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
        v = new THREE.Vector3();
        // limit camera zoom
        controls.minDistance = 5.0;
        controls.maxDistance = 45.4;
        // event listeners

        // limit camera panning
        controls.addEventListener("change", this.onControlsChange);

        // disable right click context menu
        document.addEventListener("contextmenu", this.onContextMenu, false);

        // track mouse clicks (pointerup because of orbitcontrols)
        renderer.domElement.addEventListener("pointerup", this.onDocumentMouseUp, false);
        renderer.domElement.addEventListener("pointerdown", this.onDocumentMouseDown, false);

        // key presses
        document.addEventListener("keydown", this.onKeyDown, false);
        document.addEventListener("keyup", this.onKeyUp, false);
    }

    InitSceneLights()
    {
    	// directional light
    	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    	scene.add(directionalLight);
    }

    InitOutline()
    {
    	function Configuration()
    	{
    		this.visibleEdgeColor = "#F8FF33";
    		this.hiddenEdgeColor = "#F8FF33";
    	}
    
    	const conf = new Configuration();

    	// init postprocessing layers
    	composer = new EffectComposer(renderer);
    	renderPass = new RenderPass(scene, camera);
    	outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
    	effectFXAA = new ShaderPass(FXAAShader);

    	// configure edge colours
    	outlinePass.visibleEdgeColor.set(conf.visibleEdgeColor);
    	outlinePass.hiddenEdgeColor.set(conf.hiddenEdgeColor);
    	effectFXAA.uniforms["resolution"].value.set(1/width, 1/height);

    	// add postprocessing effects
    	composer.addPass(renderPass);
    	composer.addPass(outlinePass);
    	composer.addPass(effectFXAA);
    }

    InitGeometry()
    {
	    //box = new THREE.BoxBufferGeometry();

	    sphere = new THREE.SphereBufferGeometry();

	    //const size = 100;
	    //const divisions = 100;
	    //grid = new THREE.GridHelper(size, divisions);

	    //plane = new THREE.PlaneBufferGeometry();
    }

    InitLoaders()
    {
        fbxloader = new FBXLoader();
        sceneloader = new THREE.ObjectLoader();
    }

    InitPicking()
    {
        mouse = new THREE.Vector2();
        raycaster = new THREE.Raycaster();
    
        // create "ghost" sphere for placing lights
        ghost = new THREE.Mesh(sphere, translucentMat);
        ghost.scale.x = 0.35;
        ghost.scale.y = 0.35;
        ghost.scale.z = 0.35;
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
        document.addEventListener("pointermove", this.onDocumentMouseMove, false);
    }

    InitTextDisplay()
    {
        // light data display setup
	    text = document.createElement("div");
	    text.style.position = "absolute";
	    text.style.width = "260px";
	    text.style.height = "337.5px";
	    text.style.backgroundColor = "black";
	    text.style.color = "white";
	    text.innerHTML = "";
	    text.style.top = "0px";
	    text.style.left = "0px";
	    text.style.fontSize = 30 + "px";
	    text.style.fontFamily = "Calibri";
	    text.style.display = "none";
	    document.body.appendChild(text);

	    // error display setup
	    error = document.createElement("div");
	    error.style.position = "absolute";
	    error.style.backgroundColor = "black";
	    error.style.color = "white";
	    error.innerHTML = "";
	    error.style.bottom = "0px";
	    error.style.left = "0px";
	    error.style.fontSize = 30 + "px";
	    error.style.fontFamily = "Calibri";
        document.body.appendChild(error);
        
        // firmware update progress
        fwprog = document.createElement("div");
        fwprog.style.position = "absolute";
        fwprog.style.backgroundColor = "black";
        fwprog.style.color = "white";
        fwprog.innerHTML = "";
        fwprog.style.bottom = "0px";
        fwprog.style.right  = "0px";
        fwprog.style.fontSize = 30 + "px";
	    fwprog.style.fontFamily = "Calibri";
        document.body.appendChild(fwprog);
    }

    InitGUI()
    {
    	searchgui = new GUI();
        textgui = new GUI();
        groupidgui = new GUI();
        lightgui = new GUI();

    	// search field gui
    	const searchparam = {"Search": ""};
    	searchgui.add(searchparam, "Search").onFinishChange(function(value){currsearch = value});
    	searchgui.domElement.style.position = "absolute";
        searchgui.domElement.style.top = "0px";
    	searchgui.domElement.style.right = "0px";
    	// search closed by default
    	searchgui.closed = true;
    	searchgui.hide();

        // groupid gui
    	const groupidparam = {"Group ID": ""};
    	groupidgui.add(groupidparam, "Group ID").onFinishChange(function(value){currgroupid = value});
    	groupidgui.domElement.style.position = "absolute";
        groupidgui.domElement.style.top = "0px";
    	groupidgui.domElement.style.right = "0px";
        // groupid closed by default
    	groupidgui.closed = true;
        groupidgui.hide();
        
    	// input field gui
    	const inputparam = {"Light Name": ""};
    	textgui.add(inputparam, "Light Name").onChange(function(value)
    	{
    		currname = value;
    	});

    	textgui.domElement.style.position = "absolute";
        textgui.domElement.style.top = "0px";
    	textgui.domElement.style.right = "0px";

    	// input closed by default
    	textgui.closed = true;
    	textgui.hide();

        // light gui
        var onbutton = {On:function(){ledstatus = STATUS.ON;}};
        var offbutton = {Off:function(){ledstatus = STATUS.OFF;}};
        const dimparam = {"Brightness": "100"};
        var configbutton = {ConfigRequest:function(){configrequest = true;}};
        var firmwarebutton = {FirmwareUpdate:function(){firmwareupdate = true;}};
        var resetkeybutton = {ResetKey:function(){resetkey = true;}};

        lightgui.add(onbutton, "On");
        lightgui.add(offbutton, "Off");
        lightgui.add(dimparam, "Brightness").onFinishChange(function(value){currbrightness = value;
                                                                            changebrightness = true;});
        lightgui.add(configbutton, "ConfigRequest");
        lightgui.add(firmwarebutton, "FirmwareUpdate");
        lightgui.add(resetkeybutton, "ResetKey");

    	lightgui.domElement.style.position = "absolute";
        lightgui.domElement.style.top = "0px";
    	lightgui.domElement.style.right = "0px";

        // closed by default
        lightgui.closed = true;
        lightgui.hide();
    }
    //===================================================================================


    // commands =========================================================================
    // provision - add light
    ProvisionRequest(name, key, pos)
    {
        console.log("Sent provision request: name: " + name + " key: " + key);
        this.ProvisionResponse(name, key, pos);
    }

    ProvisionResponse(name, key, pos)
    {
        // key is same as name for now
        console.log("Received provision response: name: " + name + " key: " + name);

        // add light to scene (use name as key for now)
        this.AddLightHelper(name, name, pos);
    }

    ProvisionStatusRequest(key)
    {
        console.log("Sent provision status request: key: " + key);
        this.ProvisionStatusResponse(key);
    }

    ProvisionStatusResponse(key)
    {
        console.log("Received provision response: key: " + key + " status: placeholder");
    }
    
    RemoveRequest(key)
    {
        console.log("Sent remove request: key: " + key);
        this.RemoveResponse(key);
    }

    RemoveResponse(key)
    {
        console.log("Received remove response: key: " + key + " removed");
        // remove light
        this.RemoveLightHelper(key);
    }

    NewKeyRequest(oldkey, newkey)
    {
        console.log("Sent new key request: oldkey: " + oldkey + " newkey: " + newkey);
        this.NewKeyResponse(oldkey, newkey);
    }

    NewKeyResponse(oldkey, newkey)
    {
        console.log("Received new key response: oldkey: " + oldkey + " newkey: " + newkey);
        this.SetKeyHelper(oldkey, newkey);
    }

    ResetKeyRequest(key)
    {
        console.log("Sent reset key request: key: " + key);
        this.ResetKeyResponse(key, key);
    }

    ResetKeyResponse(oldkey, newkey)
    {
        console.log("Received reset key response: oldkey: " + oldkey + " newkey: " + newkey);
        this.SetKeyHelper(oldkey, newkey);
    }

    LEDOnRequest(key)
    {
        console.log("Sent LED On request: key: " + key);
        this.LEDOnResponse(key);
    }

    LEDOnResponse(key)
    {
        console.log("Received LED On response: key: " + key);
        var find = this.FindLightByKey(key);
        if (find)
            find.userData.status = STATUS.ON;
    }

    LEDOffRequest(key)
    {
        console.log("Sent LED Off request: key: " + key);
        this.LEDOffResponse(key);
    }

    LEDOffResponse(key)
    {
        console.log("Received LED Off response: key: " + key);
        var find = this.FindLightByKey(key);
        if (find)
            find.userData.status = STATUS.OFF;
    }

    DimLEDRequest(key, brightness)
    {
        console.log("Sent Dim LED request: key: " + key + " brightness: " + brightness);
        this.DimLEDResponse(key, brightness);
    }

    DimLEDResponse(key, brightness)
    {
        console.log("Received Dim LED response: key: " + key + " brightness: " + brightness);
        // check for invalid input
        if (brightness < 0 || brightness > 100)
        {
            this.ShowError("invalid brightness", 3000);
            return;
        }
        else
        {
            var find = this.FindLightByKey(key);
            if (find)
            {
                find.userData.brightness = brightness;
                find.material.transparent = true;
                // range from 0.3 to 1.0
                find.material.opacity = 0.3 + brightness / 100 * 0.7;
            }
        }
    }

    SetConfigRequest(key)
    {
        console.log("Sent Set Configuration request: key: " + key + " placeholders");
        this.SetConfigResponse(key);
    }

    SetConfigResponse(key)
    {
        console.log("Received Set Configuration response: key: " + key + " placeholders");
    }

    FWUpdateRequest(key)
    {
        console.log("Sent Firmware Update request: key: " + key);
        this.FWUpdateResponse(key);
    }

    FWUpdateResponse(key)
    {
        console.log("Received Firmware Update response: key: " + key);
        var find = this.FindLightByKey(key);

        if (find.userData.firmwareupdate)
        {
            this.ShowError("update in progress");
        }
        else
        {
            find.userData.firmwareupdate = true;
            fwprog.innerHTML = "Firmware update: 0%";

            var foo = function() {fwprog.innerHTML = "Firmware update: 50%"};
            var bar = function() {fwprog.innerHTML = "Firmware update: 100% (complete)"; 
                                                     find.userData.firmwareupdate = false;};
            var loo = function() {fwprog.innerHTML = ""};

            setTimeout(foo, 500);
            setTimeout(bar, 1000);            
            setTimeout(this.SetFWVersion, 1000, key, "2.0");
            setTimeout(loo, 2000);
        }
    }
    //===================================================================================



    // helper functions =================================================================
    // placeholder for firmware update
    SetFWVersion(key, fw)
    {
        console.log(key);
        var find = this.FindLightByKey(key);
        if (find)
            find.userData.fwversion = fw;
    }

    ShowError(msg, time)
    {
        console.log(msg);
        error.innerHTML = "Error: " + msg;
        setTimeout(this.ClearError, time);
    }

    SearchGUIHelper(value)
    {
        // find and select light
    	var light = this.FindLightByName(value);
    	// deselect any current lights
    	selectedlights = [];
    	this.ClearDisplayLightData();
    	outlinePass.selectedObjects = [];
    	// select light
    	if (light)
    	{
    		selectedlights = [light.userData.name];
    		this.MoveToLight(light.userData.name);
    		lightgui.closed = false;
    		lightgui.show();
        
    		this.DisplayLightData(light.userData.name);
    	}
    	else
    	{
            this.ShowError("light not found", 3000);
    	}
        
    	searchgui.closed = true;
    	searchgui.hide();
    }

    ToggleSearch()
    {
    	searchgui.closed = !searchgui.closed;
    	if (!searchgui.closed)
    	{
            searchgui.show();
            groupidgui.closed = true;
            groupidgui.hide();
    		textgui.closed = true;
    		textgui.hide();
    		lightgui.closed = true;
    		lightgui.hide();
    		text.innerHTML = "";
    	}
    	else
    	{
    		searchgui.hide();
    	}
    }

    ToggleGroupIDField()
    {
        groupidgui.closed = !groupidgui.closed;
        if (!groupidgui.closed)
        {
            groupidgui.show();
            searchgui.closed = true;
            searchgui.hide();
            textgui.closed = true;
            textgui.hide();
            lightgui.closed = true;
            lightgui.hide();
            text.innerHTML = "";
        }
        else
        {
            groupidgui.hide();
        }
    }

    ToggleAdd()
    {
    	textgui.closed = !textgui.closed;
    	if (!textgui.closed)
    	{
    		textgui.show();
    		searchgui.closed = true;
            searchgui.hide();
            groupidgui.closed = true;
            groupidgui.hide();
    		lightgui.closed = true;
    		lightgui.hide();
    		text.innerHTML = "";
    	}
    	else
    	{
    		textgui.hide();
    	}

    	ghost.visible = !textgui.closed;
    }

    ResetCamera()
    {
    	controls.target.set(0.0, 0.0, 0.0);
    	camera.position.set(0.0, 45.4, 0.0);
    	controls.update();
    }

    LoadModel(model, xscale, yscale, zscale, material = translucentMat)
    {
    	// load and add test model to scene
    	fbxloader.load
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

    ClearError()
    {
    	error.innerHTML = "";
    }

    AnyGUIOpen()
    {
        return !textgui.closed || !searchgui.closed || !groupidgui.closed || !lightgui.closed;
    }
    // userData properties
    // - name (string)
    // - key (string)
    // - fwversion (string)
    // - selected (bool for internal use)
    // - updateprogress (bool for internal use)
    // - last heard (string)
    // - last status (enum (int), 1:on, 2:off)
    // - pvm level (int)
    // - brightness (int, 0-100)
    // - group id (int) 0xff is default
    // - zone id (int) 0xff is default
    
    AddLight(name, pos)
    {
        // default public key is 0
        this.ProvisionRequest(name, 0, pos);
    }

    AddLightHelper(name, key, pos)
    {
    	// init mesh and data
    	const lightmesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ({color:GREY}));
    
    	// not sure why position.set doesn't work, this is okay though
    	lightmesh.position.x = pos.x;
    	lightmesh.position.y = pos.y;
    	lightmesh.position.z = pos.z;
    	lightmesh.scale.x = 0.35;
    	lightmesh.scale.y = 0.35;
    	lightmesh.scale.z = 0.35;

        // keys are just same as name for now
    	// add lightdata into the three.js mesh
        lightmesh.userData = {name: name, 
                              key: key, 
                              fwversion : "1.0",
                              selected: false,
                              updateprogress: false,
                              lastheard: "test", 
                              status: STATUS.OFF, 
                              pvm: 0,
                              brightness: 100,
                              groupid: 0xff,
                              zoneid: 0xff};
    
    	// add mesh to array (for raycasting/picking)
    	LightArray.push(lightmesh);
    
    	// add mesh to scene (for rendering)
    	scene.add(lightmesh);
    
    	return lightmesh;
    }

    // finding light in lightarray
    FindLightByName(name)
    {
    	return LightArray.find(light => light.userData.name === name);
    }
    FindLightByKey(key)
    {
        return LightArray.find(light => light.userData.key === key);
    }

    // removing light objects from the scene
    RemoveLight(key)
    {
        this.RemoveRequest(key);
    }
    RemoveLightHelper(key)
    {
    	// find and remove light from LightArray
    	var index = LightArray.findIndex(light => light.userData.key === key);
    
    	// find and remove object from scene
    	LightArray[index].parent.remove(LightArray[index]);
    
    	if(index !== -1)
    		LightArray.splice(index, 1);
    }

    SetKeyHelper(oldkey, newkey)
    {
        var index = LightArray.findIndex(light => light.userData.key === oldkey);
        LightArray[index].userData.key = newkey;
    }

    // setting light status
    SetSelectedLightStatus(selected, status)
    {
    	for (var i = 0; i < selected.length; ++i)
    	{
            var find = this.FindLightByName(selected[i]);
            
    		if (find)
    		{
                if (status === STATUS.ON)
                    this.LEDOnRequest(find.userData.key);
                else if (status === STATUS.OFF)
                    this.LEDOffRequest(find.userData.key);
    		}
    	}
    }

    // reset keys
    ResetSelectedLightKeys(selected)
    {
        for (var i = 0; i < selected.length; ++i)
    	{
            var find = this.FindLightByName(selected[i]);
            
    		if (find)
    		{
                this.ResetKeyRequest(find.userData.key);
    		}
    	}
    }

    // move camera to selected light
    MoveToLight(name)
    {
    	var find = this.FindLightByName(name);

    	if (find)
    	{
    		find.userData.selected = true;
    		controls.target.set(find.position.x, find.position.y, find.position.z);
    		camera.position.set(find.position.x, find.position.y + 10, find.position.z);
    		outlinePass.selectedObjects = [find];
    		controls.update();
    	}
    }
    // select group
    SelectGroup(id)
    {
        var found = false;

        // select lights in given groupid
        for (var i = 0; i < LightArray.length; ++i)
        {
            var light = LightArray[i];

            if (light.userData.groupid === id)
            {
                // clear current selection once found
                if (!found)
                {
                    found = true;
                    outlinePass.selectedObjects = [];
                    selectedlights = [];
                }
                outlinePass.selectedObjects.push(light);
                selectedlights.push(light.userData.name);
            }
        }

        // group exists
        if (found)
        {
            searchgui.closed = true;
            lightgui.closed = false;
            searchgui.hide();
            lightgui.show();
        }
        else
        {
            this.ShowError("group empty", 3000);
        }
    }
    // set groupid
    SetGroupID(id)
    {
        for (var i = 0; i < selectedlights.length; ++i)
        {
            var light = this.FindLightByName(selectedlights[i]);
            light.userData.groupid = id;
        }
    }
    // light data update
    LightArrayUpdate()
    {
    	// only display data of selected light on screen
    	var foundselected = false;
    	// loop through all lights and update data accordingly
    	for (var i = 0; i < LightArray.length; ++i)
    	{
    		var light = LightArray[i];

    		// status display (off/on/normal)
    		if (light.userData.status === STATUS.OFF)
    			light.material.color.setHex(GREY);
    		else if (light.userData.status === STATUS.ON)
    			light.material.color.setHex(LIGHTBLUE);
    		else
    			light.material.color.setHex(GREEN);

    		// data display
    		// check for currently clicked on light
    		if (selectedlights.length === 1)
    		{
    			if (light.userData.name === selectedlights[0])
    			{
    				foundselected = true;
    				outlinePass.selectedObjects = [light];
    				this.DisplayLightData(light.userData.name);
    			}
    		}
    		else
    		{
    			// selected check
    			if (!foundselected && light.userData.selected === true)
    			{
    				foundselected = true;
    				outlinePass.selectedObjects = [light];
    				this.DisplayLightData(light.userData.name);
    			}
    		}
    	}
    
    	// if none are selected, turn off data display
    	if (!foundselected)
    		this.ClearDisplayLightData();
    }
    // display data of light given name/ids
    DisplayLightData(name)
    {
    	var find = this.FindLightByName(name);
    	var laststatus;

    	if (find.userData.status === STATUS.OFF)
    		laststatus = "OFF";
    	else if (find.userData.status === STATUS.ON)
    		laststatus = "ON";
    	else
    		laststatus = "NORMAL";

    	// <br/> is a newline
        text.innerHTML = "Name: " + find.userData.name + "<br/>" +
                         "Key: " + find.userData.key + "<br/>" +
                         "FW Version: " + find.userData.fwversion + "<br/>" +
                         "Brightness: " + find.userData.brightness + "<br/>" + 
                         "Group: " + find.userData.groupid + "<br/>" +
                         "Zone: " + find.userData.zoneid + "<br/>" + 
    					 "Last Heard: " + find.userData.lastheard + "<br/>" +
    					 "Last Status: " + laststatus + "<br/>" +
    					 "PVM Level: " + find.userData.pvm;
    	text.style.display = "block";
    	// top and left specifies the position of the data
    	//text.style.top = window.innerHeight - 100 + "px";
    	//text.style.left = 500 + "px";
    }
    // clear display
    ClearDisplayLightData()
    {
    	text.innerHTML = "";
    	text.style.display = "none";
    }

    // file saving and loading
    // fetch helper function
    async FetchData(j = "default")
    {
    	let url = serverAddress + "resources/" + j + ".json";
    	const response = await fetch(url);
    	if(response.ok)
    	{
    		const data = await response.json();

    		return data;
    	}
    }
    // update light and plane arrays with loaded objects
    UpdateArrays()
    {
    	// add lights and plane to array
    	scene.traverse(function (object)
    	{
    		// lights
    		if (object.userData.name)
    		{
                object.material.opacity = 0.3 + object.brightness / 100 * 0.7;
    			LightArray.push(object);
    		}
    		else if (object.isMesh)
    		{
    			// plane
    			if (object.geometry.type === "PlaneBufferGeometry" || object.geometry.type === "PlaneGeometry")
    				PlaneArray.push(object);
    			// ghost light
    			else if (object.geometry.type === "SphereBufferGeometry" || object.geometry.type === "SphereGeometry")
    				ghost = object;
    		}
    	});
    }
    // load scene from json
    async LoadScene(s = "default")
    {
    	const out = await this.FetchData(s);

    	if (out)
    	{
    		filename = s;
    		// clear existing scene
    		while (scene.children.length > 0)
    		{
    			scene.remove(scene.children[0]);
    		}

    		// clear existing data
    		for (var i = 0; i < LightArray.length; ++i)
    		{
    			// find and remove object from scene
    			if(LightArray[i].parent)
    				LightArray[i].parent.remove(LightArray[i]);
    		}
    		LightArray = [];
    		PlaneArray = [];

    		// add objects from json
    		sceneloader.load(serverAddress + "resources/" + s + ".json", function(object) 
    		{
                scene.add(object);
    		});
    	}
    	else
    	{
    		console.log("failed to load data");
    	}

    	setTimeout(this.UpdateArrays, 1000);
    }
    // save scene to json
    DownloadScene()
    {
    	var saveData = (function () 
    	{
    		var a = document.createElement("a");
    		document.body.appendChild(a);
    		a.style = "display: none";
            return function (data, fileName) 
            {
    			var json = JSON.stringify(data, null, 2),
    				blob = new Blob([json], {type: "octet/stream"}),
    				url = window.URL.createObjectURL(blob);
    			a.href = url;
    			a.download = fileName;
    			a.click();
    			window.URL.revokeObjectURL(url);
    		};
    	}());

    	var save = scene.toJSON();
    	saveData(save, filename.replace(/\..+$/, '') + ".json");
    }
    // convert degrees to radians
    Rad(deg)
    {
	    return deg * Math.PI / 180;
    }
    //===================================================================================



    // "main"
	componentDidMount() 
	{
        // define server address
        serverAddress = "http://10.1.11.197:8080/";

        // scene init
        this.InitThreeJs();
        this.InitCameraControls();
        this.InitSceneLights();
        this.InitOutline();
        this.InitGeometry();
        this.InitLoaders();
        this.InitPicking();
        this.InitTextDisplay();
        this.InitGUI();

        // load default scene
        this.LoadScene();
        // call render loop
		this.DrawScene();
    }



    // render loop ======================================================================
    DrawScene()
    {
        requestAnimationFrame(this.DrawScene);
        // update light data
        this.LightArrayUpdate();

        // searchgui helper 
        if (currsearch)
        {
            this.SearchGUIHelper(currsearch);
            currsearch = null;
        }
        
        // groupidgui helper
        if (currgroupid)
        {

        }

        if (selectedlights.length > 0)
        {
            var currkey = this.FindLightByName(selectedlights[0]).userData.key;
            // light gui helpers
            if (ledstatus)
            {
                this.SetSelectedLightStatus(selectedlights, ledstatus);
                ledstatus = null;
            }
            // these functions only work on one for now
            if (changebrightness)
            {
                this.DimLEDRequest(currkey, currbrightness);
                changebrightness = null;
            }
            if(configrequest)
            {
                this.SetConfigRequest(currkey);
                configrequest = null;
            }
            if (firmwareupdate)
            {
                this.FWUpdateRequest(currkey);
                firmwareupdate = null;
            }
            if (resetkey)
            {
                this.ResetSelectedLightKeys(selectedlights);
                resetkey = null;
            }
        }


        // keeps focus on input field for light name
        var tmp = document.getElementsByTagName("INPUT");
        // 0 - search
        // 1 - input
        if (!textgui.closed)
        {
            tmp[1].focus();
            tmp[0].blur();
        }
        else if (!searchgui.closed)
        {
            tmp[1].blur();
            tmp[0].focus();
        }

        // intersection checks for picking
        raycaster.setFromCamera(mouse, camera);

        // disable orbitcontrols if viewing
        controls.enabled = textgui.closed;

        const intersects = raycaster.intersectObjects(LightArray);
        const planeintersects = raycaster.intersectObjects(PlaneArray);

        // light
        if(intersects.length > 0)
        {
            if(LIGHTINTERSECTED !== intersects[0].object)
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
                    if(textgui.closed)
                    {
                        // if single selection
                        if (!selectedStart && selectedlights.length === 0)
                        {
                            // select this light
                            selectedlights = [intersects[0].object.userData.name];
                            this.MoveToLight(LIGHTINTERSECTED.userData.name);
                        }
                        lightgui.closed = false;
                        lightgui.show();
                    }
                }

                // removing
                if(Rmouseup)
                {
                    // check if in add mode
                    if(!textgui.closed)
                    {
                        this.RemoveLight(LIGHTINTERSECTED.userData.key);
                    }
                }
            }
        }
        else
        {
            if(LIGHTINTERSECTED)
            {
                // onexit
                // clear display and outline if no light clicked
                if (selectedlights.length < 1 && !selectedStart)
                {
                    this.ClearDisplayLightData();
                    outlinePass.selectedObjects = [];
                }

                LIGHTINTERSECTED.userData.selected = false;
            }
            LIGHTINTERSECTED = null;
        }

        // plane
        if(!textgui.closed)
        {
            if(planeintersects.length > 0)
            {
                if (PLANEINTERSECTED !== planeintersects[0].object)
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
                        if(currname === "")
                            this.AddLight("lighttest", planeintersects[0].point);
                        else
                            this.AddLight(currname, planeintersects[0].point);
                    }
                
                    // update "ghost" sphere
                    if (!textgui.closed)
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

        // reset mouse click event bools	
        Lmouseup = false;
        Rmouseup = false;

        // update the global transform of the camera object
        camera.updateMatrixWorld();

        // camera controls update
        controls.update();

        // render (use composer.render if postprocessing is used)
        composer.render();
    }
    //===================================================================================



    // cleanup
    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onWindowResize);
        controls.removeEventListener("change", this.onControlsChange);
        document.removeEventListener("contextmenu", this.onContextMenu);
        //this.renderer.removeEventListener("pointerup", this.onDocumentMouseUp);
        //this.renderer.removeEventListener("pointerdown", this.onDocumentMouseDown);
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        document.removeEventListener("pointermove", this.onDocumentMouseMove);
    }



    // event handlers ===================================================================
    // resize
    onWindowResize()
    {
        width = window.innerWidth * widthscale;
        height = window.innerHeight * heightscale;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    // camera controls
    onControlsChange()
    {
        v.copy(controls.target);
        controls.target.clamp(minPan, maxPan);
        v.sub(controls.target);
        camera.position.sub(v);
    }
    // context menu
    onContextMenu(event)
    {
	    event.preventDefault();
	    return false;
    }
    // mouse
    onDocumentMouseUp(event)
    {
        event.preventDefault();

        switch(event.which)
        {
            // lmb
            case 1:
                Lmouseup = true;
                controls.enableRotate = true;

                var offsetx = renderer.domElement.getBoundingClientRect().left;
                var offsety = renderer.domElement.getBoundingClientRect().top;

                selectionBox.endPoint.set
                (
                     ((event.clientX - offsetx) / width) * 2 - 1,
                    -((event.clientY - offsety) / height) * 2 + 1,
                     0.5
                )
    
                // deselect light if left clicked in view mode
                if (textgui.closed && Lmouseup && (selectedlights.length > 0) && !selectedStart)
                {
                    var tmp = this.FindLightByName(selectedlights[0]);
                    tmp.userData.selected = false;
                    searchgui.closed = true;
                    searchgui.hide();
                    selectedlights = [];
                    this.ClearDisplayLightData();
                    outlinePass.selectedObjects = [];
                }
    
                if (selectedStart)
                {
                    selectedStart = false;
                    if (selectedlights.length > 0)
                    {
                        lightgui.closed = false;
                        lightgui.show();
                    }
                }
                else
                {
                    searchgui.closed = true;
                    groupidgui.closed = true;
                    lightgui.closed = true;
                    searchgui.hide();
                    groupidgui.hide();
                    lightgui.hide();
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
    onDocumentMouseDown(event)
    {
        event.preventDefault();

        switch(event.which)
        {
            // lmb
            case 1:
                if (LCTRLdown)
                {
                    selectedStart = true;
                    selectedlights = [];
                    outlinePass.selectedObjects = [];
                    
                    var offsetx = renderer.domElement.getBoundingClientRect().left;
                    var offsety = renderer.domElement.getBoundingClientRect().top;

                    selectionBox.startPoint.set
                    (
                         ((event.clientX - offsetx) / width) * 2 - 1,
                        -((event.clientY - offsety) / height) * 2 + 1,
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
    // key presses
    onKeyDown(event)
    {
	    // disable ctrl f and use my own
	    if (textgui.closed && (event.code === "F3" || (event.ctrlKey && event.code === "KeyF")))
	    {
	    	event.preventDefault();
	    	this.ToggleSearch();
	    }

	    switch(event.code)
	    {
	    	case "ControlLeft":
	    		LCTRLdown = true;
	    		controls.enablePan = false;
	    		controls.enableRotate = false;
	    		break;
	    	case "Space":
	    		if (LCTRLdown)
	    			toggle = true;
	    		break;
	    	default:
	    		break;
	    }
    }
    onKeyUp(event)
    {
        switch(event.code)
        {
            case "Space":
                // toggle add/view mode (with lctrl pressed)
                if (toggle)
                {
                    toggle = false;
                    this.ToggleAdd();
                }
                break;
            case "KeyS":
                // save into json and download
                if (this.AnyGUIOpen() === false)
                    this.DownloadScene();
                    //DownloadData();
                break;
            case "KeyQ":
                // load c1basement1
                if (this.AnyGUIOpen() === false)
                    this.LoadScene("c1basement1");
                break;
            case "KeyW":
                // load c1basement2
                if (this.AnyGUIOpen() === false)
                    this.LoadScene("c1basement2");
                break;
            case "KeyC":
                if (this.AnyGUIOpen() === false)
                    this.ResetCamera();
                break;
            case "KeyG":
                if (this.AnyGUIOpen() === false)
                    this.ToggleGroupIDField();
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
            case "Digit1":
                if (this.AnyGUIOpen() === false)
                    this.SelectGroup("default");
                break;
            case "Digit2":
                if (this.AnyGUIOpen() === false)
                    this.SelectGroup("asdasdasd");
                break;
            default:
                break;
        }
    }
    // mouse move
    onDocumentMouseMove(event)
    {
        event.preventDefault();
        
        var offsetx = renderer.domElement.getBoundingClientRect().left;
        var offsety = renderer.domElement.getBoundingClientRect().top;

        mouse.x =  ((event.clientX - offsetx) / width) * 2 - 1;
        mouse.y = -((event.clientY - offsety) / height) * 2 + 1;

        // selection
        if (selectionBoxHelper.isDown && LCTRLdown)
        {
            selectionBox.endPoint.set
            (
                 ((event.clientX - offsetx) / width) * 2 - 1,
                -((event.clientY - offsety) / height) * 2 + 1,
                0.5 
            );
    
            const allSelected = selectionBox.select();
            for (var i = 0; i < allSelected.length; ++i)
            {
                // check if object selected is a light
                if (allSelected[i].userData.name)
                {
                    // select object
                    if (selectedlights.indexOf(allSelected[i].userData.name) === -1)
                    {
                        outlinePass.selectedObjects.push(allSelected[i]);
                        selectedlights.push(allSelected[i].userData.name);
                    }
                }
            }
        }
    }
    //===================================================================================

    // render function and canvas size
    render() 
    {
	    return (<div 
            style={{ 
                position: "absolute", 
                width: "100%", height: "100%",
                //left: "15%", top: "15%" 
            }}
	        ref={mount => {this.mount = mount}}
	    />)
	}
}

export default ThreeJsScene;