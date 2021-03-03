import React from "react";

import DeleteIconBlack from "../resources/dashboard/usermanagement-delete-black.svg";
import DeleteIconOrange from "../resources/dashboard/usermanagement-delete-orange.svg";

function UserManagementGroup(props)
{
    function handleDelete()
    {

    }

    return(
        <div className = "dashboard-usermanagement-group-container">
            {/* header */}
            <div className = "dashboard-usermanagement-group-header" style = {{backgroundColor: props.headerColour}}>
                <img alt = "" src = {props.headerIcon} className = "dashboard-usermanagement-group-header-icon"></img>
                <div className = "dashboard-usermanagement-group-header-title">
                    {props.name}
                </div>
                <div className = "dashboard-usermanagement-group-header-text">
                    {props.description}
                </div>
                <img 
                    alt = "" 
                    src = {DeleteIconBlack} 
                    className = "dashboard-usermanagement-group-header-delete"
                    onClick = {handleDelete}
                ></img>
                <div className = "dashboard-usermanagement-group-header-blocks-container">
                    
                </div>
            </div>
            AISAOUSHAUOSHAOS
        </div>
    );
}

export default UserManagementGroup;