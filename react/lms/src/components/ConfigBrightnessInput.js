import React, {useEffect} from "react";
import {CircularInput, CircularTrack, CircularProgress, CircularThumb} from "react-circular-input";

import InfoIcon from "../resources/dashboard/icon-question-mark.svg";

function ConfigBrightnessInput(props)
{
    const stepValue = v => Math.round(v * 20) / 20;

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function setValueHelper(value)
    {
        props.set(stepValue(value));
    }

    function placeholder() {}

    return(
        <div 
            className = "dashboard-page-config-brightness-input-container" 
            style = {props.disabled ? {opacity: 0.5} : {opacity: 1.0}}
        >
            {/* icon */}
            <img 
                title = {props.info} 
                alt = "" 
                src = {InfoIcon} 
                className = "dashboard-page-config-brightness-input-info"
            ></img>
            { /* circle */}
            <CircularInput 
                className = "dashboard-page-config-brightness-input-circle"
                value = {stepValue(props.level)} 
                onChange = {props.disabled ? placeholder :setValueHelper} 
                radius = {65}
            >
		        <CircularTrack strokeWidth = {15} stroke = {"#F5FBFF"} fill = {"#F5FBFF"}/>
		        <CircularProgress  strokeWidth = {15} strokeLinecap = "butt" stroke = {"#00C2FF"}/>
		        <CircularThumb cursor = {props.disabled ? "default" : "pointer"} r = {10} fill = {"#00C2FF"}/>
	        </CircularInput>
            { /* ???? */}
            <div className = "dashboard-page-config-brightness-input-label">
                {props.label}
            </div>
            <div className = "dashboard-page-config-brightness-input-value">
                {Math.round(props.level * 100) + "%"}
            </div>
        </div>
    );
}

export default ConfigBrightnessInput;