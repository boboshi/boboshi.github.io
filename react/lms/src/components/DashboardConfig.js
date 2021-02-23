//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useState, useEffect} from "react";

import ConfigMotionSensor from "../components/ConfigMotionSensor";
import ConfigSettings from "../components/ConfigSettings";
import ConfigSchedule from "../components/ConfigSchedule";

function DashboardConfig(props)
{
    const [motionSensitivity, setMotionSensitivity] = useState("");

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