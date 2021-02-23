//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useState, useEffect} from "react";

import ConfigMotionSensor from "../components/ConfigMotionSensor";
import ConfigSettings from "../components/ConfigSettings";
import ConfigSchedule from "../components/ConfigSchedule";

function DashboardConfig(props)
{
    const [motionSensitivity, setMotionSensitivity] = useState("");
    const [sync, setSync] = useState("ON");
    const [intensity, setIntensity] = useState("");
    const [holdTime, setHoldTime] = useState("");
    const [holdTimeUnits, setHoldTimeUnits] = useState("");

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    return(
        <div className = "dashboard-page-config">
            <ConfigMotionSensor 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
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
        </div>
    );
}

export default DashboardConfig;