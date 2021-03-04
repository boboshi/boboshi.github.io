import React, {useState} from "react";

import DeleteIconBlack from "../resources/dashboard/usermanagement-delete-black.svg";
import DeleteIconOrange from "../resources/dashboard/usermanagement-delete-orange.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";

function BlockDisplay(props)
{
    const [selected, setSelected] = useState(true);

    function handleClick()
    {
        setSelected(!selected);
    }

    return(
        <div key = {props.name} className = "dashboard-usermanagement-group-header-block">
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
            AISAOUSHAUOSHAOS
        </div>
    );
}

export default UserManagementGroup;