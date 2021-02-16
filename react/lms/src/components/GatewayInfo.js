import React, {useState, useEffect} from "react";

import GatewayHeader from "../resources/dashboard/gateway header.svg";
import GatewayIcon from "../resources/dashboard/Icon awesome-laptop-code.svg";
import RefreshIcon from "../resources/dashboard/Icon ionic-md-refresh.svg";

function GatewayInfo(props)
{
    const [gatewayInfo, setGatewayInfo] = useState("");

    useEffect(() =>
    {
        // simulate getting data
        setGatewayInfo("{“lpAddress”:{“wlp2s0”:”192.168.1.188”,”lo”:”127.0.0.1”}}")
    }, []);

    function handleRefreshButton()
    {
        console.log("refresh");
    }

    return(
        <div className = "dashboard-page-view-gateway-container">
            <img alt = "" src = {GatewayIcon} className = "dashboard-page-view-gateway-icon"></img>
            <div className = "dashboard-page-view-gateway-header">
                <h1 className = "dashboard-page-view-gateway-header-text">GATEWAY INFORMATION</h1>
                <img alt = "" src = {GatewayHeader} className = "dashboard-page-view-gateway-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
            {/* elements */}
            <div className = "dashboard-page-view-gateway-button" onClick = {handleRefreshButton}>
                <img alt = "" src = {RefreshIcon} className = "dashboard-page-view-gateway-button-icon"></img>
                <div className = "dashboard-page-view-gateway-button-text">REFRESH / VIEW DETAIL</div>
            </div>
            {gatewayInfo && 
                <div>
                    <h1 className = "dashboard-page-view-gateway-text">{gatewayInfo}</h1>
                    <h1 className = "dashboard-page-view-gateway-updated-text">Last updated: Refresh for update</h1>
                </div>
            }

        </div>
    );
}

export default GatewayInfo;