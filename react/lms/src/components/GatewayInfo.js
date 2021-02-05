import React, {useState, useEffect} from "react";

import GatewayHeader from "../resources/dashboard/gateway header.svg";
import GatewayIcon from "../resources/dashboard/Icon awesome-laptop-code.svg";

function GatewayInfo(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    return(
        <div className = "dashboard-page-view-gateway-container">
            <img alt = "" src = {GatewayIcon} className = "dashboard-page-view-gateway-icon"></img>
            <div className = "dashboard-page-view-gateway-header">
                <h1 className = "dashboard-page-view-gateway-header-text">GATEWAY INFORMATION</h1>
                <img alt = "" src = {GatewayHeader} className = "dashboard-page-view-gateway-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default GatewayInfo;