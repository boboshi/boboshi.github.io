import React, {useState} from "react";

import AddGroupIcon from "../resources/dashboard/usermanagement-addgroup.svg";
import ButtonIcon from "../resources/dashboard/usermanagement-addbox-button.svg";

function UserManagementAddGroup(props)
{
    const [groupname, setGroupname] = useState("");

    function handleOpenMenu()
    {
        props.setOpen(!props.open);
    }

    function handleChangeGroupName(e)
    {
        setGroupname(e.target.value);
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        props.add(groupname);
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
                    <form onSubmit = {handleSubmit}>
                        <input
                            type = "text"
                            id = "usermanagement-input-groupname"
                            className = "dashboard-usermanagement-addbox-input"
                            name = "groupname"
                            value = {groupname}
                            placeholder = "GROUP NAME"
                            onChange = {handleChangeGroupName}
                        ></input>
                        {/* register button */}
                        <button className = "dashboard-usermanagement-addbox-submit" type = "submit">
                            CREATE GROUP
                        </button>
                    </form>
                </div>
            }
        </div>
    );
}

export default UserManagementAddGroup;