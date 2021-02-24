import React from "react";

function DaySelectorButton(props)
{
    function handleClick()
    {
        props.onClick(props.day);
    }

    function placeholder() {}

    return(
        <span 
            className = {!props.disabled ? 
                "dashboard-page-config-schedule-day-button-disabled" : "dashboard-page-config-schedule-day-button"}
            onClick = {props.disabled ? handleClick : placeholder}
            style = {props.active ? {fontWeight: 600, color: "#005570"} : {fontWeight: 500, color: "#C6C6C6"}}
        >
            {props.day}
        </span>
    );
}

export default DaySelectorButton;