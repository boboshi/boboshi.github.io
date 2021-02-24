import React, {useEffect} from "react";

import ConfigBrightnessInput from "./ConfigBrightnessInput";

import Header from "../resources/dashboard/config-long-header.svg";
import HeaderIcon from "../resources/dashboard/Icon material-lightbulb-outline.svg";

function ConfigBrightness(props)
{
    useEffect(() =>
    {
        // simulate getting data

    }, []);

    return(
        <div className = "dashboard-page-config-brightness-container">
            {/* header icon */}
                <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-brightness-icon"></img>
            {/* header */}
            <div className = "dashboard-page-config-header-brightness">
                <h1 className = "dashboard-page-config-header-brightness-text">BRIGHTNESS LEVEL</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-brightness-img"></img>
            </div>
            {/* inputs */}
            <ConfigBrightnessInput
                label = {"Dimmed"} 
                info = {"Brightness when dimmed (idle)."}
                level = {props.dimmedBrightness} 
                set = {props.setDimmed}
                disabled = {!props.lights}
            />
            <ConfigBrightnessInput
                label = {"Motion Triggered"}
                info = {"Brightness when triggered by motion sensor."}
                level = {props.motionBrightness} 
                set = {props.setMotion}
                disabled = {!props.lights}
            />
            <ConfigBrightnessInput
                label = {"Max. Brightness"}
                info = {"Brightness when turned ON."}
                level = {props.maxBrightness} 
                set = {props.setMax}
                disabled = {!props.lights}
            />
        </div>
    );
}

export default ConfigBrightness;