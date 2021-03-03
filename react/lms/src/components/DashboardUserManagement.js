import "../resources/css/dashboardusermanagement.css";
import "../resources/css/usermanagementaddbox.css";

import React, {useState} from "react";

import UserManagementAddGroup from "./UserManagementAddGroup";
import UserManagementAddUser from "./UserManagementAddUser";

function DashboardUserManagement(props)
{
    const [addGroupOpen, setAddGroupOpen] = useState(false);
    const [addUserOpen, setAddUserOpen] = useState(false);

    function toggleAddGroupOpen(open)
    {
        setAddGroupOpen(open);
        if (open)
            setAddUserOpen(false);
    }

    function toggleAddUserOpen(open)
    {
        setAddUserOpen(open);
        if (open)
            setAddGroupOpen(false);
    }

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
            <div className = "dashboard-page-usermanagement-add-container">
                <UserManagementAddGroup
                    enabled = {props.block}
                    open = {addGroupOpen}
                    setOpen = {toggleAddGroupOpen}
                />
                <UserManagementAddUser
                    enabled = {props.block}
                    open = {addUserOpen}
                    setOpen = {toggleAddUserOpen}
                    userTypes = {["Operator", "Area Admin"]}
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