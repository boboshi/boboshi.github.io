import "../resources/css/tablesortbutton.css";

import DownArrow from "../resources/dashboard/chevron-down-outline.png";
import UpArrow from "../resources/dashboard/chevron-up-outline.png";

import React from "react";

// props.sort 0 - no arrows 1 - up 2 - down

function TableSortButton(props)
{
    return(
        <div className = "dashboard-view-tablesort-btn" onClick = {props.onClick}>
            <img
                alt = ""
                src = {UpArrow}
                className = {props.sort === 1 ? "dashboard-view-tablesort-up" : "dashboard-view-tablesort-up-off"}
            ></img>
            <img
                alt = ""
                src = {DownArrow}
                className = {props.sort === 2 ? "dashboard-view-tablesort-down" : "dashboard-view-tablesort-down-off"}
            ></img>
        </div>
    );
}

export default TableSortButton;