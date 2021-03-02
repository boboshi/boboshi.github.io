import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/Icon ionic-ios-settings.svg";
import InfoIcon from "../resources/dashboard/icon-question-mark.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";

let ddTime = Array.from({length: 60}, (_, i) => i + 1);

function ConfigSettings(props)
{
    const ddRef = useRef();

    const [selectedIntensity, setSelectedIntensity] = useState("Fast");
    const [selectedHoldTime, setSelectedHoldTime] = useState("15");
    const [selectedHoldTimeUnits, setSelectedHoldTimeUnits] = useState("Seconds");

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleRadioButton()
    {
        if (props.sync === "ON")
            props.setSync("OFF");
        else
            props.setSync("ON");
    }

    function placeholder() {}

    function setLightIntensityHelper(light)
    {
        props.setIntensity(light);
        setSelectedIntensity(light);
    }

    function setHoldTimeHelper(time)
    {
        props.setHoldTime(time);
        setSelectedHoldTime(time);
    }

    function setHoldTimeUnitsHelper(units)
    {
        props.setHoldTimeUnits(units);
        setSelectedHoldTimeUnits(units);
    }

    return(
        <div className = "dashboard-page-config-settings-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-top-icon"></img>
            {/* header */}
            <div className = "dashboard-page-config-header-top">
                <h1 className = "dashboard-page-config-header-top-text">SETTINGS</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-top-img"></img>
            </div>
            {/* info icons */}
            <img title = "Sync device clock to PC clock." alt = "" src = {InfoIcon} className = "dashboard-page-config-settings-sync-info"></img>
            <img title = "Brightness transition speed." alt = "" src = {InfoIcon} className = "dashboard-page-config-settings-intensity-info"></img>
            <img title = "Amount of time to stay in triggered brightness." alt = "" src = {InfoIcon} className = "dashboard-page-config-settings-holdtime-info"></img>
            {/* radio button header and description */}
            <div className = "dashboard-page-config-card-header0">SYNCHRONIZE</div>
            <div className = "dashboard-page-config-clocktext" style = {props.lights ? {opacity: 1.0} : {opacity: 0.5}}>Clock</div>
            {/* radio button */}
            <img 
                alt = "" 
                src = {props.sync === "ON" ? RadioButtonOn : RadioButtonOff} 
                className = "dashboard-page-config-radio"
                style = {props.lights ? {opacity: 1.0, cursor: "pointer"} : {opacity: 0.5, cursor: "default"}}
                onClick = {props.lights ? handleRadioButton : placeholder}
            ></img>
            {/* dropdown headers */}
            <div className = "dashboard-page-config-card-header1">LIGHT INTENSITY</div>
            <div className = "dashboard-page-config-card-header2">HOLD-TIME</div>
            {/* dropdown lists */}
            <div className = "dashboard-page-config-settings-intensity-ddcontainer" style = {{zIndex: 11}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {selectedIntensity}
                    options = {["Fast", "Medium", "Slow"]}
                    selectOption = {setLightIntensityHelper}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-config-settings-holdtime-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {selectedHoldTime}
                    options = {ddTime}
                    selectOption = {setHoldTimeHelper}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-config-settings-holdtimeunits-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {selectedHoldTimeUnits}
                    options = {["Seconds", "Minutes"]}
                    selectOption = {setHoldTimeUnitsHelper}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
        </div>
    );
}

export default ConfigSettings;