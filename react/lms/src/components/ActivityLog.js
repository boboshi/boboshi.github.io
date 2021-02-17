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

function ActivityLog(props)
{
    const sortTypes = 
    {
        user_descending: 
        {
            class: "user_descending",
            fn: (a, b) => a.user.localeCompare(b.user)
        },
        user_ascending: 
        {
            class: "user_ascending",
            fn: (a, b) => b.user - a.user
        },
        action_descending: 
        {
            class: "action_descending",
            fn: (a, b) => a.action - b.action
        },
        action_ascending: 
        {
            class: "action_ascending",
            fn: (a, b) => b.action - a.action
        }
    };

    const entriesRef = useRef();

    const [entriesOptions, setEntriesOptions] = useState([10, 20, 30]);
    const [currentOption, setCurrentOption] = useState(10);
    // user_descending, user_ascending, action_descending, action_ascending
    const [sortingMode, setSortingMode] = useState("user_descending");

    const [activityData, setActivityData] = useState([]);

    let activityList = activityData.length && [...activityData].sort(sortTypes[sortingMode].fn).map(activity =>
        <tr key = {activity.user + activity.action}>
            <td className = "dashboard-page-view-activity-table-user">{activity.user}</td>
            <td className = "dashboard-page-view-activity-table-action">{activity.action}</td>
        </tr>
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

        setActivityData(a);
    }, []);

    function handleActivityLogRefresh()
    {
        console.log("activity log refresh");
    }

    function handleSelectOption(option)
    {
        setCurrentOption(option);
    }

    function handleUserClick()
    {
        var tmp;

        if (sortingMode === "action_descending" || sortingMode === "action_ascending" || sortingMode === "user_ascending")
        {
            setSortingMode("user_descending");
            tmp = "user_descending";
        }        
        else
        {
            setSortingMode("user_ascending");
            tmp = "user_ascending";
        }
    }

    function handleActionClick()
    {
        var tmp;

        if (sortingMode === "user_descending" || sortingMode === "user_ascending" || sortingMode === "action_ascending")
        {
            setSortingMode("action_descending");
            tmp = "action_descending";
        }
        else
        {
            setSortingMode("action_ascending");
            tmp = "action_ascending";

        }
    }

    // table sorting
    if (sortingMode === "user_descending")
    {

    }
    else if (sortingMode === "user_ascending")
    {

    }
    else if (sortingMode === "action_descending")
    {

    }
    else
    {

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
                    default = {10}
                    options = {entriesOptions}
                    selectOption = {handleSelectOption}
                    disabled = {false}
                ></GenericDropdown>
            </div>
            {/* table */}
            {/* 0 - no arrows 1 - up 2 - down */}
            {activityList &&
                <div className = "dashboard-page-view-activity-table-container">
                    <div className = "dashboard-page-view-activity-table-header">
                        <div className = "dashboard-page-view-activity-table-header-user">
                            <TableSortButton 
                                onClick = {handleUserClick} 
                                sort = {sortingMode === "user_descending" ? 2 : (sortingMode === "user_ascending" ? 1 : 0)}
                            />
                            USER
                        </div>
                        <div className = "dashboard-page-view-activity-table-header-action">
                            <TableSortButton 
                                onClick = {handleActionClick}
                                sort = {sortingMode === "action_descending" ? 2 : (sortingMode === "action_ascending" ? 1 : 0)}
                            />
                            ACTION
                        </div>
                    </div>
                    <div className = "dashboard-page-view-activity-table-divider"></div>
                    <table className = "dashboard-page-view-activity-table">
                        <tbody>
                            {activityList}
                        </tbody>
                    </table>
                    <div className = "dashboard-page-view-activity-table-divider2"></div>
                    <div className = "dashboard-page-view-activity-showing">
                        Showing {0} {" "}
                        to {" "}
                        {0} {" "}
                        of {" "}
                        {0} entries
                    </div>
                </div>
            }
        </div>
    );
}

export default ActivityLog;