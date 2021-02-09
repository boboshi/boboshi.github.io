import React from "react";
import {useLocation} from "react-router-dom";

function SidebarIcon(props)
{
    const location = useLocation();

    return(
        <div
            title = {props.tooltip}
            className = "dashboard-page-sidebar-icon"
            onClick = {props.onClick}>
            {location.pathname === props.path ?
            <img alt = "" src = {props.selectedicon} className = "dashboard-page-sidebar-icon-selected"></img> :
            <img alt = "" src = {props.icon} className = "dashboard-page-sidebar-icon-image"></img>}
        </div>
    );
}

export default SidebarIcon;