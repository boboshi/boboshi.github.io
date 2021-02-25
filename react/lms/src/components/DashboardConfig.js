//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useState, useEffect} from "react";

import ConfigMotionSensor from "./ConfigMotionSensor";
import ConfigSettings from "./ConfigSettings";
import ConfigSchedule from ".//ConfigSchedule";
import ConfigBrightness from "./ConfigBrightness";
import ConfigCalendar from "./ConfigCalendar";

function DashboardConfig(props)
{
    const [motionDetection, setMotionDetection] = useState("ON");
    const [motionSensitivity, setMotionSensitivity] = useState("");
    const [sync, setSync] = useState("ON");
    const [intensity, setIntensity] = useState("");
    const [holdTime, setHoldTime] = useState("");
    const [holdTimeUnits, setHoldTimeUnits] = useState("");
    const [dimmedBrightness, setDimmedBrightness] = useState(0.7);
    const [motionBrightness, setMotionBrightness] = useState(0.7);
    const [maxBrightness, setMaxBrightness] = useState(0.7);

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

    function placeholder()
    {
        console.log("Lights not selected");
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
            <ConfigCalendar

            />
            {/* buttons */}
            <div 
                className = "dashboard-page-config-cancel" 
                onClick = {props.cancel}
            >
                CANCEL
            </div>
            <div
                className = "dashboard-page-config-submit" 
                onClick = {props.lights ? handleSubmitButton : placeholder}
            >
                SUBMIT
            </div>
        </div>
    );
}

export default DashboardConfig;