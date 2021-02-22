import "../resources/css/dashboardview.css";

import React, {useEffect} from "react";

import ExportButton from "../resources/dashboard/export button@2x.png";
import Map from "../resources/dashboard/map@2x.png";

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
        <div>
            {props.block ?
                <div className = "dashboard-page-view">
                    {/* cards */}
                    <BlockLights    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <ActiveLights    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <EnergyConsumption    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <LightControl    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <ActivityLog    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <GatewayInfo    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    <LightStatus    
                        location = {props.location}
                        area = {props.area}
                        block = {props.block} 
                    />
                    {/* export button */}
                    <img 
                        alt = "" 
                        src = {ExportButton} 
                        className = "dashboard-page-view-exportbtn"
                        onClick = {handleExportClick}
                    ></img>
                </div> :
                <div>
                    <img alt = "" src = {Map} className = "dashboard-page-selector-sgmapimg"></img>
                </div>
            }
        </div>

    );
}

export default DashboardView;