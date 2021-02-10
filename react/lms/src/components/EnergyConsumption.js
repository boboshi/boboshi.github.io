import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/dashboard header.svg";
import EnergyIcon from "../resources/dashboard/chart-area-solid.svg";

import EnergyConsumptionOption from "../components/EnergyConsumptionOption";
import EnergyConsumptionGraph from "../components/EnergyConsumptionGraph";

function EnergyConsumption(props)
{
    // 1D, 5D, 1M, 1Y, 3Y
    const [currDisplayOption, setCurrDisplayOption] = useState("1D");
    const [energyData, setEnergyData] = useState([]);

    const data = [
        {t: 59400, Present: 0.02},
        {t: 73800, Present: 0.035},
        {t: 88200, Present: 0.025},
        {t: 102600, Present: 0.042},
        {t: 117000, Present: 0.078},
        {t: 131400, Present: 0.07},
        {t: 145800, Present: 0.06},
    ];

    const data0 = [
         {t: 59400, Past: 0.005},
         {t: 73800, Past: 0.019},
         {t: 88200, Past: 0.018},
         {t: 102600, Past: 0.021},
         {t: 117000, Past: 0.017},
         {t: 131400, Past: 0.042},
         {t: 145800, Past: 0.048},
    ];

    useEffect(() =>
    {
        // simulate getting data
        setEnergyData([data, data0]);
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
        <EnergyConsumptionGraph data = {energyData}/>
    );

    return(
        <div className = "dashboard-page-view-energy-container">
            <img alt = "" src = {EnergyIcon} className = "dashboard-page-view-energy-icon"></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-header-text">ENERGY CONSUMPTION</h1>
                <img alt = "" src = {Header} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            {/* axis labels */}
            <div className = "dashboard-page-view-energy-yaxis">
                (KwH)
            </div>
            <div className = "dashboard-page-view-energy-xaxis">
                {currDisplayOption === "1D" && "(Hours)"}
                {currDisplayOption === "5D" && "(Days)"}
                {currDisplayOption === "1M" && "(????)"}
                {currDisplayOption === "1Y" && "(Months)"}
                {currDisplayOption === "3Y" && "(Years)"}
            </div>
            {/* present, past labels */}
            <div className = "dashboard-page-view-energy-present">
                Present
            </div>
            <div className = "dashboard-page-view-energy-present-img"></div>
            <div className = "dashboard-page-view-energy-past">
                Past
            </div>
            <div className = "dashboard-page-view-energy-past-img"></div>
            {/* graph */}
            {displayOptions}
            {displayGraph}
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default EnergyConsumption;