import "../resources/css/dashboardview.css";

import React, {useEffect} from "react";

import ExportButton from "../resources/dashboard/export button@2x.png";

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

    function handleExportClick()
    {
        console.log("clicked export");
    }

    return(
        <div className = "dashboard-page-view">
            {/* export button */}
            <img 
                alt = "" 
                src = {ExportButton} 
                className = "dashboard-page-view-exportbtn"
                onClick = {handleExportClick}
            ></img>
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