//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useEffect} from "react";

import ConfigMotionSensor from "../components/ConfigMotionSensor";
import ConfigSettings from "../components/ConfigSettings";
import ConfigSchedule from "../components/ConfigSchedule";

function DashboardConfig(props)
{
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
                lights = {props.light}    
            />
            <ConfigSettings 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.light}    
            />
            <ConfigSchedule 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.light}    
            />
        </div>
    );
}

export default DashboardConfig;