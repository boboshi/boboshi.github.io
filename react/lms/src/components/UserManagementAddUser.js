import React, {useState} from "react";

import AddUserIcon from "../resources/dashboard/usermanagement-adduser.svg";
import ButtonIcon from "../resources/dashboard/usermanagement-rightbox-button.svg";

function UserManagementAddUser(props)
{
    const [open, setOpen] = useState(false);

    function handleOpenMenu()
    {
        setOpen(!open);
    }

    return(
        <div className = "dashboard-page-usermanagement-adduser-container">
            {/* main card */}
            <div 
                className = "dashboard-usermanagement-rightbox-box" 
                style = {open ? {borderRadius: "6px 6px 0px 0px"} : {borderRadius: "6px 6px 6px 6px"}}
            >
                {/* icon */}
                <img alt = "" src = {AddUserIcon} className = "dashboard-usermanagement-rightbox-icon"></img>
                {/* title */}
                <div className = "dashboard-usermanagement-rightbox-title">
                    Register New User
                </div>
                {/* text */}
                <div className = "dashboard-usermanagement-rightbox-text">
                    Register new user to control the smart system light for your estate.
                </div>
                {/* button */}
                <div 
                    className = "dashboard-usermanagement-rightbox-button"
                    style = {props.enabled ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
                    onClick = {handleOpenMenu}
                >
                    <img alt = "" src = {ButtonIcon} className = "dashboard-usermanagement-rightbox-button-icon"></img>
                    <div className = "dashboard-usermanagement-rightbox-button-text">
                        Register New User
                    </div>
                </div>
            </div>
            {/* dropdown menu */}
            {open &&
                <div className = "dashboard-usermanagement-rightbox-dropdown-container">
                    FUCK
                </div>
            }
        </div>
    );
}

export default UserManagementAddUser;