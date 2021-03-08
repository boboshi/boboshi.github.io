import React, {useEffect, useRef} from "react";

import GenericDropdown from "./GenericDropdown";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/calendar-photosensor-icon.svg";
import InfoIcon from "../resources/dashboard/icon-question-mark.svg";

var options = [];
var intensityOptions = [];

for (var i = 0; i < 41; ++i)
{
    options.push(i * 5);
}

for (var j = 0; j < 21; ++j)
{
    intensityOptions.push(j * 5);
}

function PhotosensorBrightness(props)
{
    const brightnessRef = useRef();

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleDarknessButton()
    {
        var circle = document.getElementsByClassName("dashboard-page-photosensor-brightness-button-circle");
        var container = document.getElementsByClassName("dashboard-page-photosensor-brightness-button-container");

        // turn on
        if (circle[0].style.transform === "translate(-10%, 0%)")
        {
            circle[0].style.transform = "translate(75%, 0%)";
            container[0].style.backgroundColor = "#005570";
            props.setBrightnessDetection("ON");
        }
        // turn off
        else
        {
            circle[0].style.transform = "translate(-10%, 0%)";
            container[0].style.backgroundColor = "#333132";
            props.setBrightnessDetection("OFF");
        }
    }

    return(
        <div className = "dashboard-page-photosensor-brightness-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-photosensor-brightness-header-icon"></img>
            {/* header button(s) */}
                {props.lights ?
                    <div 
                        className = "dashboard-page-photosensor-brightness-button-container"
                        style = {{opacity: 1.0, cursor: "pointer"}}
                        onClick = {handleDarknessButton}
                    >
                        <div className = "dashboard-page-photosensor-brightness-button-circle"></div>
                    </div> :
                    <div
                        className = "dashboard-page-photosensor-brightness-button-container"
                        style = {{opacity: 0.3, cursor: "default"}}
                    >
                        <div className = "dashboard-page-photosensor-brightness-button-circle"></div>
                    </div>
                }
            {/* header */}
            <div className = "dashboard-page-photosensor-header">
                <h1 className = "dashboard-page-photosensor-header-text">BRIGHTNESS DETECTION</h1>
                <img alt = "" src = {Header} className = "dashboard-page-photosensor-header-img"></img>
            </div>
            {/* dropdown headers */}
            <div className = "dashboard-page-photosensor-card-header0">LIGHTING'S OWN OFFSET</div>
            <div className = "dashboard-page-photosensor-card-header1">DESIRED INTENSITY</div>
            <div className = "dashboard-page-photosensor-card-header2">BRIGHT THRESHOLD</div>
            {/* info icons */}
            <img title = "Lux produced by lighting when it is 'ON'" alt = "" src = {InfoIcon} className = "dashboard-page-photosensor-brightness-info0"></img>
            <img title = "Sensor reading above threshold value turns 'OFF' lighting." alt = "" src = {InfoIcon} className = "dashboard-page-photosensor-brightness-info2"></img>
            {/* dropdown lists */}
            <div className = "dashboard-page-photosensor-ddcontainer0" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {brightnessRef}
                    default = {props.lightingOffset}
                    options = {options}
                    selectOption = {props.setLightingOffset}
                    disabled = {props.brightnessDetection === "ON" && props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-photosensor-ddcontainer1" style = {{zIndex: 9}}>
                <GenericDropdown
                    ref = {brightnessRef}
                    default = {props.brightnessIntensity}
                    options = {intensityOptions}
                    selectOption = {props.setBrightnessIntensity}
                    disabled = {props.brightnessDetection === "ON" && props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-photosensor-ddcontainer2" style = {{zIndex: 8}}>
                <GenericDropdown
                    ref = {brightnessRef}
                    default = {props.brightnessThreshold}
                    options = {options}
                    selectOption = {props.setBrightnessThreshold}
                    disabled = {props.brightnessDetection === "ON" && props.lights ? false : true}
                ></GenericDropdown>
            </div>
        </div>
    );
}

export default PhotosensorBrightness;