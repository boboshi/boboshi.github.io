import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/dashboard header.svg";
import EnergyIcon from "../resources/dashboard/chart-area-solid.svg";

import EnergyConsumptionOption from "../components/EnergyConsumptionOption";

function EnergyConsumption(props)
{
    // 1D, 5D, 1M, 1Y, 3Y
    const [currDisplayOption, setCurrDisplayOption] = useState("1D");

    useEffect(() =>
    {
        // simulate getting data
    }, []);

    function handleOneDClick()
    {
        setCurrDisplayOption("1D");
    }

    function handleFiveDClick()
    {
        setCurrDisplayOption("5D");
    }

    function handleOneMClick()
    {
        setCurrDisplayOption("1M");
    }

    function handleOneYClick()
    {
        setCurrDisplayOption("1Y");
    }

    function handleThreeYClick()
    {
        setCurrDisplayOption("3Y");
    }

    const displayOptions = 
    (
        <div className = "dashboard-page-view-energy-options-container">
            <EnergyConsumptionOption click = {handleOneDClick} text = "1D" curr = {currDisplayOption} />
            <EnergyConsumptionOption click = {handleFiveDClick} text = "5D" curr = {currDisplayOption} />
            <EnergyConsumptionOption click = {handleOneMClick} text = "1M" curr = {currDisplayOption} />
            <EnergyConsumptionOption click = {handleOneYClick} text = "1Y" curr = {currDisplayOption} />
            <EnergyConsumptionOption click = {handleThreeYClick} text = "3Y" curr = {currDisplayOption} />
        </div>
    );

    const displayGraph =
    (
        <div>
            {currDisplayOption === "1D" &&
            <div>
                ONE DAY
            </div>}
        
            {currDisplayOption === "5D" &&
            <div>
                FIVE DAYS
            </div>}
        
            {currDisplayOption === "1M" &&
            <div>
                ONE MONTH
            </div>}
        
            {currDisplayOption === "1Y" &&
            <div>
                ONE YEAR
            </div>}
        
            {currDisplayOption === "3Y" &&
            <div>
                THREE YEARS
            </div>}
        </div>
    );

    return(
        <div className = "dashboard-page-view-energy-container">
            <img alt = "" src = {EnergyIcon} className = "dashboard-page-view-energy-icon"></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-header-text">ENERGY CONSUMPTION</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            {displayOptions}
            {displayGraph}
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default EnergyConsumption;