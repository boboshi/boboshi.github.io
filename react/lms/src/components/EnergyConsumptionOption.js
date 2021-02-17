import React from "react";

function EnergyConsumptionOption(props)
{
    return(
        <span>
            {props.text === props.curr ?
            <div
                className = "dashboard-page-view-energy-options-btn-selected"
                onClick = {props.click}
            >
                {props.text}
            </div> :
            <div
                className = "dashboard-page-view-energy-options-btn"
                onClick = {props.click}
            >
                {props.text}
            </div>}
        </span>
    );
};

export default EnergyConsumptionOption;