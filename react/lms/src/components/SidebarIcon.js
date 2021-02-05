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
            {location.pathname === props.path || location.pathname === props.path ?
                <img alt = "" src = {props.icon} className = "dashboard-page-sidebar-icon-selected"></img> :
                <img alt = "" src = {props.icon} className = "dashboard-page-sidebar-icon-image"></img>}
            {location.pathname === props.path && <div className = "dashboard-page-sidebar-icon-circle"></div>}
        </div>
    );
}

export default SidebarIcon;