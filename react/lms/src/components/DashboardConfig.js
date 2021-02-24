//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useState, useEffect} from "react";

import ConfigMotionSensor from "./ConfigMotionSensor";
import ConfigSettings from "./ConfigSettings";
import ConfigSchedule from ".//ConfigSchedule";
import ConfigBrightness from "./ConfigBrightness";

function DashboardConfig(props)
{
    const [motionDetection, setMotionDetection] = useState("ON");
    const [motionSensitivity, setMotionSensitivity] = useState("");
    const [sync, setSync] = useState("ON");
    const [intensity, setIntensity] = useState("");
    const [holdTime, setHoldTime] = useState("");
    const [holdTimeUnits, setHoldTimeUnits] = useState("");
    const [dimmedBrightness, setDimmedBrightness] = useState(70);
    const [motionBrightness, setMotionBrightness] = useState(70);
    const [maxBrightness, setMaxBrightness] = useState(70);

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleSubmitButton()
    {
        console.log("motion detection: " + motionDetection);
        console.log("motion sensitivity: " + motionSensitivity);
        console.log("clock sync: " + sync);
        console.log("light intensity: " + intensity);
        console.log("hold time: " + holdTime + " " + holdTimeUnits);
    }

    return(
        <div className = "dashboard-page-config">
            <ConfigMotionSensor 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
                motionDetection = {motionDetection}
                motionSensitivity = {motionSensitivity}
                setMD = {setMotionDetection}
                setMS = {setMotionSensitivity}    
            />
            <ConfigSettings 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
                sync = {sync}
                setSync = {setSync}
                setIntensity = {setIntensity}
                setHoldTime = {setHoldTime}
                setHoldTimeUnits = {setHoldTimeUnits}  
            />
            <ConfigSchedule 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
            />
            <ConfigBrightness
                lights = {props.lights}
                dimmedBrightness = {dimmedBrightness}
                motionBrightness = {motionBrightness}
                maxBrightness = {maxBrightness}
                setDimmed = {setDimmedBrightness}
                setMotion = {setMotionBrightness}
                setMax = {setMaxBrightness}
            />
        </div>
    );
}

export default DashboardConfig;