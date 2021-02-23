import React, {useState, useEffect, useRef} from "react";

function DaySelectorButton(props)
{
    function handleClick()
    {
        props.onClick(props.day);
    }

    return(
        <span 
            className = "dashboard-page-config-schedule-day-button" 
            onClick = {handleClick}
            style = {props.active ? {fontWeight: 600, color: "#005570"} : {fontWeight: 500, color: "#C6C6C6"}}
        >
            {props.day}
        </span>
    );
}

export default DaySelectorButton;