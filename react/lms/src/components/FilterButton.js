import React from "react";

function FilterButton(props)
{
    return(
        <button type = "button" className = "btn toggle-btm" aria-pressed = "true">
            <span className = "visually-hidden"> Show </span>
            <span>all</span>
            <span className = "visually-hidden"> tasks </span>
        </button>
    );
}

export default FilterButton;