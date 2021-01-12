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
let mouse, raycaster, ghost, lintersect, pintersect;
var LCTRLdown = false;
var toggle = false;
var Lmouseup = false, Rmouseup = false;
// selection box
var selectedlights = [];
var selectedStart = false;
var selectionBox, selectionBoxHelper;
// arrays used for raycasting and picking
var LightArray = [];
var PlaneArray = [];
// filename
var filename = "";
// text display
var text, msg, proggui;
// gui
var searchgui, textgui, lightgui, colourgui, inputparams, colourparams;
var currsearch, currgroupid, currzoneid, currmaxbrightness, currdimmedbrightness, 
    currmsbrightness, currholdtime, currmssens, currsyncclock, currcolourid;
var ledstatus, resetkey, firmwareupdate, changemaxbrightness, changedimmedbrightness, 
    changemsbrightness, changeholdtime, changemssens, changesyncclock, changetriggers;
var usegroupcolour = true;
var currname = "";
var GroupColourArray = [];
var ZoneColourArray = [];
var TriggerLineArray = [];
// "enum" for light status
const STATUS = 
{
	ON : 1,
	OFF : 2
}

// colour codes for quick access
const WHITE = 0xFFFFFF;
const RED = 0xFF0000;
const GREEN = 0x00FF00;
const LIGHTBLUE = 0x7EC0EE;
//const YELLOW = 0xF8FF33;
const GREY = 0x808080;

// materials
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
        this.UpdateTriggers = this.UpdateTriggers.bind(this);
        this.DrawTriggerLine = this.DrawTriggerLine.bind(this);
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
    	// init postprocessing layers
    	composer = new EffectComposer(renderer);
    	renderPass = new RenderPass(scene, camera);
    	outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
    	effectFXAA = new ShaderPass(FXAAShader);

    	// configure edge colours
    	outlinePass.visibleEdgeColor.set("#F8FF33");
    	outlinePass.hiddenEdgeColor.set("#F8FF33");
        outlinePass.edgeStrength= 3.0;
        outlinePass.edgeThickness = 1.0;
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
        var styles = `.selectBox
                      {
                          border: 1px solid #55aaff;
                          background-color: rgba(75, 160, 255, 0.3);
                          position: fixed;
                      }`;
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
	    text.style.width = "330px";
	    text.style.height = "390px";
	    text.style.backgroundColor = "black";
	    text.style.color = "white";
	    text.innerHTML = "";
	    text.style.top = "0px";
	    text.style.left = "0px";
	    text.style.fontSize = 20 + "px";
	    text.style.fontFamily = "Calibri";
	    text.style.display = "none";
	    document.body.appendChild(text);

	    // error display setup
	    msg = document.createElement("div");
	    msg.style.position = "absolute";
	    msg.style.backgroundColor = "black";
	    msg.style.color = "white";
	    msg.innerHTML = "";
	    msg.style.bottom = "0px";
	    msg.style.left = "0px";
	    msg.style.fontSize = 20 + "px";
	    msg.style.fontFamily = "Calibri";
        document.body.appendChild(msg);
        
        // firmware update progress
        proggui = document.createElement("div");
        proggui.style.position = "absolute";
        proggui.style.backgroundColor = "black";
        proggui.style.color = "white";
        proggui.innerHTML = "";
        proggui.style.bottom = "0px";
        proggui.style.right  = "0px";
        proggui.style.fontSize = 20 + "px";
	    proggui.style.fontFamily = "Calibri";
        document.body.appendChild(proggui);
    }

    InitGUI()
    {
    	searchgui = new GUI();
        textgui = new GUI();
        lightgui = new GUI();
        colourgui = new GUI();

    	// search field gui
    	const searchparam = {"Search": ""};
    	searchgui.add(searchparam, "Search").onFinishChange(function(value){currsearch = value});
    	searchgui.domElement.style.position = "absolute";
        searchgui.domElement.style.top = "0px";
    	searchgui.domElement.style.right = "0px";
    	// search closed by default
    	searchgui.closed = true;
    	searchgui.hide();
        
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
        inputparams = {"MaxBrightness": "100",
                       "DimmedBrightness": "100",
                       "MSBrightness": "100",
                       "HoldTime": "0",
                       "SyncClock": true,
                       "MSSensitivity": "Medium",
                       "GroupID": "",
                       "ZoneID": "",
                       "EditTriggers": false};
        var firmwarebutton = {FirmwareUpdate:function(){firmwareupdate = true;}};
        var resetkeybutton = {ResetKey:function(){resetkey = true;}};

        lightgui.add(onbutton, "On");
        lightgui.add(offbutton, "Off");
        lightgui.add(inputparams, "MaxBrightness").onFinishChange(function(value){currmaxbrightness = value;
                                                                                  changemaxbrightness = true;});
        lightgui.add(inputparams, "DimmedBrightness").onFinishChange(function(value){currdimmedbrightness = value;
                                                                                     changedimmedbrightness = true;});
        lightgui.add(inputparams, "MSBrightness").onFinishChange(function(value){currmsbrightness = value;
                                                                                 changemsbrightness = true;});
        lightgui.add(inputparams, "HoldTime").onFinishChange(function(value){currholdtime = value;
                                                                             changeholdtime = true;});
        lightgui.add(firmwarebutton, "FirmwareUpdate");
        lightgui.add(resetkeybutton, "ResetKey");
        lightgui.add(inputparams, "SyncClock").listen().onFinishChange(function(value){currsyncclock = value;
                                                                                       changesyncclock = true;});
        lightgui.add(inputparams, "MSSensitivity", ["Low", "Medium-Low", "Medium", "Medium-High", "High"]).listen()
                                                        .onFinishChange(function(value){currmssens = value;
                                                                        changemssens = true;});
        lightgui.add(inputparams, "GroupID").onFinishChange(function(value){currgroupid = value});
        lightgui.add(inputparams, "ZoneID").onFinishChange(function(value){currzoneid = value});
        lightgui.add(inputparams, "EditTriggers").listen().onFinishChange(function(value){changetriggers = value;});

    	lightgui.domElement.style.position = "absolute";
        lightgui.domElement.style.top = "0px";
    	lightgui.domElement.style.right = "0px";

        // closed by default
        inputparams["EditTriggers"] = false;
        lightgui.closed = true;
        changetriggers = false;
        lightgui.hide();

        // colour picker
        colourparams = {"GroupColour": true, "ZoneColour": false, "ID": ""};
        var palette = {color: "#7EC0EE"};
        colourgui.add(colourparams, "GroupColour").listen().onFinishChange(
            function(value)
            {
                colourparams["GroupColour"] = true;
                colourparams["ZoneColour"] = false;
                usegroupcolour = true;
            });
        colourgui.add(colourparams, "ZoneColour").listen().onFinishChange(
            function(value)
            {
                colourparams["GroupColour"] = false;
                colourparams["ZoneColour"] = true;
                usegroupcolour = false;
            });
        colourgui.add(colourparams, "ID").onFinishChange(function(value)
            {
                if (value >= 0 && value <= 255)
                    currcolourid = value;
            });
        colourgui.addColor(palette, "color").onChange(function(value)
            {
                if (currcolourid >= 0 && currcolourid <= 255)
                {
                    var str = "0x" + value.slice(1, 7);

                    if (usegroupcolour)
                        GroupColourArray[currcolourid] = str;
                    else
                        ZoneColourArray[currcolourid] = str;
                }
            });
        colourgui.closed = true;
        colourgui.hide();
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

        proggui.innerHTML = "Requesting provision...";

        var foo = function() {proggui.innerHTML = "Provision successful, light added"};
        var bar = function() {proggui.innerHTML = ""};

        setTimeout(foo, 2000);
        setTimeout(this.AddLightHelper, 2000, name, name, pos);
        setTimeout(bar, 3000);
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

    SetMaxBrightnessRequest(key, brightness)
    {
        console.log("Sent Set MaxBrightness request: key: " + key + " maxbrightness: " + brightness);
        this.SetMaxBrightnessResponse(key, brightness);
    }

    SetMaxBrightnessResponse(key, brightness)
    {
        console.log("Received Set MaxBrightness response: key: " + key + " maxbrightness: " + brightness);

        if (brightness < 0 || brightness > 100)
            this.ShowMsg("Error: invalid brightness", 3000);
        else
            this.SetBrightnessHelper(key, brightness, "max");
    }

    SetDimmedBrightnessRequest(key, brightness)
    {
        console.log("Sent Set DimmedBrightness request: key: " + key + " dimmedbrightness: " + brightness);
        this.SetDimmedBrightnessResponse(key, brightness);
    }

    SetDimmedBrightnessResponse(key, brightness)
    {
        console.log("Received Set DimmedBrightness response: key: " + key + " dimmedbrightness: " + brightness);
    
        if (brightness < 0 || brightness > 100)
            this.ShowError("invalid brightness", 3000);
        else
            this.SetBrightnessHelper(key, brightness, "dimmed");
    }

    SetMSBrightnessRequest(key, brightness)
    {
        console.log("Sent Set MSBrightness request: key: " + key + " msbrightness: " + brightness);
        this.SetMSBrightnessResponse(key, brightness);
    }

    SetMSBrightnessResponse(key, brightness)
    {
        console.log("Received Set MSBrightness response: key: " + key + " msbrightness: " + brightness);

        if (brightness < 0 || brightness > 100)
            this.ShowMsg("Error: invalid brightness", 3000);
        else
            this.SetBrightnessHelper(key, brightness, "motion");
    }

    SetMSSensRequest(key, sens)
    {
        console.log("Sent Set MSSens request: key: " + key + " mssens: " + sens);
        this.SetMSSensResponse(key, sens);
    }

    SetMSSensResponse(key, sens)
    {
        console.log("Received Set MSSens response: key: " + key + " mssens: " + sens);

        var find = this.FindLightByKey(key);
        if (find)
            find.userData.msSens = sens;
    }

    SetSyncClockRequest(key, sync)
    {
        console.log("Sent Set Sync Clock request: key: " + key + " sync: " + sync);
        this.SetSyncClockResponse(key, sync);
    }

    SetSyncClockResponse(key, sync)
    {
        console.log("Received Set Sync Clock response: key: " + key + " sync: " + sync);

        var find = this.FindLightByKey(key);
        if (find)
            find.userData.syncClock = sync;
    }

    SetHoldTimeRequest(key, time)
    {
        console.log("Sent Set Hold Time request: key: " + key + " time: " + time);
        this.SetHoldTimeResponse(key, time);
    }

    SetHoldTimeResponse(key, time)
    {
        console.log("Received Set Hold Time response: key: " + key + " time: " + time);

        var find = this.FindLightByKey(key);
        if (find)
            find.userData.holdTime = time;
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
            this.ShowError("Error: update in progress");
        }
        else
        {
            find.userData.firmwareupdate = true;
            proggui.innerHTML = "Firmware update: 0%";

            var foo = function() {proggui.innerHTML = "Firmware update: 50%"};
            var bar = function() {proggui.innerHTML = "Firmware update: 100% (complete)"; 
                                                      find.userData.firmwareupdate = false;};
            var loo = function() {proggui.innerHTML = ""};

            setTimeout(foo, 500);
            setTimeout(bar, 1000);            
            setTimeout(this.SetFWVersion, 1000, key, "2.0");
            setTimeout(loo, 2000);
        }
    }
    //===================================================================================



    // triggers =========================================================================
    // sample activation is just turning it on for now
    DrawTriggerLine(key, triggereekey)
    {
        var find = this.FindLightByKey(key);
        var findtrig = this.FindLightByKey(triggereekey);

        var start = new THREE.Vector3(find.position.x, find.position.y + 0.2, find.position.z);
        var end = new THREE.Vector3(findtrig.position.x, findtrig.position.y + 0.2, findtrig.position.z);

        var length = start.distanceTo(end);
        var dir = new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
        dir.normalize();
        const arrow = new THREE.ArrowHelper(dir, start, length, RED, 0.5);
        arrow.userData = {triggererkey: key, triggereekey: triggereekey};

        //arrow.children[0].material.color.setHex(LIGHTBLUE);
        //arrow.children[1].material.color.setHex(LIGHTBLUE);

        TriggerLineArray.push(arrow);
        scene.add(arrow);
    }
    
    ToggleTriggerLines()
    {
        for (var i = 0; i < TriggerLineArray.length; ++i)
            TriggerLineArray[i].visible = !TriggerLineArray[i].visible;
    }

    Activate(key)
    {
        var find = this.FindLightByKey(key);
        console.log(key + " activated");

        find.userData.status = STATUS.ON;

        for (var i = 0; i < find.userData.triggerees.length; ++i)
        {
            var triggeree = find.userData.triggerees[i];
            var obj = this.FindLightByKey(triggeree);
            this.Trigger(obj.userData.key, key);
        }
    }

    Trigger(key, trigger)
    {
        var find = this.FindLightByKey(key);
        
        find.userData.status = STATUS.ON;
        console.log(key + " triggered by " + trigger);
    }

    AddTrigger(key, triggereekey)
    {
        if (key === triggereekey)
        {
            this.ShowMsg("Error: Light cannot add itself as trigger", 3000);
            return;
        }

        var find = this.FindLightByKey(key);
        var findtrig = this.FindLightByKey(triggereekey);

        if (find.userData.triggerees.includes(triggereekey))
        {
            this.ShowMsg("Error: Trigger already exists", 3000);
            return;
        }
        //else if(findtrig.userData.triggerees.includes(key))
        //{
        //    this.ShowMsg("Error: Circular trigger", 3000);
        //    return;
        //}
        else
        {
            this.DrawTriggerLine(key, triggereekey);
            this.ShowMsg("Trigger added", 3000);
        }

        find.userData.triggerees.push(triggereekey);
        findtrig.userData.triggerers.push(key);
    }

    RemoveTrigger(key, triggereekey)
    {
        var find = this.FindLightByKey(key);
        var findtrig = this.FindLightByKey(triggereekey);

        var triggereeindex = find.userData.triggerees.indexOf(triggereekey);
        var triggererindex = findtrig.userData.triggerers.indexOf(key);

        var index = null;

        for (var i = 0; i < TriggerLineArray.length; ++i)
        {
            if (TriggerLineArray[i].userData.triggererkey === key && 
                TriggerLineArray[i].userData.triggereekey === triggereekey)
            {
                index = i;
                TriggerLineArray[i].parent.remove(TriggerLineArray[i]);
                break;
            }
        }
        
        if (index !== null)
            TriggerLineArray.splice(index, 1);

        if (triggereeindex !== -1)
        {
            this.ShowMsg("Trigger removed", 3000);
            find.userData.triggerees.splice(triggereeindex, 1);
        }
        else
        {
            this.ShowMsg("Error: Trigger does not exist", 3000);
        }

        if (triggererindex !== -1)
            findtrig.userData.triggerers.splice(triggererindex, 1);
    }
    //===================================================================================



    // helper functions =================================================================
    // placeholder for firmware update
    SetFWVersion(key, fw)
    {
        var find = this.FindLightByKey(key);
        if (find)
            find.userData.fwVersion = fw;
    }

    SetBrightnessHelper(key, brightness, type)
    {
        var find = this.FindLightByKey(key);
        if (find)
        {
            if (type === "max")
            {
                find.userData.maxBrightness = brightness;
                find.material.transparent = true;
                // range from 0.3 to 1.0
                find.material.opacity = 0.3 + brightness / 100 * 0.7;
            }
            else if (type === "dimmed")
            {
                find.userData.dimmedBrightness = brightness;
            }
            else if (type === "motion")
            {
                find.userData.msBrightness = brightness;
            }
        }
    }

    ShowMsg(message, time)
    {
        console.log(message);
        msg.innerHTML = message;
        setTimeout(this.ClearMsg, time);
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
            inputparams["SyncClock"] = light.userData.syncClock;
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
    		textgui.closed = true;
            textgui.hide();
            inputparams["EditTriggers"] = false;
            lightgui.closed = true;
            lightgui.hide();
    		text.innerHTML = "";
    	}
    	else
    	{
    		searchgui.hide();
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
            inputparams["EditTriggers"] = false;
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
                
    				fbx.traverse(function(child)
    				{
    					if (child instanceof THREE.Mesh)
    						child.material = material;
    				});
                
    				scene.add(fbx);
    			}, 
    			undefined, 
    			function (error) {console.error(error);}
    	);
    }

    ClearMsg()
    {
    	msg.innerHTML = "";
    }

    AnyGUIOpen()
    {
        return !textgui.closed || !searchgui.closed || !lightgui.closed || !colourgui.closed;
    }
    // userData properties
    // - name (string)
    // - key (string)
    // - fwVersion (string)
    // - selected (bool for internal use)
    // - updateProgress (bool for internal use)
    // - provisionProgress (bool for internal use)
    // - lastHeard (string)
    // - status (enum (int), 1:on, 2:off)
    // - pwm (int)
    // - msSens (string)
    // - syncClock (bool)
    // - maxBrightness (int, 0-100)
    // - dimmedBrightness (int, 0-100)
    // - msBrightness (int, 0-100)
    // - holdTime int
    // - groupId (int) 0xff (255) is default
    // - zoneId (int) 0xff (255) is default
    // - triggerers (array of strings)
    // - triggerees (array of strings)
    
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
                              fwVersion : "1.0",
                              selected: false,
                              updateProgress: false,
                              provisionProgress: false,
                              lastHeard: "test", 
                              status: STATUS.OFF, 
                              pwm: 0,
                              msSens: "Medium",
                              syncClock: true,
                              maxBrightness: 100,
                              dimmedBrightness: 100,
                              msBrightness: 100,
                              holdTime: 0,
                              groupId: 255,
                              zoneId: 255,
                              triggerers: [],
                              triggerees: []};
    
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
        // remove existing triggerers and triggerees
        var find = this.FindLightByKey(key);
        for (var i = 0; i < find.userData.triggerers; ++i)
        {
            this.RemoveTrigger(find.userData.triggerers[i], key);
        }

        for (var j = 0; j < find.userData.triggerees; ++i)
        {
            this.RemoveTrigger(key, find.userData.triggerees[j]);
        }

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

    // mode - true for group, false for zone
    MultiSelectHelper(id, mode)
    {
        var found = false;

        if (id === 255)
        {
            for (var i = 0; i < LightArray.length; ++i)
            {
                if (!found)
                {
                    found = true;
                    outlinePass.selectedObjects = [];
                    selectedlights = [];
                }

                var light = LightArray[i];
                outlinePass.selectedObjects.push(light);
                selectedlights.push(light.userData.name);
            }
        }
        else
        {
            for (var j = 0; j < LightArray.length; ++j)
            {
                var light0 = LightArray[j];
                
                var push = false;
                // group
                if (mode)
                {
                    if (parseInt(light0.userData.groupId) === id)
                        push = true;
                }
                // zone
                else
                {
                    if (parseInt(light0.userData.zoneId) === id)
                        push = true;
                }

                if (push)
                {
                    if (!found)
                    {
                        found = true;
                        outlinePass.selectedObjects = [];
                        selectedlights = [];
                    }
    
                    outlinePass.selectedObjects.push(light0);
                    selectedlights.push(light0.userData.name);
                }
            }
        }

        if (found)
        {
            searchgui.closed = true;
            lightgui.closed = false;
            searchgui.hide();
            lightgui.show();
        }
        else
        {
            if (mode)
                this.ShowMsg("Error: group empty", 3000);
            else
                this.ShowMsg("Error: zone empty", 3000);
        }
    }

    SelectGroup(id)
    {
        this.MultiSelectHelper(id, true);
    }

    SelectZone(id)
    {
        this.MultiSelectHelper(id, false);
    }

    SetGroupID(id)
    {
        for (var i = 0; i < selectedlights.length; ++i)
        {
            var light = this.FindLightByName(selectedlights[i]);
            light.userData.groupId = id;
        }
    }

    SetZoneID(id)
    {
        for (var i = 0; i < selectedlights.length; ++i)
        {
            var light = this.FindLightByName(selectedlights[i]);
            light.userData.zoneId = id;
        }
    }

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
            {
    			light.material.color.setHex(GREY);
            }
            else if (light.userData.status === STATUS.ON)
            {
                if (usegroupcolour)
                {
                    if (GroupColourArray.length > 0)
                        light.material.color.setHex(GroupColourArray[light.userData.groupId]);
                    else
                        light.material.color.setHex(LIGHTBLUE);
                }
                else
                {
                    if (ZoneColourArray.length > 0)
                        light.material.color.setHex(ZoneColourArray[light.userData.zoneId]);
                    else
                        light.material.color.setHex(LIGHTBLUE);
                }
            }
            else
            {
    			light.material.color.setHex(GREEN);
            }

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
                         "FW Version: " + find.userData.fwVersion + "<br/>" +
                         "Group: " + find.userData.groupId + "<br/>" +
                         "Zone: " + find.userData.zoneId + "<br/>" + 
    					 "Last Heard: " + find.userData.lastHeard + "<br/>" +
    					 "Last Status: " + laststatus + "<br/>" +
                         "PWM Level: " + find.userData.pwm + "<br/>" +
                         "MS Sensitivity: " + find.userData.msSens + "<br/>" +
                         "Sync Clock: " + find.userData.syncClock + "<br/>" +
                         "Max Brightness: " + find.userData.maxBrightness + "<br/>" +
                         "Dimmed Brightness: " + find.userData.dimmedBrightness + "<br/>" +
                         "MS Brightness: " + find.userData.msBrightness + "<br/>" +
                         "Hold Time: " + find.userData.holdTime + "<br/>" +
                         "Triggerers: " + find.userData.triggerers + "<br/>" +
                         "Triggerees: " + find.userData.triggerees;
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
                object.material.opacity = 0.3 + object.maxBrightness / 100 * 0.7;
                LightArray.push(object);
    		}
    		else if (object.isMesh)
    		{
                if (object.geometry.type === "PlaneBufferGeometry" || 
                    object.geometry.type === "PlaneGeometry")
                {
    				PlaneArray.push(object);
                }
                else if (object.geometry.type === "SphereBufferGeometry" || 
                         object.geometry.type === "SphereGeometry")
                {
                    ghost = object;
                }
            }
            // load colours
            else if (object.name === "colours")
            {
                GroupColourArray = object.userData.grouparray;
                ZoneColourArray = object.userData.zonearray;
            }
        });
    }

    UpdateTriggers()
    {
        for (var i = 0; i < LightArray.length; ++i)
        {
            for (var j = 0; j < LightArray[i].userData.triggerees.length; ++j)
            {
                this.DrawTriggerLine(LightArray[i].userData.key, LightArray[i].userData.triggerees[j]);
            }
        }
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
                scene = object;
    		});
    	}
    	else
    	{
    		console.log("failed to load data");
        }

        setTimeout(this.UpdateArrays, 1000);
        setTimeout(this.UpdateTriggers, 1200);
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

        scene.traverse(function(object)
        {
            if (object.name === "colours")
                object.userData = {grouparray: GroupColourArray, zonearray: ZoneColourArray};
        });

        for (var i = 0; i < TriggerLineArray.length; ++i)
            TriggerLineArray[i].parent.remove(TriggerLineArray[i]);

        TriggerLineArray = [];

        var save = scene.toJSON();
        saveData(save, filename.replace(/\..+$/, '') + ".json");
        
        this.UpdateTriggers();
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

        if (selectedlights.length > 0)
        {
            // light gui helpers
            if (ledstatus)
            {
                this.SetSelectedLightStatus(selectedlights, ledstatus);
                ledstatus = null;
            }

            if (changemaxbrightness)
            {
                for (var i = 0; i < selectedlights.length; ++i)
                    this.SetMaxBrightnessRequest(this.FindLightByName(selectedlights[i]).userData.key, 
                                                 currmaxbrightness);

                changemaxbrightness = null;
            }

            if (changedimmedbrightness)
            {
                for (var j = 0; i < selectedlights.length; ++j)
                    this.SetDimmedBrightnessRequest(this.FindLightByName(selectedlights[j]).userData.key, 
                                                    currdimmedbrightness);

                changedimmedbrightness = null;
            }

            if (changemsbrightness)
            {
                for (var k = 0; k < selectedlights.length; ++k)
                    this.SetMSBrightnessRequest(this.FindLightByName(selectedlights[k]).userData.key, 
                                                                    currmsbrightness);

                changemsbrightness = null;
            }

            if (changeholdtime)
            {
                for (var l = 0; l < selectedlights.length; ++l)
                    this.SetHoldTimeRequest(this.FindLightByName(selectedlights[l]).userData.key, currholdtime);

                changeholdtime = null;
            }

            if (changesyncclock)
            {
                for (var m = 0; m < selectedlights.length; ++m)
                    this.SetSyncClockRequest(this.FindLightByName(selectedlights[m]).userData.key, currsyncclock);

                changesyncclock = null;
            }

            if (changemssens)
            {
                for (var n = 0; n < selectedlights.length; ++n)
                    this.SetMSSensRequest(this.FindLightByName(selectedlights[n]).userData.key, currmssens);

                    changemssens = null;
            }

            if (firmwareupdate)
            {
                for (var o = 0; o < selectedlights.length; ++o)
                    this.FWUpdateRequest(this.FindLightByName(selectedlights[o]).userData.key);

                firmwareupdate = null;
            }

            if (resetkey)
            {
                this.ResetSelectedLightKeys(selectedlights);
                resetkey = null;
            }

            // uses selectedlights array to set id
            if (currgroupid)
            {
                this.SetGroupID(currgroupid);
                currgroupid = null;
            }

            if (currzoneid)
            {
                this.SetZoneID(currzoneid);
                currzoneid = null;
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
            if(lintersect !== intersects[0].object)
            {
                // select the intersected object
                lintersect = intersects[0].object;
                // onenter
                // check if light has been clicked on
                if (selectedlights.length > 0)
                {
                    // clear display
                    for (var p = 0; p < LightArray.length; ++p)
                    {
                        LightArray[p].userData.selected = false;
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
                        if (changetriggers)
                        {
                            this.AddTrigger(this.FindLightByName(selectedlights[0]).userData.key, 
                                            intersects[0].object.userData.key);
                        }
                        else
                        {
                            // if single selection
                            if (!selectedStart && selectedlights.length === 0)
                            {
                                // select this light
                                selectedlights = [intersects[0].object.userData.name];
                                this.MoveToLight(lintersect.userData.name);
                            }
                            lightgui.closed = false;
                            inputparams["SyncClock"] = intersects[0].object.userData.syncClock;
                            lightgui.show();
                        }
                    }
                }

                // removing
                if(Rmouseup)
                {
                    // check if in add mode
                    if(!textgui.closed)
                        this.RemoveLight(lintersect.userData.key);
                    else if (changetriggers)
                        this.RemoveTrigger(this.FindLightByName(selectedlights[0]).userData.key, 
                                           intersects[0].object.userData.key);
                }
            }
        }
        else
        {
            if(lintersect)
            {
                // onexit
                // clear display and outline if no light clicked
                if (selectedlights.length < 1 && !selectedStart)
                {
                    this.ClearDisplayLightData();
                    outlinePass.selectedObjects = [];
                }

                lintersect.userData.selected = false;
            }
            lintersect = null;
        }

        // plane
        if(!textgui.closed)
        {
            if(planeintersects.length > 0)
            {
                if (pintersect !== planeintersects[0].object)
                {
                    // select the intersected object
                    pintersect = planeintersects[0].object;
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
                if(pintersect)
                {
                    // onexit
                }
                pintersect = null;
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
                if (textgui.closed && (selectedlights.length > 0) && !selectedStart && !changetriggers)
                {
                    var tmp = this.FindLightByName(selectedlights[0]);
                    if(tmp)
                    {
                        tmp.userData.selected = false;
                        searchgui.closed = true;
                        searchgui.hide();
                        selectedlights = [];
                        this.ClearDisplayLightData();
                        outlinePass.selectedObjects = [];
                    }
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
                    if (!changetriggers)
                    {
                        searchgui.closed = true;
                        inputparams["EditTriggers"] = false;
                        lightgui.closed = true;
                        colourgui.closed = true;
                        searchgui.hide();
                        lightgui.hide();
                        colourgui.hide();
                    }
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
            case "KeyR":
                if (this.AnyGUIOpen() === false)
                    this.ResetCamera();
                break;
            case "KeyA":
                if (selectedlights.length === 1)
                    this.Activate(this.FindLightByName(selectedlights[0]).userData.key);
                break;
            case "KeyT":
                if (this.AnyGUIOpen() === false)
                    this.ToggleTriggerLines();
                break;
            case "KeyG":
                if (this.AnyGUIOpen() === false)
                {
                    usegroupcolour = !usegroupcolour;
                    colourparams["GroupColour"] = usegroupcolour;
                    colourparams["ZoneColour"] = !usegroupcolour;
                }
                break;
            case "KeyC":
                if (this.AnyGUIOpen() === false)
                {
                    colourgui.closed = false;
                    colourgui.show();
                }
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
                    this.SelectGroup(1);
                break;
            case "Digit2":
                if (this.AnyGUIOpen() === false)
                    this.SelectGroup(2);
                break;
            case "Digit3":
                if (this.AnyGUIOpen() === false)
                    this.SelectZone(1);
                break;
            case "Digit4":
               if (this.AnyGUIOpen() === false)
                   this.SelectZone(2);
               break;
            case "Digit5":
             if (this.AnyGUIOpen() === false)
                 this.SelectGroup(255);
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