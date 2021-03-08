import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from ".//GenericDropdown";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/MotionSensor-icon-GY (black).svg";
import InfoIcon from "../resources/dashboard/icon-question-mark.svg";

function ConfigMotionSensor(props)
{
    const msRef = useRef();

    const [option, setOption] = useState("Medium-High");

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleMSButton()
    {
        var circle = document.getElementsByClassName("dashboard-page-config-ms-button-circle");
        var container = document.getElementsByClassName("dashboard-page-config-ms-button-container");

        // turn on
        if (circle[0].style.transform === "translate(-10%, 0%)")
        {
            circle[0].style.transform = "translate(75%, 0%)";
            container[0].style.backgroundColor = "#005570";
            props.setMD("ON");
        }
        // turn off
        else
        {
            circle[0].style.transform = "translate(-10%, 0%)";
            container[0].style.backgroundColor = "#333132";
            props.setMD("OFF");
        }
    }

    function selectOptionHelper(ms)
    {
        props.setMS(ms);
        setOption(ms);
    }

    return(
        <div className = "dashboard-page-config-ms-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-top-icon"></img>
            {/* header button(s) */}
            {props.lights ?
                <div 
                    className = "dashboard-page-config-ms-button-container"
                    style = {{opacity: 1.0, cursor: "pointer"}}
                    onClick = {handleMSButton}
                >
                    <div className = "dashboard-page-config-ms-button-circle"></div>
                </div> :
                <div
                    className = "dashboard-page-config-ms-button-container"
                    style = {{opacity: 0.3, cursor: "default"}}
                >
                    <div className = "dashboard-page-config-ms-button-circle"></div>
                </div>
            }
            {/* header */}
            <div className = "dashboard-page-config-header-top">
                <h1 className = "dashboard-page-config-header-top-text">MOTION SENSOR</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-top-img"></img>
            </div>
            {/* dropdown header */}
            <div className = "dashboard-page-config-card-header0">SENSITIVITY</div>
            {/* info icon*/}
            <img title = "Higher sensitivity allows for easier triggering of motion sensor." alt = "" src = {InfoIcon} className = "dashboard-page-config-ms-info"></img>
            {/* dropdown list */}
            <div className = "dashboard-page-config-ms-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {msRef}
                    default = {option}
                    options = {["High", "Medium-High", "Medium", "Medium-Low", "Low"]}
                    selectOption = {selectOptionHelper}
                    disabled = {props.motionDetection === "ON" && props.lights ? false : true}
                ></GenericDropdown>
            </div>
        </div>
    );
}

export default ConfigMotionSensor;