import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/activity header.svg";
import ActivityIcon from "../resources/dashboard/Icon material-event-note.svg";

function ActivityLog(props)
{
    useEffect(() =>
    {
        // simulate getting data
    }, []);

    return(
        <div className = "dashboard-page-view-activity-container">
            <img alt = "" src = {ActivityIcon} className = "dashboard-page-view-activity-icon"></img>
            <div className = "dashboard-page-view-activity-header">
                <h1 className = "dashboard-page-view-activity-header-text">ACTIVITY LOG</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-activity-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default ActivityLog;