import React, {useState} from "react";

import DeleteIconBlack from "../resources/dashboard/usermanagement-delete-black.svg";
//import DeleteIconOrange from "../resources/dashboard/usermanagement-delete-orange.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";
import NewMemberIcon from "../resources/dashboard/usermanagement-newmember-icon.svg";

function UserCard(props)
{
    return(
        <div 
            className = "dashboard-usermanagement-group-user" 
            style = {props.active ? {backgroundColor: "FFFFFF"} : {backgroundColor: "#E0E0E0"}}
        >
            <img alt = "" src = {props.icon} className = "dashboard-usermanagement-group-user-icon"></img>
            <div className = "dashboard-usermanagement-group-user-name">{props.name}</div>
            <div className = "dashboard-usermanagement-group-user-type">{props.type}</div>
            <div className = "dashboard-usermanagement-group-user-date">{props.loginDate}</div>
            <div className = "dashboard-usermanagement-group-user-time">{props.loginTime}</div>
            <div 
                className = "dashboard-usermanagement-group-user-active"
                style = {props.active ? {backgroundColor: "#A0BC34"} : {backgroundColor: "#F07E0B"}}
            ></div>
        </div>
    );
}

function BlockDisplay(props)
{
    const [selected, setSelected] = useState(true);

    function handleClick()
    {
        setSelected(!selected);
    }

    return(
        <div className = "dashboard-usermanagement-group-header-block">
            <div className = "dashboard-usermanagement-group-header-block-text">
                {props.name}
            </div>
            <img 
                alt = "" 
                src = {selected ? RadioButtonOn : RadioButtonOff} 
                className = "dashboard-usermanagement-group-header-block-radio"
                onClick = {handleClick}
            ></img>
        </div>
    );
}

function UserManagementGroup(props)
{
    const blockList = props.blocks.map(block => 
        <BlockDisplay key = {block} name = {block} />
    );

    const userList = props.users.map(user =>
        <UserCard 
            key = {user.name}
            icon = {user.userIcon} 
            name = {user.name}
            type = {user.type}
            loginDate = {user.lastLoginDate}
            loginTime = {user.lastLoginTime}
            active = {user.active}
        />
    );

    function handleDelete()
    {
        props.delete(props.name);
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
                    {blockList}
                </div>
            </div>
            <div className = "dashboard-usermanagement-group-user-container">
                {userList}
                <div className = "dashboard-usermanagement-group-newmember">
                    <img alt = "" src = {NewMemberIcon} className = "dashboard-usermanagement-group-user-icon"></img>
                    <div className = "dashboard-usermanagement-group-newmember-text">Add New Member</div>
                </div>
            </div>
        </div>
    );
}

export default UserManagementGroup;