import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";

import DownArrow from "../resources/dashboard/icon-dropdown-down.svg";

const GenericDropdown = forwardRef((props, ref) =>
{
    const node = useRef();
    const [choice, setChoice] = useState("");
    const [isOpen,setIsOpen] = useState(false);

    const optionsList = props.options.map(option =>
        <li 
             key = {option}
             onClick = {() => {
                                props.selectOption(option);
                                setChoice(option);
                                setIsOpen(false);
                              }}
        >
            {option}
        </li>
    );

    useImperativeHandle(ref, () => ({
        clearChoice()
        {
            setChoice("");
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
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {document.removeEventListener("mousedown", handleClickOutside);};
    }, []);

    const openMenuTemplate =
    (
        <div className = "dashboard-page-view-dropdown-list">
            <ul className = "dashboard-page-view-dropdown-ul">
                {optionsList}
            </ul>
        </div>
    );

    return(
        <div ref = {node} className = "dashboard-page-view-dropdown" onClick = {handleDropdownClick}>
            <h1 className = "dashboard-page-view-dropdown-choicetext">
                {choice}
            </h1>
            {isOpen ?             
                <img 
                    alt = ""
                    src = {DownArrow}
                    className = "dashboard-page-view-dropdown-uparrow"
                ></img> :
                <img 
                    alt = ""
                    src = {DownArrow}
                    className = "dashboard-page-view-dropdown-downarrow"
                ></img>
            }
            {isOpen && openMenuTemplate}
        </div>
    );
});

export default GenericDropdown;