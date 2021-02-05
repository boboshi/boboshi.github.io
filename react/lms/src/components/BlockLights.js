import React, {useState, useEffect} from "react";

import LightIcon from "../resources/dashboard/Icon awesome-lightbulb.svg";
import BlockLightsHeader from "../resources/dashboard/blocklights header.svg";
import BlockRefreshIcon from "../resources/dashboard/Icon ionic-md-refresh(block).svg";
import BlockInfoIcon from "../resources/dashboard/Icon ionic-md-refresh(block).svg";

function BlockLights(props)
{
    const [totalLights, setTotalLights] = useState(null);
    const [lightsOn, setLightsOn] = useState(null);
    const [lightsOff, setLightsOff] = useState(null);
    const [lightsDimmed, setLightsDimmed] = useState(null);
    const [lightFaults, setLightFaults] = useState(null);

    useEffect(() =>
    {
        // simulate getting data
        setTotalLights(100);
        setLightsOn(50);
        setLightsOff(10);
        setLightsDimmed(40);
        setLightFaults(3);
    }, []);

    function handleBlockRefresh()
    {
        console.log("block refresh");
    }

    function handleBlockInfo()
    {
        console.log("block info");
    }

    return(
        <div className = "dashboard-page-view-blocklights-container">
            <img alt = "" src = {LightIcon} className = "dashboard-page-view-block-icon"></img>
            <img 
                alt = "" 
                src = {BlockRefreshIcon} 
                className = "dashboard-page-view-header-refresh"
                onClick = {handleBlockRefresh}
            ></img>
            <div className = "dashboard-page-view-blocklights-header-divider"></div>
            <img 
                alt = "" 
                src = {BlockInfoIcon} 
                className = "dashboard-page-view-header-info"
                onClick = {handleBlockInfo}
            ></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-headertop-text">LIGHTS IN THIS BLOCK</h1>
                <img alt = "" src = {BlockLightsHeader} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
            <br/><br/><br/><br/>
            TOTAL LIGHTS: {totalLights} <br/>
            LIGHTS ON: {lightsOn} <br/>
            LIGHTS OFF: {lightsOff} <br/>
            LIGHTS DIMMED: {lightsDimmed} <br/>
            LIGHTS FAULTS: {lightFaults}
        </div>
    );
}

export default BlockLights;