import "../resources/css/dashboarddropdown.css";

import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import DownArrow from "../resources/dashboard/chevron-down-outline.png";
import UpArrow from "../resources/dashboard/chevron-up-outline.png";

const Dropdown = forwardRef((props, ref) =>
{
    const node = useRef();
    const [choice, setChoice] = useState(props.initial);
    const [isOpen, setIsOpen] = useState(false);

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
        if (node.current.contains(e.target))
            return;
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
        <div className = "dashboard-page-dropdown-list">
            <ul className = "dashboard-page-dropdown-ul">
                {optionsList}
            </ul>
        </div>
    );

    return(
        <div ref = {node} className = "dashboard-page-dropdown" onClick = {handleDropdownClick}>
            <h1 className = "dashboard-page-dropdown-titletext">
                {props.title}
            </h1>
            <h1 className = "dashboard-page-dropdown-choicetext">
                {choice}
            </h1>
            <img 
                alt = ""
                src = {isOpen ? UpArrow : DownArrow} 
                className = "dashboard-page-dropdown-arrow">
            </img>
            {isOpen && openMenuTemplate}
        </div>
    );
})

export default Dropdown;