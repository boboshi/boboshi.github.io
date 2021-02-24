import React, {useEffect} from "react";



import InfoIcon from "../resources/dashboard/icon-question-mark.svg";

function ConfigBrightnessInput(props)
{
    useEffect(() =>
    {
        // simulate getting data

    }, []);

    return(
        <div className = "dashboard-page-config-brightness-input-container">
            {/* icon */}
            <img 
                title = {props.info} 
                alt = "" 
                src = {InfoIcon} 
                className = "dashboard-page-config-brightness-input-info"
            ></img>
            { /* ???? */}
            {props.disabled ? "DISABLED" : props.label}
        </div>
    );
}

export default ConfigBrightnessInput;