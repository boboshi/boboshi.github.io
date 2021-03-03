import React, {useState} from "react";

import AddGroupIcon from "../resources/dashboard/usermanagement-addgroup.svg";
import ButtonIcon from "../resources/dashboard/usermanagement-addbox-button.svg";

function UserManagementAddGroup(props)
{
    function handleOpenMenu()
    {
        props.setOpen(!props.open);
    }

    return(
        <div className = "dashboard-page-usermanagement-addgroup-container">
            {/* main card */}
            <div 
                className = "dashboard-usermanagement-addbox-box" 
                style = {props.open ? {borderRadius: "6px 6px 0px 0px"} : {borderRadius: "6px 6px 6px 6px"}}
            >
                {/* icon */}
                <img alt = "" src = {AddGroupIcon} className = "dashboard-usermanagement-addbox-icon"></img>
                {/* title */}
                <div className = "dashboard-usermanagement-addbox-title">
                    Add New Group
                </div>
                {/* text */}
                <div className = "dashboard-usermanagement-addbox-text">
                    Create new group to maintain your smart estate.
                </div>
                {/* button */}
                <div 
                    className = "dashboard-usermanagement-addbox-button"
                    style = {props.enabled ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
                    onClick = {handleOpenMenu}
                >
                    <img alt = "" src = {ButtonIcon} className = "dashboard-usermanagement-addbox-button-icon"></img>
                    <div className = "dashboard-usermanagement-addbox-button-text">
                        Create New Group
                    </div>
                </div>
            </div>
            {/* dropdown menu */}
            {props.open &&
                <div className = "dashboard-usermanagement-addbox-dropdown-container">
                    PUT THE INPUTS HERE
                </div>
            }
        </div>
    );
}

export default UserManagementAddGroup;