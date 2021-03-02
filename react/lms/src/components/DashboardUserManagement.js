import "../resources/css/dashboardusermanagement.css";
import "../resources/css/usermanagementrightbox.css";

import React from "react";

import UserManagementAddGroup from "./UserManagementAddGroup";
import UserManagementAddUser from "./UserManagementAddUser";

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
                <UserManagementAddGroup
                    enabled = {props.block}
                />
                <UserManagementAddUser
                    enabled = {props.block}
                />
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