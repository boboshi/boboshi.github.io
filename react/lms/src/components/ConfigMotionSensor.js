import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/MotionSensor-icon-GY (black).svg";

function ConfigMotionSensor(props)
{
    const [motionSensorOn, setMotionSensorOn] = useState("");

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
        }
        // turn off
        else
        {
            circle[0].style.transform = "translate(-10%, 0%)";
            container[0].style.backgroundColor = "#333132";
        }
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
                    style = {{opacity: 0.5, cursor: "default"}}
                >
                    <div className = "dashboard-page-config-ms-button-circle"></div>
                </div>
            }
            {/* header */}
            <div className = "dashboard-page-config-header-top">
                <h1 className = "dashboard-page-config-header-top-text">MOTION SENSOR</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-top-img"></img>
            </div>
        </div>
    );
}

export default ConfigMotionSensor;