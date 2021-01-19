// imports
import React, { Component } from "react";
import LMSUtility from "./LMSUtility.js";
import MQTTClient from "./MQTTClient.js";
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
    currmsbrightness, currholdtime, currmssens, currsyncclock, currcolourid, currscheduling;
var ledstatus, resetkey, firmwareupdate, changemaxbrightness, changedimmedbrightness, 
    changemsbrightness, changeholdtime, changemssens, changesyncclock, changetriggers,
    changescheduling;
var usegroupcolour = true;
var currname = "";
var GroupColourArray = [];
var ZoneColourArray = [];
var TriggerColour;
var TriggerLineArray = [];
// mqtt
var mqttClient;

const MSSENS = {"Low": 1, "Medium-Low": 2, "Medium": 3, "Medium-High": 4, "High": 5};

// colour
const WHITE = 0xFFFFFF;
//const RED = 0xFF0000;
//const GREEN = 0x00FF00;
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
        controls.maxPolarAngle = LMSUtility.Rad(86);
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
	    text.style.height = "510px";
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
        var offbutton = {Off:function(){ledstatus = "Force_Off";}};
        var onbutton = {On:function(){ledstatus = "Force_On";}};
        var normalbutton = {Normal:function(){ledstatus = "Normal"}};
        inputparams = {"MaxBrightness": "100",
                       "DimmedBrightness": "100",
                       "MSBrightness": "100",
                       "HoldTime": "0",
                       "SyncClock": true,
                       "Scheduling": true,
                       "MSSensitivity": "Medium",
                       "GroupID": "",
                       "ZoneID": "",
                       "EditTriggers": false};
        var firmwarebutton = {FirmwareUpdate:function(){firmwareupdate = true;}};
        var resetkeybutton = {ResetKey:function(){resetkey = true;}};

        lightgui.add(offbutton, "Off");
        lightgui.add(onbutton, "On");
        lightgui.add(normalbutton, "Normal");
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
        lightgui.add(inputparams, "SyncClock").listen().onFinishChange(function(value)
                                                                      {
                                                                          if(value)
                                                                              currsyncclock = "Enable";
                                                                          else
                                                                              currsyncclock = "Disable";
                                                                          changesyncclock = true;
                                                                        });
        lightgui.add(inputparams, "Scheduling").listen().onFinishChange(function(value)
                                                                        {
                                                                            if(value)
                                                                                currscheduling = "Enable";
                                                                            else
                                                                                currscheduling = "Disable";
                                                                            changescheduling = true;
                                                                          });
        lightgui.add(inputparams, "MSSensitivity", ["Low", "Medium-Low", "Medium", "Medium-High", "High"]).listen()
                                                        .onFinishChange(function(value){currmssens = MSSENS[value];
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
        var palette = {colour: "#7EC0EE"};
        var triggerpalette = {triggercolour: "#FF0000"};
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
        colourgui.addColor(palette, "colour").onChange(function(value)
            {
                if (currcolourid >= 0 && currcolourid <= 255)
                {
                    var str = "0x" + value.slice(1, 7);
                    
                    if (usegroupcolour)
                        GroupColourArray[currcolourid] = parseInt(str);
                    else
                        ZoneColourArray[currcolourid] = parseInt(str);
                }
            });
        colourgui.addColor(triggerpalette, "triggercolour").onChange(function(value)
        {
            var str = "0x" + value.slice(1, 7);
            TriggerColour = str;
            for (var i = 0; i < TriggerLineArray.length; ++i)
            {
                TriggerLineArray[i].children[0].material.color.setHex(TriggerColour);
                TriggerLineArray[i].children[1].material.color.setHex(TriggerColour);
            }
        });
        colourgui.closed = true;
        colourgui.hide();
    }

    InitMQTT()
    {
        mqttClient = new MQTTClient("ec2-18-136-44-143.ap-southeast-1.compute.amazonaws.com", 
                                    8080, "clientId");
        //mqttClient = new MQTTClient("broker.hivemq.com", 8000, "clientId");
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
        LMSUtility.SetKey(oldkey, newkey, LightArray);
    }

    ResetKeyRequest(key)
    {
        console.log("Sent reset key request: key: " + key);
        this.ResetKeyResponse(key, key);
    }

    ResetKeyResponse(oldkey, newkey)
    {
        console.log("Received reset key response: oldkey: " + oldkey + " newkey: " + newkey);
        LMSUtility.SetKey(oldkey, newkey, LightArray);
    }

    LEDStatusRequest(key, mode)
    {
        console.log("Sent LED " + mode + " request: key: " + key);

        var json = mqttClient.CreateMessage("Frontend", key, "setLightingOverride", "Set");
        json.Parameters.LightingControl = mode;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.LEDStatusResponse(key, mode);
    }

    LEDStatusResponse(key, mode)
    {
        console.log("Received LED " + mode + " response: key: " + key);
        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.status = mode;
    }

    SetBrightnessRequest(key, brightness, mode)
    {
        console.log("Sent Set " + mode + " request: key: " + key);

        var event = "set" + mode;
        var json = mqttClient.CreateMessage("Frontend", key, event, "Set");
        
        if (mode === "BrightLevel")
            json.Parameters.BrightLevel = brightness;
        else if (mode === "DimLevel")
            json.Parameters.DimLevel = brightness;
        else
            json.Parameters.MotionLevel = brightness;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetBrightnessResponse(key, brightness, mode);
    }

    SetBrightnessResponse(key, brightness, mode)
    {
        console.log("Received Set " + mode + " response: key: " + key);

        if (brightness < 0 || brightness > 100)
            this.ShowMsg("Error: invalid brightness", 3000);
        else
            LMSUtility.SetBrightness(key, brightness, mode, LightArray);
    }

    SetMSSensRequest(key, sens)
    {
        console.log("Sent Set MotionSensitivity request: key: " + key + " MotionSensitivity: " + sens);
        
        var json = mqttClient.CreateMessage("Frontend", key, "setMotionSensitivity", "Set");
        json.Parameters.MotionSensitivity = sens;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetMSSensResponse(key, sens);
    }

    SetMSSensResponse(key, sens)
    {
        console.log("Received Set MotionSensitivity response: key: " + key + " MotionSensitivity: " + sens);

        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.MotionSensitivity = sens;
    }

    SetSyncClockRequest(key, sync)
    {
        console.log("Sent Set Sync Clock request: key: " + key + " sync: " + sync);

        var json = mqttClient.CreateMessage("Frontend", key, "setClockSync", "Set");
        json.Parameters.ClockSync = sync;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetSyncClockResponse(key, sync);
    }

    SetSyncClockResponse(key, sync)
    {
        console.log("Received Set Sync Clock response: key: " + key + " sync: " + sync);

        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.ClockSync = sync;
    }

    SetSchedulingRequest(key, scheduling)
    {
        console.log("Sent Set Scheduling request: key: " + key + " scheduling: " + scheduling);

        var json = mqttClient.CreateMessage("Frontend", key, "setScheduling", "Set");
        json.Parameters.Scheduling = scheduling;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetSchedulingResponse(key, scheduling);
    }

    SetSchedulingResponse(key, scheduling)
    {
        console.log("Received Set Scheduling response: key: " + key + " scheduling: " + scheduling);

        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.Scheduling = scheduling;
    }

    SetHoldTimeRequest(key, time)
    {
        console.log("Sent Set Hold Time request: key: " + key + " time: " + time);
        
        var json = mqttClient.CreateMessage("Frontend", key, "setHoldTime", "Set");
        json.Parameters.HoldTime = time;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetHoldTimeResponse(key, time);
    }

    SetHoldTimeResponse(key, time)
    {
        console.log("Received Set Hold Time response: key: " + key + " time: " + time);

        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.HoldTime = time;
    }

    FWUpdateRequest(key)
    {
        console.log("Sent Firmware Update request: key: " + key);
        this.FWUpdateResponse(key);
    }

    FWUpdateResponse(key)
    {
        console.log("Received Firmware Update response: key: " + key);
        var find = LMSUtility.FindLightByKey(key, LightArray);

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
            setTimeout(LMSUtility.SetFWVersion, 1000, key, "2.0", LightArray);
            setTimeout(loo, 2000);
        }
    }

    SetGroupRequest(key, group)
    {
        console.log("Sent Set Group request: key: " + key + " group: " + group);

        var json = mqttClient.CreateMessage("Frontend", key, "setGroup", "Set");
        json.Parameters.GroupId = group;

        mqttClient.SendMessage(JSON.stringify(json), "mup");
        this.SetGroupResponse(key, group);
    }

    SetGroupResponse(key, group)
    {
        console.log("Received Set Group response: key: " + key + " group: " + group);

        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.GroupId = group;
    }

    SetZoneRequest(key, zone)
    {
        console.log("Sent Set Zone request: key: " + key + " zone: " + zone);

        var json = mqttClient.CreateMessage("Frontend", key, "setZone", "Set");
        json.Parameters.ZoneId = zone;

        mqttClient.SendMessage(JSON.stringify(json), "mup");

        this.SetZoneResponse(key, zone);
    }

    SetZoneResponse(key, zone)
    {
        console.log("Received Set Zone response: key: " + key + " zone: " + zone);
        
        var find = LMSUtility.FindLightByKey(key, LightArray);
        if (find)
            find.userData.ZoneId = zone;
    }
    //===================================================================================



    // triggers =========================================================================
    // sample activation is just turning it on for now
    DrawTriggerLine(key, triggereekey)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);
        var findtrig = LMSUtility.FindLightByKey(triggereekey, LightArray);

        var start = new THREE.Vector3(find.position.x, find.position.y + 0.2, find.position.z);
        var end = new THREE.Vector3(findtrig.position.x, findtrig.position.y + 0.2, findtrig.position.z);

        var length = start.distanceTo(end);
        var dir = new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
        dir.normalize();
        const arrow = new THREE.ArrowHelper(dir, start, length, parseInt(TriggerColour), 0.5);
        arrow.userData = {triggererkey: key, triggereekey: triggereekey};

        TriggerLineArray.push(arrow);
        scene.add(arrow);
    }

    Activate(key)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);
        console.log(key + " activated");

        find.userData.status = "Force_On";

        for (var i = 0; i < find.userData.Triggerees.length; ++i)
        {
            var triggeree = find.userData.Triggerees[i];
            var obj = LMSUtility.FindLightByKey(triggeree, LightArray);
            this.Trigger(obj.userData.key, key);
        }
    }

    Trigger(key, trigger)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);
        
        find.userData.status ="Force_On";
        console.log(key + " triggered by " + trigger);
    }

    OverrideTrigger(key, triggereekeys)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);

        for (var i = 0; i < find.userData.Triggerees.length; ++i)
        {
            var findtrig = LMSUtility.FindLightByKey(find.userData.Triggerees[i], LightArray);
            var triggererindex = findtrig.userData.Triggerers.indexOf(key);

            if (triggererindex === -1)
            {
                this.ShowMsg("Error: Trigger does not exist", 3000);
                return;
            }

            LMSUtility.RemoveTriggerLine(key, find.userData.Triggerees[i], TriggerLineArray);
            findtrig.userData.Triggerers.splice(triggererindex, 1);
        }

        find.userData.Triggerees.length = 0;

        for (var j = 0; j < triggereekeys.length; ++j)
        {
            var t = triggereekeys[j];
            var findtrig0 = LMSUtility.FindLightByKey(t, LightArray);

            this.DrawTriggerLine(key, t);
            this.ShowMsg("Trigger added", 3000);
            find.userData.Triggerees.push(t);
            findtrig0.userData.Triggerers.push(key);

            var json0 = mqttClient.CreateMessage("Frontend", t, "addTriggerers", "Set");
            json0.Parameters.Triggerers = [key];
            mqttClient.SendMessage(JSON.stringify(json0), "mup");
        }

        var json = mqttClient.CreateMessage("Frontend", key, "overrideTriggerees", "Set");
        json.Parameters.Triggerees = triggereekeys;
        mqttClient.SendMessage(JSON.stringify(json), "mup");
    }

    AddTrigger(key, triggereekeys)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);

        for (var i = 0; i < triggereekeys.length; ++i)
        {
            var t = triggereekeys[i];

            if (key === t)
            {
                this.ShowMsg("Error: Light cannot add itself as trigger", 3000);
                return;
            }
            if (find.userData.Triggerees.includes(t))
            {
                this.ShowMsg("Error: Trigger already exists", 3000);
                return;
            }

            var findtrig = LMSUtility.FindLightByKey(t, LightArray);

            this.DrawTriggerLine(key, t);
            this.ShowMsg("Trigger added", 3000);
            find.userData.Triggerees.push(t);
            findtrig.userData.Triggerers.push(key);

            var json0 = mqttClient.CreateMessage("Frontend", t, "addTriggerers", "Set");
            json0.Parameters.Triggerers = [key];
            mqttClient.SendMessage(JSON.stringify(json0), "mup");
        }

        var json = mqttClient.CreateMessage("Frontend", key, "addTriggerees", "Set");
        json.Parameters.Triggerees = triggereekeys;
        mqttClient.SendMessage(JSON.stringify(json), "mup");
    }

    RemoveTrigger(key, triggereekeys)
    {
        var find = LMSUtility.FindLightByKey(key, LightArray);

        for (var i = 0; i < triggereekeys.length; ++i)
        {
            var t = triggereekeys[i];
            var findtrig = LMSUtility.FindLightByKey(t, LightArray);
            var triggereeindex = find.userData.Triggerees.indexOf(t);
            var triggererindex = findtrig.userData.Triggerers.indexOf(key);

            if (triggereeindex === -1)
            {
                this.ShowMsg("Error: Trigger does not exist", 3000);
                return;
            }

            LMSUtility.RemoveTriggerLine(key, t, TriggerLineArray);

            this.ShowMsg("Trigger removed", 3000);
            find.userData.Triggerees.splice(triggereeindex, 1);
            findtrig.userData.Triggerers.splice(triggererindex, 1);

            var json0 = mqttClient.CreateMessage("Frontend", key, "removeTriggerers", "Set");
            json0.Parameters.Triggerers = [key];
            mqttClient.SendMessage(JSON.stringify(json0), "mup");
        }

        var json = mqttClient.CreateMessage("Frontend", key, "removeTriggerees", "Set");
        json.Parameters.Triggerees = triggereekeys;
        mqttClient.SendMessage(JSON.stringify(json), "mup");
    }
    //===================================================================================



    // helper functions =================================================================
    ShowMsg(message, time)
    {
        console.log(message);
        msg.innerHTML = message;
        setTimeout(this.ClearMsg, time);
    }

    SearchGUIHelper(value)
    {
        // find and select light
    	var light = LMSUtility.FindLightByName(value, LightArray);
    	// deselect any current lights
    	selectedlights = [];
    	this.ClearDisplayLightData();
    	outlinePass.selectedObjects = [];
    	// select light
    	if (light)
    	{
    		selectedlights = [light.userData.name];
    		LMSUtility.MoveToLight(light.userData.name, controls, camera, outlinePass, LightArray);
            lightgui.closed = false;
            if (light.userData.ClockSync === "Enable")
                inputparams["SyncClock"] = true;
            else
                inputparams["SyncClock"] = false;
            if (light.userData.Scheduling === "Enable")
                inputparams["Scheduling"] = true;
            else
                inputparams["Scheduling"] = false;
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
    
    AddLight(name, pos)
    {
        // default public key is 0
        this.ProvisionRequest(name, 0, pos);
    }

    AddLightHelper(name, key, pos)
    {
    	// init mesh and data
    	const lightmesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ({color:GREY}));
        
        LMSUtility.CreateLight(lightmesh, name, key, pos);
    
    	// add mesh to array (for raycasting/picking)
    	LightArray.push(lightmesh);
    
    	// add mesh to scene (for rendering)
    	scene.add(lightmesh);
    
    	return lightmesh;
    }

    // removing light objects from the scene
    RemoveLight(key)
    {
        this.RemoveRequest(key);
    }
    RemoveLightHelper(key)
    {
        // remove existing triggerers and triggerees
       var find = LMSUtility.FindLightByKey(key, LightArray);
        for (var i = 0; i < find.userData.Triggerers; ++i)
            this.RemoveTrigger(find.userData.Triggerers[i], [key]);

        for (var j = 0; j < find.userData.Triggerees; ++i)
            this.RemoveTrigger(key, [find.userData.Triggerees[j]]);

    	// find and remove light from LightArray
    	var index = LightArray.findIndex(light => light.userData.key === key);
        
    	// find and remove object from scene
    	LightArray[index].parent.remove(LightArray[index]);
    
    	if(index !== -1)
    		LightArray.splice(index, 1);
    }

    // setting light status
    SetSelectedLightStatus(selected, status)
    {
    	for (var i = 0; i < selected.length; ++i)
    	{
            var find = LMSUtility.FindLightByName(selected[i], LightArray);
            
    		if (find)
                this.LEDStatusRequest(find.userData.key, status);
    	}
    }
    // reset keys
    ResetSelectedLightKeys(selected)
    {
        for (var i = 0; i < selected.length; ++i)
    	{
            var find = LMSUtility.FindLightByName(selected[i], LightArray);
            
    		if (find)
                this.ResetKeyRequest(find.userData.key);
    	}
    }

    // mode - true for group, false for zone
    MultiSelectHelper(id, mode)
    {
        var found = LMSUtility.MultiSelect(id, mode, outlinePass, selectedlights, LightArray)

        if (found)
        {
            searchgui.closed = true;
            lightgui.closed = false;
            searchgui.hide();
            lightgui.show();
        }
        else
        {
            var str = mode ? "group" : "zone";
            this.ShowMsg("Error: " + str + " empty", 3000);
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

    LightArrayUpdate()
    {
    	// only display data of selected light on screen
    	var foundselected = false;
    	// loop through all lights and update data accordingly
    	for (var i = 0; i < LightArray.length; ++i)
    	{
    		var light = LightArray[i];

            // data updates (get from server)
            // PLACEHOLDERFUNC(light, serverdataforlight);

            // visual/front-end updates
    		// status display (off/on/normal)
            if (light.userData.status === "Force_Off")
            {
    			light.material.color.setHex(GREY);
            }
            else
            {
                if (usegroupcolour)
                {
                    if (GroupColourArray.length > 0)
                        light.material.color.setHex(GroupColourArray[light.userData.GroupId]);
                    else
                        light.material.color.setHex(LIGHTBLUE);
                }
                else
                {
                    if (ZoneColourArray.length > 0)
                        light.material.color.setHex(ZoneColourArray[light.userData.ZoneId]);
                    else
                        light.material.color.setHex(LIGHTBLUE);
                }
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
        var find = LMSUtility.FindLightByName(name, LightArray);
        var sens = Object.keys(MSSENS).find(key => MSSENS[key] === find.userData.MotionSensitivity);
    	// <br/> is a newline
        text.innerHTML = "Name: " + find.userData.name + "<br/>" +
                         "Key: " + find.userData.key + "<br/>" +
                         "FW Version: " + find.userData.FWVersion + "<br/>" +
                         "Group: " + find.userData.GroupId + "<br/>" +
                         "Zone: " + find.userData.ZoneId + "<br/>" + 
    					 "Last Heard: " + find.userData.lastHeard + "<br/>" +
    					 "Last Status: " + find.userData.status + "<br/>" +
                         "PWM Level: " + find.userData.pwm + "<br/>" +
                         "MotionSensing: " + find.userData.MotionSensing + "<br/>" +
                         "MS Sensitivity: " + sens + "<br/>" +
                         "Sync Clock: " + find.userData.ClockSync + "<br/>" +
                         "Scheduling: " + find.userData.Scheduling + "<br/>" +
                         "Light Intensity: " + find.userData.LightIntensity + "<br/>" +
                         "Max Brightness: " + find.userData.BrightLevel + "<br/>" +
                         "Dimmed Brightness: " + find.userData.DimLevel + "<br/>" +
                         "MS Brightness: " + find.userData.MotionLevel + "<br/>" +
                         "Hold Time: " + find.userData.HoldTime + "<br/>" +
                         "Photosensor Group: " + find.userData.PhotosensorGroup + "<br/>" +
                         "Bright Group: " + find.userData.BrightGroup + "<br/>" +
                         "Triggerers: " + find.userData.Triggerers + "<br/>" +
                         "Triggerees: " + find.userData.Triggerees;
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
                object.material.opacity = 0.3 + object.BrightLevel / 100 * 0.7;
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
                GroupColourArray = object.userData.groupArray;
                ZoneColourArray = object.userData.zoneArray;
                TriggerColour = object.userData.triggerColour;
            }
        });
    }

    UpdateTriggers()
    {
        for (var i = 0; i < LightArray.length; ++i)
            for (var j = 0; j < LightArray[i].userData.Triggerees.length; ++j)
                this.DrawTriggerLine(LightArray[i].userData.key, LightArray[i].userData.Triggerees[j]);
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
                object.userData = {groupArray: GroupColourArray, zoneArray: ZoneColourArray,
                                   triggerColour: TriggerColour};
        });

        for (var i = 0; i < TriggerLineArray.length; ++i)
            TriggerLineArray[i].parent.remove(TriggerLineArray[i]);

        TriggerLineArray = [];

        var save = scene.toJSON();
        saveData(save, filename.replace(/\..+$/, '') + ".json");
        
        this.UpdateTriggers();
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
        this.InitMQTT();

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
                    this.SetBrightnessRequest(LMSUtility.FindLightByName(selectedlights[i], LightArray).userData.key, 
                                                                         currmaxbrightness, "BrightLevel");
                changemaxbrightness = null;
            }

            if (changedimmedbrightness)
            {
                for (var j = 0; j < selectedlights.length; ++j)
                    this.SetBrightnessRequest(LMSUtility.FindLightByName(selectedlights[j], LightArray).userData.key, 
                                                                         currdimmedbrightness, "DimLevel");
                changedimmedbrightness = null;
            }

            if (changemsbrightness)
            {
                for (var k = 0; k < selectedlights.length; ++k)
                    this.SetBrightnessRequest(LMSUtility.FindLightByName(selectedlights[k], LightArray).userData.key, 
                                                                         currmsbrightness, "MotionLevel");
                changemsbrightness = null;
            }

            if (changeholdtime)
            {
                for (var l = 0; l < selectedlights.length; ++l)
                    this.SetHoldTimeRequest(LMSUtility.FindLightByName(selectedlights[l], LightArray).userData.key, currholdtime);
                changeholdtime = null;
            }

            if (changesyncclock)
            {
                for (var m = 0; m < selectedlights.length; ++m)
                    this.SetSyncClockRequest(LMSUtility.FindLightByName(selectedlights[m], LightArray).userData.key, currsyncclock);
                changesyncclock = null;
            }

            if (changescheduling)
            {
                for (var n = 0; n < selectedlights.length; ++n)
                    this.SetSchedulingRequest(LMSUtility.FindLightByName(selectedlights[n], LightArray).userData.key, currscheduling);
                changescheduling = null;
            }

            if (changemssens)
            {
                for (var o = 0; o < selectedlights.length; ++o)
                    this.SetMSSensRequest(LMSUtility.FindLightByName(selectedlights[o], LightArray).userData.key, currmssens);
                changemssens = null;
            }

            if (firmwareupdate)
            {
                for (var p = 0; p < selectedlights.length; ++p)
                    this.FWUpdateRequest(LMSUtility.FindLightByName(selectedlights[p], LightArray).userData.key);
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
                for (var q = 0; q < selectedlights.length; ++q)
                    this.SetGroupRequest(LMSUtility.FindLightByName(selectedlights[q], LightArray).userData.key, currgroupid);
                currgroupid = null;
            }

            if (currzoneid)
            {
                for (var r = 0; r < selectedlights.length; ++r)
                    this.SetZoneRequest(LMSUtility.FindLightByName(selectedlights[r], LightArray).userData.key, currzoneid);
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
                    for (var s = 0; s < LightArray.length; ++s)
                        LightArray[s].userData.selected = false;
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
                            this.AddTrigger(LMSUtility.FindLightByName(selectedlights[0], LightArray).userData.key, 
                                            [intersects[0].object.userData.key]);
                        }
                        else
                        {
                            // if single selection
                            if (!selectedStart && selectedlights.length === 0)
                            {
                                // select this light
                                selectedlights = [intersects[0].object.userData.name];
                                LMSUtility.MoveToLight(lintersect.userData.name, controls, camera, outlinePass, LightArray);
                            }
                            lightgui.closed = false;
                            if (intersects[0].object.userData.ClockSync === "Enable")
                                inputparams["SyncClock"] = true;
                            else
                                inputparams["SyncClock"] = false;
                            if (intersects[0].object.userData.Scheduling === "Enable")
                                inputparams["Scheduling"] = true;
                            else
                                inputparams["Scheduling"] = false;
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
                        this.RemoveTrigger(LMSUtility.FindLightByName(selectedlights[0], LightArray).userData.key, 
                                           [intersects[0].object.userData.key]);
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
                    var tmp = LMSUtility.FindLightByName(selectedlights[0], LightArray);
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
                LMSUtility.ResetCamera(controls, camera);
                break;
            case "KeyA":
                if (selectedlights.length === 1)
                    this.Activate(LMSUtility.FindLightByName(selectedlights[0], LightArray).userData.key);
                break;
            case "KeyT":
                if (this.AnyGUIOpen() === false)
                    LMSUtility.ToggleTriggerLines(TriggerLineArray);
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