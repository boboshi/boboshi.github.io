import "../resources/css/usermanagementrightbox.css";

import React, {useState} from "react";

import ButtonIcon from "../resources/dashboard/usermanagement-rightbox-button.svg";

function UserManagementRightBox(props)
{
    const [open, setOpen] = useState(false);

    function handleOpenMenu()
    {
        setOpen(!open);
    }

    return(
        <div>
            {/* main card */}
            <div 
                className = "dashboard-usermanagement-rightbox-box" 
                style = {open ? {borderRadius: "6px 6px 0px 0px"} : {borderRadius: "6px 6px 6px 6px"}}
            >
                {/* icon */}
                <img alt = "" src = {props.icon} className = "dashboard-usermanagement-rightbox-icon"></img>
                {/* title */}
                <div className = "dashboard-usermanagement-rightbox-title">
                    {props.title}
                </div>
                {/* text */}
                <div className = "dashboard-usermanagement-rightbox-text">
                    {props.text}
                </div>
                {/* button */}
                <div 
                    className = "dashboard-usermanagement-rightbox-button"
                    style = {props.enabled ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
                    onClick = {handleOpenMenu}
                >
                    <img alt = "" src = {ButtonIcon} className = "dashboard-usermanagement-rightbox-button-icon"></img>
                    <div className = "dashboard-usermanagement-rightbox-button-text">
                        {props.addText}
                    </div>
                </div>
            </div>
            {/* dropdown menu */}
            {open &&
                <div className = "dashboard-usermanagement-rightbox-dropdown-container">
                    
                </div>
            }
        </div>
    );
}

export default UserManagementRightBox;