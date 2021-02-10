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

    useEffect(() =>
    {
        // simulate getting data
        const data0 = [
            {t: 59400, Present: 0.02},
            {t: 73800, Present: 0.035},
            {t: 88200, Present: 0.025},
            {t: 102600, Present: 0.042},
            {t: 117000, Present: 0.078},
            {t: 131400, Present: 0.07},
            {t: 145800, Present: 0.06},
        ];
        
        const data1 = [
             {t: 59400, Past: 0.005},
             {t: 73800, Past: 0.019},
             {t: 88200, Past: 0.018},
             {t: 102600, Past: 0.021},
             {t: 117000, Past: 0.017},
             {t: 131400, Past: 0.042},
             {t: 145800, Past: 0.048},
        ];
        // 0.35 for a day estimated
        const data2 = [
            {t: 1, Present: 0.29},
            {t: 2, Present: 0.31},
            {t: 3, Present: 0.19},
            {t: 4, Present: 0.39},
            {t: 5, Present: 0.35},
        ];
    
        const data3 = [
             {t: 1, Past: 0.25},
             {t: 2, Past: 0.31},
             {t: 3, Past: 0.29},
             {t: 4, Past: 0.23},
             {t: 5, Past: 0.17},
        ];
        // 2.45 for a week estimated
        const data4 = [
            {t: 1, Present: 1.9},
            {t: 2, Present: 2.34},
            {t: 3, Present: 2.18},
            {t: 4, Present: 2.45},
        ];
    
        const data5 = [
             {t: 1, Past: 2.6},
             {t: 2, Past: 2.5},
             {t: 3, Past: 1.79},
             {t: 4, Past: 2.22},
        ];
        // 8.87 for a month estimated
        const data6 = [
            {t: 1, Present: 8.79},
            {t: 2, Present: 6.98},
            {t: 3, Present: 7.12},
            {t: 4, Present: 7.89},
            {t: 5, Present: 8.3},
            {t: 6, Present: 8.01},
            {t: 7, Present: 7.5},
            {t: 8, Present: 7.68},
            {t: 9, Present: 7.48},
            {t: 10, Present: 6.54},
            {t: 11, Present: 9.3},
            {t: 12, Present: 8.87},
        ];
        // 94.46 for a year estimated
        const data7 = [
             {t: 1, Past: 7.45},
             {t: 2, Past: 7.5},
             {t: 3, Past: 7.32},
             {t: 4, Past: 6.89},
             {t: 5, Past: 8.72},
             {t: 6, Past: 8.21},
             {t: 7, Past: 9.02},
             {t: 8, Past: 9.1},
             {t: 9, Past: 7.923},
             {t: 10, Past: 6.89},
             {t: 11, Past: 6.93},
             {t: 12, Past: 8.64},
        ];

        const data8 = [
            {t: 1, Present: 79.98},
            {t: 2, Present: 90.273},
            {t: 3, Present: 85.46},
        ];
    
        const data9 = [
             {t: 1, Past: 85.23},
             {t: 2, Past: 92.21},
             {t: 3, Past: 89.59},
        ];

        setEnergyData([data0, data1, data2, data3, data4, data5, data6, data7,
                       data8, data9]);
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
        <EnergyConsumptionGraph data = {energyData} option = {currDisplayOption}/>
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
                {currDisplayOption === "1M" && "(Weeks)"}
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