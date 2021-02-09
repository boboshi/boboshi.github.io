import "../resources/css/userdropdown.css"

import React, {useState, useEffect, useRef} from "react";
import DownArrow from "../resources/dashboard/chevron-down-outline.png";
import UpArrow from "../resources/dashboard/chevron-up-outline.png";
import AddUser from "../resources/dashboard/icon-userdropdown-add.svg";
import UserSettings from "../resources/dashboard/icon-userdropdown-settings.svg";
import Logout from "../resources/dashboard/icon-userdropdown-logout.svg";

function UserDropdown(props)
{
    const node = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [lastLogin, setLastLogin] = useState(null);

    const userList = props.userList.map(user =>
        <div key = {user.name}>
            <li onClick = {handleClick.bind(this, user.name)}>
                <div className = "dashboard-page-header-user-dropdown-li-name">{user.name}</div>
                <div className = "dashboard-page-header-user-dropdown-li-role">{user.role}</div>
                <img
                    alt = ""
                    src = {user.image}
                    className = "dashboard-page-header-user-dropdown-li-image">
                </img>
            </li>
        </div>
    );

    function handleClick(str)
    {
        props.changeUser(str);
    }

    const handleClickOutside = e => 
    {
        if (node.current)
            if (node.current.contains(e.target)) 
                return;
            else
                setIsOpen(false);
    };

    function handleDropdownClick()
    {
        setIsOpen(!isOpen);
    }

    useEffect(() => 
    {    
        setLastLogin("Last login: 23/10/20 17:30:30");
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {document.removeEventListener("mousedown", handleClickOutside);};
    }, []);

    const openTemplate =
    (
        <div className = "dashboard-page-header-user-dropdown-list">
            <ul className = "dashboard-page-header-user-dropdown-ul">
                {userList}
                <li onClick = {props.addUser}>
                    <div className = "dashboard-page-header-user-dropdown-li-misctext">ADD USER</div>
                    <img
                        alt = ""
                        src = {AddUser}
                        className = "dashboard-page-header-user-dropdown-li-image">
                    </img>
                </li>
                <li onClick = {props.userSettings}>
                    <div className = "dashboard-page-header-user-dropdown-li-misctext">USER SETTINGS</div>
                    <img
                        alt = ""
                        src = {UserSettings}
                        className = "dashboard-page-header-user-dropdown-li-image">
                    </img>
                </li>
                <li onClick = {props.logout}>
                    <div className = "dashboard-page-header-user-dropdown-li-logout">LOGOUT</div>
                    {lastLogin != null && 
                    <div className = "dashboard-page-header-user-dropdown-li-logouttime">{lastLogin}</div>}
                    <img
                        alt = ""
                        src = {Logout}
                        className = "dashboard-page-header-user-dropdown-li-image">
                    </img>
                </li>
            </ul>
        </div>
    );

    return(
        <div ref = {node} className = "dashboard-page-header-user-dropdown" onClick = {handleDropdownClick}>
            <h1 className = "dashboard-page-header-user-dropdown-name">{props.currUser.name}</h1>
            <h1 className = "dashboard-page-header-user-dropdown-role">{props.currUser.role}</h1>
            <img
                alt = ""
                src = {props.currUser.image}
                className = "dashboard-page-header-user-dropdown-image">
            </img>
            <img
                alt = ""
                src = {isOpen ? UpArrow : DownArrow}
                className = "dashboard-page-header-user-dropdown-arrow">
            </img>
            {isOpen && openTemplate}
        </div>
    );
}

export default UserDropdown;