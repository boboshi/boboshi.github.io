import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/dashboard header.svg";
import EnergyIcon from "../resources/dashboard/chart-area-solid.svg";

function EnergyConsumption(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    return(
        <div className = "dashboard-page-view-energy-container">
            <img alt = "" src = {EnergyIcon} className = "dashboard-page-view-energy-icon"></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-header-text">ENERGY CONSUMPTION</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default EnergyConsumption;