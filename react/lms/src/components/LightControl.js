import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "./GenericDropdown";

import Header from "../resources/dashboard/dashboard header.svg";
import ControlIcon from "../resources/dashboard/settings_power-24px.svg";
import BulbIcon from "../resources/dashboard/Icon material-lightbulb-outline (white).svg";
import BulbFillIcon from "../resources/dashboard/Icon material-lightbulb-outline (white filled).svg";
import LoopIcon from "../resources/dashboard/loop-circular.svg";

function EnergyConsumption(props)
{
    const ddRef = useRef();

    const [floorOptions, setFloorOptions] = useState([]);
    const [lightOptions, setLightOptions] = useState([]);

    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedLights, setSelectedLights] = useState("");

    useEffect(() =>
    {
        // simulate getting data  
        setFloorOptions(["Level 1-1", "Level 2-1", "Level 3-1"]);
        setLightOptions(["All Lights"]);
    }, []);

    function handleOnButtonClick()
    {
        if (selectedFloor && selectedLights)
            console.log("on " + selectedFloor + " " + selectedLights);
        else
            console.log("please select lights");
    }

    function handleOffButtonClick()
    {
        if (selectedFloor && selectedLights)
            console.log("off " + selectedFloor + " " + selectedLights);
        else
            console.log("please select lights");
    }

    function handleNormalButtonClick()
    {  
        if (selectedFloor && selectedLights)
            console.log("normal " + selectedFloor + " " + selectedLights);
        else
            console.log("please select lights");
    }

    function handleLoopButtonClick()
    {
        if (selectedFloor && selectedLights)
            console.log("loop " + selectedFloor + " " + selectedLights);
        else
            console.log("please select lights");
    }

    return(
        <div className = "dashboard-page-view-control-container">
            <img alt = "" src = {ControlIcon} className = "dashboard-page-view-control-icon"></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-header-text">LIGHT CONTROL</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            {/* dropdown and button headers */}
            <div className = "dashboard-page-view-control-floor-header">SELECT FLOOR</div>
            <div className = "dashboard-page-view-control-light-header">SELECT LIGHT</div>
            <div className = "dashboard-page-view-control-lighting-header">LIGHTING CONTROL</div>
            <div className = "dashboard-page-view-control-admin-header">ADMIN CONTROL</div>
            <div className = "dashboard-page-view-border-default"></div>
            {/* dropdown lists */}
            {floorOptions && lightOptions &&
                <div>
                    <div className = "dashboard-page-view-selectfloor-ddcontainer" style = {{zIndex: 10}}>
                        <GenericDropdown
                            ref = {ddRef}
                            default = {selectedFloor}
                            options = {floorOptions}
                            selectOption = {setSelectedFloor}
                            disabled = {false}
                        ></GenericDropdown>
                    </div>
                    <div className = "dashboard-page-view-selectlight-ddcontainer"  style = {{zIndex: 9}}>
                        <GenericDropdown
                            ref = {ddRef}
                            default = {selectedLights}
                            options = {lightOptions}
                            selectOption = {setSelectedLights}
                            disabled = {selectedFloor === ""}
                        ></GenericDropdown>
                    </div>
                </div>
            }
            {/* buttons */}
            <div 
                className = "dashboard-page-view-control-onbtn"
                onClick = {handleOnButtonClick}
            >
                <img
                    alt = ""
                    src = {BulbIcon}
                    className = "dashboard-page-view-control-btn-icon"
                ></img>
                <div className = "dashboard-page-view-control-btn-text">Turn On</div>
            </div>
            <div 
                className = "dashboard-page-view-control-offbtn"
                onClick = {handleOffButtonClick}
            >
                <img
                    alt = ""
                    src = {BulbFillIcon}
                    className = "dashboard-page-view-control-btn-icon"
                ></img>
                <div className = "dashboard-page-view-control-btn-text">Turn Off</div>
            </div>
            <div 
                className = "dashboard-page-view-control-normalbtn"
                onClick = {handleNormalButtonClick}
            >
                <img
                    alt = ""
                    src = {BulbIcon}
                    className = "dashboard-page-view-control-btn-icon"
                ></img>
                <div className = "dashboard-page-view-control-btn-text">NORMAL</div>
            </div>
            <div 
                className = "dashboard-page-view-control-loopbtn"
                onClick = {handleLoopButtonClick}
            >
                <img
                    alt = ""
                    src = {LoopIcon}
                    className = "dashboard-page-view-control-btn-loopicon"
                ></img>
                <div className = "dashboard-page-view-control-btn-looptext">LOOP</div>
            </div>
        </div>
    );
}

export default EnergyConsumption;