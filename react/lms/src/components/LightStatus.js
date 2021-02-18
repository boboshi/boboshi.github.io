import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";
import TableSortButton from "../components/TableSortButton";

import StatusHeader from "../resources/dashboard/status header.svg";
import StatusIcon from "../resources/dashboard/history-24px.svg";
import RefreshIcon from "../resources/dashboard/Icon ionic-md-refresh (black).svg";

class LightStatusObject
{
    constructor(name, date, time, status)
    {
        this.name = name;
        this.date = date;
        this.time = time;
        this.status = status;
    }
}

function LightStatus(props)
{
    const sortTypes =
    {
        name_descending: (a, b) => a.name.localeCompare(b.name),
        name_ascending: (a, b) => b.name.localeCompare(a.name),
        date_descending: (a, b) => a.date.localeCompare(b.date),
        date_ascending: (a, b) => b.date.localeCompare(a.date),
        time_descending: (a, b) => a.time.localeCompare(b.time),
        time_ascending: (a, b) => b.time.localeCompare(a.time),
        status_descending: (a, b) => a.status.localeCompare(b.status),
        status_ascending: (a, b) => b.status.localeCompare(a.status)
    };

    const entriesRef = useRef();

    const [sortingMode, setSortingMode] = useState("name_descending");
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    const [lightStatusData, setLightStatusData] = useState([]);
    const [displayLength, setDisplayLength] = useState([]);

    let lightStatusList = lightStatusData.length &&
        lightStatusData.sort(sortTypes[sortingMode])
        .slice(currentPage * 10, (currentPage + 1) * 10)
        .map(lightStatus =>
        <tr key = {lightStatus.name}>
            <td className = "dashboard-page-view-status-table-name">{lightStatus.name}</td>
            <td className = "dashboard-page-view-status-table-date">{lightStatus.date}</td>
            <td className = "dashboard-page-view-status-table-time">{lightStatus.time}</td>
            <td className = "dashboard-page-view-status-table-status">{lightStatus.status}</td>
        </tr>
    );

    useEffect(() =>
    {
        // simulate getting data
        var a = [];

        a.push(new LightStatusObject("1.1.1", "2020-09-01", "17:44:00", "ON"));
        a.push(new LightStatusObject("1.1.2", "2020-09-02", "17:44:01", "OFF"));
        a.push(new LightStatusObject("1.1.3", "2020-09-03", "17:44:03", "ON"));
        a.push(new LightStatusObject("1.1.4", "2020-09-04", "17:44:04", "ON"));
        a.push(new LightStatusObject("1.1.5", "2020-09-05", "17:44:05", "OFF"));
        a.push(new LightStatusObject("1.1.6", "2020-09-06", "17:44:06", "ON"));
        a.push(new LightStatusObject("1.1.7", "2020-09-07", "17:44:07", "OFF"));
        a.push(new LightStatusObject("1.1.8", "2020-09-08", "17:44:08", "ON"));
        a.push(new LightStatusObject("1.1.9", "2020-09-09", "17:44:09", "OFF"));
        a.push(new LightStatusObject("1.2.1", "2020-09-10", "17:44:10", "ON"));
        a.push(new LightStatusObject("1.2.2", "2020-09-11", "17:44:11", "OFF"));
        a.push(new LightStatusObject("1.2.3", "2020-09-12", "17:44:12", "ON"));
        a.push(new LightStatusObject("1.2.4", "2020-09-13", "17:44:13", "OFF"));
        a.push(new LightStatusObject("1.2.5", "2020-09-14", "17:44:14", "ON"));
        a.push(new LightStatusObject("1.2.6", "2020-09-15", "17:44:15", "OFF"));
        a.push(new LightStatusObject("1.2.7", "2020-09-16", "17:44:16", "ON"));
        a.push(new LightStatusObject("1.2.8", "2020-09-17", "17:44:17", "OFF"));
        a.push(new LightStatusObject("1.2.9", "2020-09-18", "17:44:18", "ON"));
        a.push(new LightStatusObject("1.3.1", "2020-09-19", "17:44:19", "OFF"));
        a.push(new LightStatusObject("1.3.2", "2020-09-20", "17:44:20", "ON"));
        a.push(new LightStatusObject("1.3.3", "2020-09-21", "17:44:21", "OFF"));
        a.push(new LightStatusObject("1.3.4", "2020-09-22", "17:44:22", "ON"));
        a.push(new LightStatusObject("1.3.5", "2020-09-23", "17:44:23", "OFF"));
        a.push(new LightStatusObject("1.3.6", "2020-09-24", "17:44:24", "ON"));
        // 24 elements

        setLightStatusData(a);
        setDisplayLength(a.length < 10 ? a.length : 10);
        setLastPage(0);
    }, []);

    function handleStatusRefresh()
    {
        console.log("status refresh");
    }

    function handleSelectOption(option)
    {
        var len;
        if (option === "ALL" || parseInt(option) > lightStatusData.length)
            len = lightStatusData.length;
        else
            len = option;
        setDisplayLength(len);
        var last = Math.ceil(len / 10) - 1;
        setLastPage(last);
        if (currentPage > last)
            setCurrentPage(last);
    }

    function handleNameClick()
    {
        sortingMode === "name_descending" ? setSortingMode("name_ascending") : setSortingMode("name_descending");
    }

    function handleDateClick()
    {
        sortingMode === "date_descending" ? setSortingMode("date_ascending") : setSortingMode("date_descending");
    }

    function handleTimeClick()
    {
        sortingMode === "time_descending" ? setSortingMode("time_ascending") : setSortingMode("time_descending");
    }

    function handleStatusClick()
    {
        sortingMode === "status_descending" ? setSortingMode("status_ascending") : setSortingMode("status_descending");
    }

    function handlePrevClick()
    {
        if (currentPage !== 0)
            setCurrentPage(currentPage - 1);
    }

    function handleNextClick()
    {
        if (currentPage !== lastPage)
            setCurrentPage(currentPage + 1);
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
                    default = {"10"}
                    options = {["10", "20", "30", "ALL"]}
                    selectOption = {handleSelectOption}
                    disabled = {false}
                ></GenericDropdown>
            </div>
            {/* table */}
            {/* 0 - no arrows 1 - up 2 - down */}
            {lightStatusList &&
                <div className = "dashboard-page-view-status-table-container">
                    <div className = "dashboard-page-view-status-table-header-name">
                        <TableSortButton
                            onClick = {handleNameClick}
                            sort = {sortingMode === "name_descending" ? 2 : (sortingMode === "name_ascending" ? 1 : 0)}
                        />
                        LIGHT
                    </div>
                    <div className = "dashboard-page-view-status-table-header-date">
                        <TableSortButton
                            onClick = {handleDateClick}
                            sort = {sortingMode === "date_descending" ? 2 : (sortingMode === "date_ascending" ? 1 : 0)}
                        />
                        LAST RESPONSE DATE
                    </div>
                    <div className = "dashboard-page-view-status-table-header-time">
                        <TableSortButton
                            onClick = {handleTimeClick}
                            sort = {sortingMode === "time_descending" ? 2 : (sortingMode === "time_ascending" ? 1 : 0)}
                        />
                        LAST RESPONSE TIME
                    </div>
                    <div className = "dashboard-page-view-status-table-header-status">
                        <TableSortButton
                            onClick = {handleStatusClick}
                            sort = {sortingMode === "status_descending" ? 2 : (sortingMode === "status_ascending" ? 1 : 0)}
                        />
                        STATUS
                    </div>
                    <div className = "dashboard-page-view-status-table-divider"></div>
                    <table className = "dashboard-page-view-status-table">
                        <tbody>
                            {lightStatusList}
                        </tbody>
                    </table>
                    <div className = "dashboard-page-view-status-table-divider2"></div>
                    <div className = "dashboard-page-view-status-showing">
                        Showing {currentPage * 10 + 1} {" "}
                        to {" "}
                        {currentPage === lastPage ? displayLength : (currentPage + 1) * 10} {" "}
                        of {" "}
                        {displayLength} entries
                    </div>
                </div>                
            }
            {/* buttons */}

        </div>
    );
}

export default LightStatus;