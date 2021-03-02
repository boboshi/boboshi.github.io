import "../resources/css/dashboardusermanagement.css";

import React from "react";

import AddGroupIcon from "../resources/dashboard/usermanagement-addgroup.svg";
import AddUserIcon from "../resources/dashboard/usermanagement-adduser.svg";

import UserManagementRightBox from "./UserManagementRightBox";

function DashboardUserManagement(props)
{
    function handleRevoke()
    {
        console.log("AJISASKAS");
    }

    function handleUpdate()
    {
        console.log("what the fuck");
    }

    function placeholder() {}

    return(
        <div className = "dashboard-page-usermanagement">
            {/* add group and add user cards */}
            {/* 
                types - text, list, password 
                for list, first element in array is placeholder name, subsequent
                elements are options
            */}
            <div className = "dashboard-page-usermanagement-add-container">
                <div className = "dashboard-page-usermanagement-addgroup-container">
                    <UserManagementRightBox
                        icon = {AddGroupIcon}
                        title = {"Add New Group"}
                        text = {"Create new group to maintain your smart estate."}
                        addText = {"Create New Group"}
                        inputList = {["GROUP NAME"]}
                        inputTypes = {["text"]}
                        buttonText = {"CREATE"}
                        enabled = {props.block}
                    />
                </div>
                <div className = "dashboard-page-usermanagement-adduser-container">
                    <UserManagementRightBox
                        icon = {AddUserIcon}
                        title = {"Add New User"}
                        text = {"Register new user to control the smart system light for your estate."}
                        addText = {"Register New User"}
                        inputList = {["USER NAME", ["USER TYPE", "NORMAL", "ADMIN"], "EMAIL", "CONTACT NUMBER", "PASSWORD", "CONFIRM PASSWORD"]}
                        inputTypes = {["text", "list", "text", "text", "password", "password"]}
                        buttonText = {"REGISTER"}
                        enabled = {props.block}
                    />
                </div>
            </div>
            {/* buttons */}
            <div 
                className = "dashboard-page-usermanagement-revoke" 
                onClick = {props.block ? handleRevoke : placeholder}
            >
                REVOKE ALL ACCESS
            </div>
            <div
                className = "dashboard-page-usermanagement-update" 
                onClick = {props.block ? handleUpdate : placeholder}
            >
                UPDATE ACCESS
            </div>
        </div>
    );
}

export default DashboardUserManagement;