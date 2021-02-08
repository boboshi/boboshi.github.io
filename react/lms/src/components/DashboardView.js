import "../resources/css/dashboardview.css";

import React, {useState, useEffect} from "react";

import BlockLights from "../components/BlockLights";
import ActiveLights from "../components/ActiveLights";
import EnergyConsumption from "../components/EnergyConsumption";
import LightControl from "../components/LightControl";
import ActivityLog from "../components/ActivityLog";
import GatewayInfo from "../components/GatewayInfo";
import LightStatus from "../components/LightStatus";

function DashboardView(props)
{
    useEffect(() =>
    {
        // simulate getting data

    }, []);

    return(
        <div className = "dashboard-page-view">
            <BlockLights />
            <ActiveLights />
            <EnergyConsumption />
            <LightControl />
            <ActivityLog />
            <GatewayInfo />
            <LightStatus />
        </div>
    );
}

export default DashboardView;