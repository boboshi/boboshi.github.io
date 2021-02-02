import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import DownArrow from "../resources/dashboard/chevron-down-outline.png";
import UpArrow from "../resources/dashboard/chevron-up-outline.png";
import DefaultUser from "../resources/dashboard/blank_user.png";

const UserDropdown = forwardRef((props, ref) =>
{
    const node = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [currUser, setCurrUser] = useState(props.currUser);
    const [lastLogin, setLastLogin] = useState(null);

    const userList = props.userList.map(user =>
        <div key = {user.name}>

        </div>
    );

    useImperativeHandle(ref, () => ({
        placeholderFunc()
        {
            console.log("why are you here");
        }
    }));

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
        <div>
            <div className = "dashboard-page-header-user-dropdown-list">
                <ul className = "dashboard-page-header-user-dropdown-ul">
                    {userList}
                </ul>
            </div>
        </div>
    );

    return(
        <div ref = {node} className = "dashboard-page-header-user-dropdown" onClick = {handleDropdownClick}>
            <h1 className = "dashboard-page-header-user-dropdown-name">{currUser.name}</h1>
            <h1 className = "dashboard-page-header-user-dropdown-role">{currUser.role}</h1>
            <img
                alt = ""
                src = {currUser.image === "default" ? DefaultUser : DefaultUser}
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
})

export default UserDropdown;