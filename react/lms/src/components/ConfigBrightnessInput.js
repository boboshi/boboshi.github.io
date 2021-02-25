import React, {useState, useEffect} from "react";
import {CircularInput, CircularTrack, CircularProgress, CircularThumb, useCircularInputContext} from "react-circular-input";

import InfoIcon from "../resources/dashboard/icon-question-mark.svg";

function ConfigBrightnessInput(props)
{
    const stepValue = v => Math.round(v * 20) / 20;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = (e) => 
    {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => 
    {    
        // really dirty
        window.addEventListener("resize", handleResize);
    
        return () => {window.removeEventListener("resize", handleResize);};
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
            { /* circlular input */}
            <CircularInput 
                className = "dashboard-page-config-brightness-input-circle"
                value = {stepValue(props.level)} 
                onChange = {props.disabled ? placeholder :setValueHelper} 
                radius = {windowWidth > 1900 ? 80 : 65}
            >
		        <CircularTrack strokeWidth = {15} stroke = {"#F5FBFF"} fill = {"#F5FBFF"}/>
		        <CircularProgress strokeWidth = {15} strokeLinecap = "butt" stroke = {"#00C2FF"}/>
		        <CircularThumb 
                    cursor = {props.disabled ? "default" : "pointer"} 
                    r = {10} 
                    fill = {"#00C2FF"}
                />
                <InputHandleShadow />
	        </CircularInput>
            { /* label and value display */}
            <div className = "dashboard-page-config-brightness-input-label">
                {props.label}
            </div>
            <div className = "dashboard-page-config-brightness-input-value">
                {Math.round(props.level * 100) + "%"}
            </div>
        </div>
    );
}

// custom component for circular input shadow
function InputHandleShadow()
{
    const {getPointFromValue} = useCircularInputContext();
    const point = getPointFromValue();
    if (!point) return null;

    return(
        <svg {...point} style = {{overflow: "visible"}} pointerEvents = {"none"}>
            <defs>
                <filter id = "shadow">
                    <feDropShadow 
                        dx = "0" 
                        dy = "1" 
                        stdDeviation = "1.0" 
                        floodColor = "#00000029"
                    />
                </filter>
            </defs>
            <circle 
                cx = "0" cy= "0 " r = "7.8%"
                style = {{fill: "#00C2FF", filter: "url(#shadow)"}}
            >
            </circle>
        </svg>
    );
}

export default ConfigBrightnessInput;