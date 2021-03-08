import "../resources/css/dashboardusermanagement.css";
import "../resources/css/usermanagementaddbox.css";
import "../resources/css/usermanagementgroup.css";

import React, {useEffect, useState} from "react";

import DefaultUser from "../resources/dashboard/usermanagement-default-user.svg";
import HDBIcon from "../resources/dashboard/hdb.png";

import UserManagementAddGroup from "./UserManagementAddGroup";
import UserManagementAddUser from "./UserManagementAddUser";
import UserManagementGroup from "./UserManagementGroup";

const colours = ["#65B4C1", "#6A59E6"];

class User
{
    constructor(name, type, lastLoginDate, lastLoginTime, active, userIcon)
    {
        this.name = name;
        this.type = type;
        this.lastLoginDate = lastLoginDate;
        this.lastLoginTime = lastLoginTime;
        this.active = active;
        this.userIcon = userIcon;
    }
}

class Group
{
    constructor(name, description, blocks, users, headerIcon, headerColour)
    {
        this.name = name;
        this.description = description;
        this.blocks = blocks;
        this.users = users;
        this.headerIcon = headerIcon;
        this.headerColour = headerColour;
    }
};

function DashboardUserManagement(props)
{
    const [addGroupOpen, setAddGroupOpen] = useState(false);
    const [addUserOpen, setAddUserOpen] = useState(false);

    const [userArray, setUserArray] = useState([]);
    const [groupArray, setGroupArray] = useState([]);

    const groupList = groupArray.map(group =>
        <UserManagementGroup
            key = {group.name}
            name = {group.name}
            description = {group.description}
            blocks = {group.blocks}
            users = {group.users}
            headerIcon = {group.headerIcon}
            headerColour = {group.headerColour}
            delete = {deleteGroup}
        />
    );

    // simulate getting data
    useEffect(() =>
    {
        var user0 = new User("Viola Chan", "Operator", "03-09-20", "15:15:30", true, DefaultUser);
        var user1 = new User("Manmo Wong", "Operator", "03-09-20", "15:15:30", false, DefaultUser);
        var user2 = new User("Nora Bravo", "Operator", "03-09-20", "15:15:30", true, DefaultUser);

        var group0 = new Group("Geylang, Dakota", 
                               "HDB 60 Dakota Crescent", 
                               ["Office_lights", "Home_Lights"],
                               [user0, user1, user2],
                               HDBIcon,
                               colours[0]);
        var group1 = new Group("Jurong East, Pandan", 
                               "AZ Marine", 
                               ["Pandan_AzMarine"],
                               [user0, user1],
                               HDBIcon,
                               colours[1]);
        
        setUserArray([user0, user1, user2]);
        setGroupArray([group0, group1]);
    }, []);

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

    function createGroup(name)
    {
        let groups = [...groupArray];
        var tmp = new Group(name, 
                            "AZ Test", 
                            [],
                            [],
                            HDBIcon,
                            colours[1]);
        groups.push(tmp);
        setGroupArray(groups);
    }

    function addUser(username)
    {
        console.log(username + " registered")
    }

    function deleteGroup(name)
    {
        let groups = [...groupArray];

        groups = groups.filter(item => item.name !== name);
        setGroupArray(groups);
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
                    add = {createGroup}
                />
                <UserManagementAddUser
                    enabled = {props.block}
                    open = {addUserOpen}
                    setOpen = {toggleAddUserOpen}
                    userTypes = {["Operator", "Area Admin"]}
                    add = {addUser}
                />
            </div>
            {/* group cards */}
            {props.location && groupList}
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