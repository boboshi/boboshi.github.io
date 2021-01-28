import React, {useState, useEffect, useRef} from "react";
import DownArrow from "../resources/dashboard/chevron-down-outline.png";
import UpArrow from "../resources/dashboard/chevron-up-outline.png";

function Dropdown(props)
{
    const node = useRef();
    const [choice, setChoice] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const optionsList = props.options.map(option =>
        <li 
             onClick = {() => {
                                props.selectOption(option);
                                setChoice(option);
                                setIsOpen(false);
                              }}
        >
            {option}
        </li>
    );

    const handleClickOutside = e => {
        if (node.current.contains(e.target)) {
          // inside click
          return;
        }
        // outside click
        setIsOpen(false);
    };

    function handleDropdownClick()
    {
        setIsOpen(!isOpen);

        // !isOpen is intentional
        if (!isOpen)
        {
            // open
        }
        else
        {
            // closed
        }
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
        <div ref={node} className = "dashboard-page-dropdown">
            <h1 className = "dashboard-page-dropdown-titletext">
                {props.title}
            </h1>
            <h1 className = "dashboard-page-dropdown-choicetext">
                {choice}
            </h1>
            <img 
                src = {isOpen ? UpArrow : DownArrow} 
                className = "dashboard-page-dropdown-arrow">
            </img>
            <button 
                className = "dashboard-page-dropdownbtn"
                onClick = {handleDropdownClick}
            ></button>
            {isOpen && openMenuTemplate}
        </div>
    );
}

export default Dropdown;