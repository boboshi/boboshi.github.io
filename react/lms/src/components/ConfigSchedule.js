import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";
import DaySelectorButton from "../components/DaySelectorButton";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/icon-schedule.svg";

function ConfigSchedule(props)
{
    const ddRef = useRef();

    const [activity, setActivity] = useState("Photosensor Control");
    const [start, setStart] = useState("07:00");
    const [end, setEnd] = useState("18:59");
    const [dayActive, setDayActive] = useState([false, true, true, true, true, true, false]);

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleAddSchedule()
    {
        
    }

    function toggleDay(day)
    {
        let days = [...dayActive];

        if (day === "SUN")
            days[0] = !days[0];
        else if (day === "MON")
            days[1] = !days[1];
        else if (day === "TUE")
            days[2] = !days[2];
        else if (day === "WED")
            days[3] = !days[3];
        else if (day === "THU")
            days[4] = !days[4];
        else if (day === "FRI")
            days[5] = !days[5];
        else
            days[6] = !days[6];

        setDayActive(days);
        console.log(days);
    }

    return(
        <div className = "dashboard-page-config-schedule-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-top-icon"></img>
            {/* header button */}
            <div className = "dashboard-page-config-schedule-add" onClick = {handleAddSchedule}>
                Add Schedule
            </div>
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
            <div className = "dashboard-page-config-schedule-day-container">
                <DaySelectorButton day = {"SUN"} onClick = {toggleDay} active = {dayActive[0]}></DaySelectorButton>
                <DaySelectorButton day = {"MON"} onClick = {toggleDay} active = {dayActive[1]}></DaySelectorButton>
                <DaySelectorButton day = {"TUE"} onClick = {toggleDay} active = {dayActive[2]}></DaySelectorButton>
                <DaySelectorButton day = {"WED"} onClick = {toggleDay} active = {dayActive[3]}></DaySelectorButton>
                <DaySelectorButton day = {"THU"} onClick = {toggleDay} active = {dayActive[4]}></DaySelectorButton>
                <DaySelectorButton day = {"FRI"} onClick = {toggleDay} active = {dayActive[5]}></DaySelectorButton>
                <DaySelectorButton day = {"SAT"} onClick = {toggleDay} active = {dayActive[6]}></DaySelectorButton>
            </div>
        </div>
    );
}

export default ConfigSchedule;