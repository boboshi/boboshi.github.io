import React, {useState, useEffect} from "react";

import LightIcon from "../resources/dashboard/Icon awesome-lightbulb.svg";
import BlockLightsHeader from "../resources/dashboard/blocklights header.svg";
import BlockRefreshIcon from "../resources/dashboard/Icon ionic-md-refresh(block).svg";
import BlockInfoIcon from "../resources/dashboard/Group 52718.svg";
import WarningIcon from "../resources/dashboard/Icon ionic-ios-warning.svg";
import OnIcon from "../resources/dashboard/Icon material-lightbulb-outline.svg";
import OffIcon from "../resources/dashboard/Icon material-lightbulb-filled.svg";
import DimIcon from "../resources/dashboard/Group 2403.svg";

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
        setTotalLights(800000);
        setLightFaults(40);
        setLightsOn(80000);
        setLightsOff(1000);
        setLightsDimmed(7000);
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
            {/* dividing lines */}
            <div className = "dashboard-page-view-blocklights-divider0"></div>
            <div className = "dashboard-page-view-blocklights-divider1"></div>
            <div className = "dashboard-page-view-blocklights-divider2"></div>
            {/* section labels */}
            <h1 className = "dashboard-page-view-blocklights-text-numlights">Total no. of Lights</h1>
            <h1 className = "dashboard-page-view-blocklights-text-faults">Lights Fault(s)</h1>
            <h1 className = "dashboard-page-view-blocklights-text-on">Turned On</h1>
            <h1 className = "dashboard-page-view-blocklights-text-off">Turned OFF</h1>
            <h1 className = "dashboard-page-view-blocklights-text-dimmed">Dimmed</h1>
            {/* section label icons */}
            <img alt = "" src = {WarningIcon} className = "dashboard-page-view-blocklights-icon-faults"></img>
            <img alt = "" src = {OnIcon} className = "dashboard-page-view-blocklights-icon-on"></img>
            <img alt = "" src = {OffIcon} className = "dashboard-page-view-blocklights-icon-off"></img>
            <img alt = "" src = {DimIcon} className = "dashboard-page-view-blocklights-icon-dimmed"></img>
            {/* section values */}
            {totalLights && lightsOn && lightsOff && lightsDimmed && lightFaults &&
                <div>
                    <div className = "dashboard-page-view-blocklights-value-container-numlights">
                        <h1 className = "dashboard-page-view-blocklights-value">{totalLights.toLocaleString()}</h1>
                    </div>
                    <div className = "dashboard-page-view-blocklights-value-container-faults">
                        <h1 className = "dashboard-page-view-blocklights-value">{lightFaults.toLocaleString()}</h1>
                    </div>
                    <div className = "dashboard-page-view-blocklights-value-container-on">
                        <h1 className = "dashboard-page-view-blocklights-value">{lightsOn.toLocaleString()}</h1>
                    </div>
                    <div className = "dashboard-page-view-blocklights-value-container-off">
                        <h1 className = "dashboard-page-view-blocklights-value">{lightsOff.toLocaleString()}</h1>
                    </div>
                    <div className = "dashboard-page-view-blocklights-value-container-dimmed">
                        <h1 className = "dashboard-page-view-blocklights-value">{lightsDimmed.toLocaleString()}</h1>
                    </div>
                </div>
            }
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default BlockLights;