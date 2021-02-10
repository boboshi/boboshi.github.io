import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/dashboard header.svg";
import ControlIcon from "../resources/dashboard/settings_power-24px.svg";

function EnergyConsumption(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    return(
        <div className = "dashboard-page-view-control-container">
            <img alt = "" src = {ControlIcon} className = "dashboard-page-view-control-icon"></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-header-text">LIGHT CONTROL</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            {/* dropdown and button headers */}
            <div className = "dashboard-page-view-control-floor-header">SELECT FLOOR</div>
            <div className = "dashboard-page-view-control-light-header">SELECT LIGHT</div>
            <div className = "dashboard-page-view-control-lighting-header">LIGHTING CONTROL</div>
            <div className = "dashboard-page-view-control-admin-header">ADMIN CONTROL</div>
            <div className = "dashboard-page-view-border-default"></div>
            {/* dropdown lists */}
            {/* buttons */}
        </div>
    );
}

export default EnergyConsumption;