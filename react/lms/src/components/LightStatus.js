import React, {useEffect} from "react";

import StatusHeader from "../resources/dashboard/status header.svg";
import StatusIcon from "../resources/dashboard/history-24px.svg";

function LightStatus(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    return(
        <div className = "dashboard-page-view-status-container">
            <img alt = "" src = {StatusIcon} className = "dashboard-page-view-status-icon"></img>
            <div className = "dashboard-page-view-status-header">
                <h1 className = "dashboard-page-view-status-header-text">LIGHT STATUS</h1>
                <img alt = "" src = {StatusHeader} className = "dashboard-page-view-status-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default LightStatus;