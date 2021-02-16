import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";

import Header from "../resources/dashboard/dashboard header.svg";
import ControlIcon from "../resources/dashboard/settings_power-24px.svg";

function EnergyConsumption(props)
{
    const selectFloorRef = useRef();
    const selectLightsRef = useRef();

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

    }

    function handleOffButtonClick()
    {

    }

    function handleNormalButtonClick()
    {

    }

    function handleLoopButtonClick()
    {

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
                            ref = {selectFloorRef}
                            options = {floorOptions}
                            selectOption = {setSelectedFloor}
                        ></GenericDropdown>
                    </div>
                    <div className = "dashboard-page-view-selectlight-ddcontainer"  style = {{zIndex: 9}}>
                        <GenericDropdown
                            ref = {selectLightsRef}
                            options = {lightOptions}
                            selectOption = {setSelectedLights}
                        ></GenericDropdown>
                    </div>
                </div>
            }
            {/* buttons */}
            <div className = "dashboard-page-view-control-onbutton"></div>
        </div>
    );
}

export default EnergyConsumption;