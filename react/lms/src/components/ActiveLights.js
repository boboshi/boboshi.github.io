import React, {useState, useEffect} from "react";

import MotionIcon from "../resources/dashboard/MotionSensor-icon-GY.svg";
import ActiveLightsHeader from "../resources/dashboard/activelights header.svg";
import ActiveRefreshIcon from "../resources/dashboard/Icon ionic-md-refresh(active).svg";
import ActiveInfoIcon from "../resources/dashboard/Icon ionic-md-refresh(active).svg";

function ActiveLights(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    function handleActiveRefresh()
    {
        console.log("active refresh");
    }

    function handleActiveInfo()
    {
        console.log("active info");
    }

    return(
        <div className = "dashboard-page-view-activelights-container">
            <img alt = "" src = {MotionIcon} className = "dashboard-page-view-activelights-icon"></img>
            <img 
                alt = "" 
                src = {ActiveRefreshIcon} 
                className = "dashboard-page-view-header-refresh"
                onClick = {handleActiveRefresh}
            ></img>
            <div className = "dashboard-page-view-activelights-header-divider"></div>
            <img 
                alt = "" 
                src = {ActiveInfoIcon} 
                className = "dashboard-page-view-header-info"
                onClick = {handleActiveInfo}
            ></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-headertop-text">MOST ACTIVE LIGHT(S)</h1>
                <img alt = "" src = {ActiveLightsHeader} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default ActiveLights;