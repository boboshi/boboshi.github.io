import "../resources/css/tablesortbutton.css";

import React, {useState} from "react";

function TableSortButton(props)
{
    //const openMenuTemplate =
    //(
    //    <div className = "dashboard-page-dropdown-list">
    //        <ul className = "dashboard-page-dropdown-ul">
    //            {optionsList}
    //        </ul>
    //    </div>
    //);

    return(
        <div className = "dashboard-view-tablesort-btn" onClick = {props.onClick}>
            {props.sort}
        </div>
    );
}

export default TableSortButton;