import React, {useState, useEffect, useRef} from "react";

import GenericDropdown from "../components/GenericDropdown";
import TableSortButton from "../components/TableSortButton";

import Header from "../resources/dashboard/activity header.svg";
import ActivityIcon from "../resources/dashboard/Icon material-event-note.svg";
import RefreshIcon from "../resources/dashboard/Icon ionic-md-refresh (black).svg";

class ActivityObject
{
    constructor(user, action)
    {
        this.user = user;
        this.action = action;
    }
}

class PageObject
{
    constructor(index, active, value, style)
    {
        this.index = index;
        this.active = active;
        this.value = value;
        this.style = style;
    }
}

function ActivityLog(props)
{
    const sortTypes = 
    {
        user_descending: (a, b) => a.user.localeCompare(b.user),
        user_ascending: (a, b) => b.user.localeCompare(a.user),
        action_descending: (a, b) => a.action.localeCompare(b.action),
        action_ascending: (a, b) => b.action.localeCompare(a.action)
    };

    const entriesRef = useRef();
    const [selectedOption, setSelectedOption] = useState("10");
    // user_descending, user_ascending, action_descending, action_ascending
    const [sortingMode, setSortingMode] = useState("user_descending");
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    const [activityData, setActivityData] = useState([]);
    const [displayLength, setDisplayLength] = useState([]);

    let activityList = activityData.length && 
        activityData.sort(sortTypes[sortingMode])
        .slice(currentPage * 10, (currentPage + 1) * 10)
        .map(activity =>
        <tr key = {activity.user + activity.action}>
            <td className = "dashboard-page-view-activity-table-user">{activity.user}</td>
            <td className = "dashboard-page-view-activity-table-action">{activity.action}</td>
        </tr>
    );

    let pageListHelper = [];

    for (var i = 0; i < lastPage + 1; ++i)
    {
        if (i === currentPage)
            pageListHelper.push(new PageObject(i, false, i + 1, "dashboard-page-view-activity-page-current"));
        else if (i === 0 || i === lastPage || i === currentPage - 1 || i === currentPage + 1)
            pageListHelper.push(new PageObject(i, true, i + 1, "dashboard-page-view-activity-page"));
        else if (i === currentPage - 2 || i === currentPage + 2)
            pageListHelper.push(new PageObject(i, false, "...", "dashboard-page-view-activity-page-current"));
    }

    let pageList = pageListHelper.length &&
    pageListHelper
    .slice(0).reverse()
    .map((page) =>
        <div
            key = {page.index}
            className = {page.style}
            onClick={page.active ? () => handlePageClick(page.index) : () => {}}
        >
            {page.value}
        </div>
    );

    useEffect(() =>
    {
        // simulate getting data
        var a = [];

        a.push(new ActivityObject("1.2.1 - 9463", "2020-09-01"));
        a.push(new ActivityObject("1.1.1 - 4120", "2020-09-02"));
        a.push(new ActivityObject("1.1.5 - 4098", "2020-09-03"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-04"));
        a.push(new ActivityObject("1.1.2 - 3697", "2020-09-05"));
        a.push(new ActivityObject("1.2.1 - 9463", "2020-09-06"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-07"));
        a.push(new ActivityObject("1.1.2 - 9463", "2020-09-08"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-09"));
        a.push(new ActivityObject("1.1.2 - 3697", "2020-09-10"));
        a.push(new ActivityObject("1.1.3 - 3697", "2020-09-11"));
        a.push(new ActivityObject("1.1.7 - 3697", "2020-09-12"));
        a.push(new ActivityObject("1.2.1 - 9463", "2020-09-13"));
        a.push(new ActivityObject("1.1.1 - 4120", "2020-09-14"));
        a.push(new ActivityObject("1.1.5 - 4098", "2020-09-15"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-16"));
        a.push(new ActivityObject("1.1.2 - 3697", "2020-09-17"));
        a.push(new ActivityObject("1.2.1 - 9463", "2020-09-18"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-19"));
        a.push(new ActivityObject("1.1.2 - 9463", "2020-09-20"));
        a.push(new ActivityObject("1.1.8 - 3955", "2020-09-21"));
        a.push(new ActivityObject("1.1.2 - 3697", "2020-09-22"));
        a.push(new ActivityObject("1.1.3 - 3697", "2020-09-23"));
        a.push(new ActivityObject("1.1.7 - 3697", "2020-09-24"));
        // 24

        // + 40
        for (var i = 0; i < 40; ++i)
            a.push(new ActivityObject("1.3." + i.toString() + " - 9999", "2020-09-25"));

        setActivityData(a);
        setDisplayLength(a.length < 10 ? a.length : 10);
        setLastPage(0);
    }, []);

    function handleActivityLogRefresh()
    {
        console.log("activity log refresh");
    }

    function handleSelectOption(option)
    {
        var len;
        if (option === "ALL" || parseInt(option) > activityData.length)
            len = activityData.length;
        else
            len = option;
        setDisplayLength(len);
        var last = Math.ceil(len / 10) - 1;
        setLastPage(last);
        if (currentPage > last)
            setCurrentPage(last);
        setSelectedOption(option);
    }

    function handleUserClick()
    {
        sortingMode === "user_descending" ? setSortingMode("user_ascending") : setSortingMode("user_descending");
    }

    function handleActionClick()
    {
        sortingMode === "action_descending" ? setSortingMode("action_ascending") : setSortingMode("action_descending");
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

    function handlePageClick(page)
    {
        setCurrentPage(page);
    }

    return(
        <div className = "dashboard-page-view-activity-container">
            <img alt = "" src = {ActivityIcon} className = "dashboard-page-view-activity-icon"></img>
            <div className = "dashboard-page-view-activity-header-divider"></div>
            {/* refresh */}
            <img 
                alt = "" 
                src = {RefreshIcon} 
                className = "dashboard-page-view-activity-refresh"
                onClick = {handleActivityLogRefresh}
            ></img>
            <div className = "dashboard-page-view-activity-header">
                <h1 className = "dashboard-page-view-activity-header-text">ACTIVITY LOG</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-activity-headerimg"></img>
            </div>
            <div className = "dashboard-page-view-border-default"></div>
            {/* header stuff */}
            <h1 className = "dashboard-page-view-activity-show">SHOW</h1>
            <h1 className = "dashboard-page-view-activity-entries">ENTRIES</h1>
            <div className = "dashboard-page-view-activity-ddcontainer" style = {{zIndex: 10}}>
                <GenericDropdown
                    ref = {entriesRef}
                    default = {selectedOption}
                    options = {["10", "20", "30", "ALL"]}
                    selectOption = {handleSelectOption}
                    disabled = {false}
                ></GenericDropdown>
            </div>
            {/* table */}
            {/* 0 - no arrows 1 - up 2 - down */}
            {activityList &&
                <div className = "dashboard-page-view-activity-table-container">
                    <div 
                        className = "dashboard-page-view-activity-table-header-user"
                        onClick = {handleUserClick}
                    >
                        <TableSortButton 
                            onClick = {handleUserClick} 
                            sort = {sortingMode === "user_descending" ? 2 : (sortingMode === "user_ascending" ? 1 : 0)}
                        />
                        USER
                    </div>
                    <div 
                        className = "dashboard-page-view-activity-table-header-action"
                        onClick = {handleActionClick}
                    >
                        <TableSortButton 
                            onClick = {handleActionClick}
                            sort = {sortingMode === "action_descending" ? 2 : (sortingMode === "action_ascending" ? 1 : 0)}
                        />
                        ACTION
                    </div>
                    <div className = "dashboard-page-view-activity-table-divider"></div>
                    <table className = "dashboard-page-view-activity-table">
                        <tbody>
                            {activityList}
                        </tbody>
                    </table>
                    <div className = "dashboard-page-view-activity-table-divider2"></div>
                    <div className = "dashboard-page-view-activity-showing">
                        Showing {currentPage * 10 + 1} {" "}
                        to {" "}
                        {currentPage === lastPage ? displayLength : (currentPage + 1) * 10} {" "}
                        of {" "}
                        {displayLength} entries
                    </div>
                </div>
            }
            {/* buttons */}
            <div className = "dashboard-page-view-activity-pagination-container">
                <div 
                    className = {currentPage === lastPage ? "dashboard-page-view-activity-next" : "dashboard-page-view-activity-next-active"}
                    onClick = {handleNextClick}>
                    NEXT
                </div>
                {lastPage > 1 && pageList}
                <div 
                    className = {currentPage === 0 ? "dashboard-page-view-activity-prev" : "dashboard-page-view-activity-prev-active"}
                    onClick = {handlePrevClick}>
                    PREVIOUS
                </div>
            </div>
        </div>
    );
}

export default ActivityLog;