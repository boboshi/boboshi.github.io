import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/icon-schedule.svg";

function ConfigSchedule(props)
{
    const ddRef = useRef();

    const [activity, setActivity] = useState("Photosensor Control");
    const [start, setStart] = useState("07:00");
    const [end, setEnd] = useState("18:59");

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    return(
        <div className = "dashboard-page-config-schedule-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-top-icon"></img>
            {/* header button */}

            {/* header */}
            <div className = "dashboard-page-config-header-top">
                <h1 className = "dashboard-page-config-header-top-text">PRE-SET SCHEDULE</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-top-img"></img>
            </div>
            {/* dropdown and day headers */}
            <div className = "dashboard-page-config-card-header0">ACTIVITIES</div>
            <div className = "dashboard-page-config-card-header1">START TIME</div>
            <div className = "dashboard-page-config-schedule-endtime-header">END TIME</div>
            <div className = "dashboard-page-config-card-header2">REPEAT</div>
            {/* dropdown lists */}
            <div className = "dashboard-page-config-schedule-activities-ddcontainer" style = {{zIndex: 11}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {"Photosensor Control"}
                    options = {["Photosensor Control", "Full Brightness", "Motion Trigger"]}
                    selectOption = {setActivity}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-config-schedule-start-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {start}
                    options = {["Photosensor Control", "Full Brightness", "Motion Trigger"]}
                    selectOption = {setActivity}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
            <div className = "dashboard-page-config-schedule-end-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {ddRef}
                    default = {end}
                    options = {["Photosensor Control", "Full Brightness", "Motion Trigger"]}
                    selectOption = {setActivity}
                    disabled = {props.lights ? false : true}
                ></GenericDropdown>
            </div>
            {/* day selector */}
        </div>
    );
}

export default ConfigSchedule;