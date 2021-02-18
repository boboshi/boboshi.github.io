import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";
import TableSortButton from "../components/TableSortButton";

import StatusHeader from "../resources/dashboard/status header.svg";
import StatusIcon from "../resources/dashboard/history-24px.svg";
import RefreshIcon from "../resources/dashboard/Icon ionic-md-refresh (black).svg";

function LightStatus(props)
{
    const entriesRef = useRef();

    useEffect(() =>
    {
        // simulate getting data
    }, []);

    function handleStatusRefresh()
    {
        console.log("status refresh");
    }

    function handleSelectOption()
    {
        console.log("select option");
    }

    return(
        <div className = "dashboard-page-view-status-container">
            <img alt = "" src = {StatusIcon} className = "dashboard-page-view-status-icon"></img>
            <div className = "dashboard-page-view-status-header-divider"></div>
            {/* refresh */}
            <img
                alt = ""
                src = {RefreshIcon}
                className = "dashboard-page-view-status-refresh"
                onClick = {handleStatusRefresh}
            ></img>
            <div className = "dashboard-page-view-status-header">
                <h1 className = "dashboard-page-view-status-header-text">LIGHT STATUS</h1>
                <img alt = "" src = {StatusHeader} className = "dashboard-page-view-status-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
            {/* header stuff */}
            <h1 className = "dashboard-page-view-status-show">SHOW</h1>
            <h1 className = "dashboard-page-view-status-entries">ENTRIES</h1>
            <div className = "dashboard-page-view-status-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {entriesRef}
                    default = {10}
                    options = {["10", "20", "30", "ALL"]}
                    selectOption = {handleSelectOption}
                    disabled = {false}
                ></GenericDropdown>
            </div>
            {/* table */}
            
        </div>
    );
}

export default LightStatus;