import React, {useState, useEffect} from "react";

import MotionIcon from "../resources/dashboard/MotionSensor-icon-GY.svg";
import ActiveLightsHeader from "../resources/dashboard/activelights header.svg";
import ActiveRefreshIcon from "../resources/dashboard/Icon ionic-md-refresh(active).svg";
import ActiveInfoIcon from "../resources/dashboard/Group 52718.svg";

class ActiveLightObject
{
    constructor(id, detections, date, time, stats)
    {
        this.id = id;
        this.detections = detections;
        this.date = date;
        this.time = time;
        this.stats = stats;
    }
}

function ActiveLights(props)
{
    const [lightData, setLightData] = useState([]);

    const activeLightsList = lightData.map(light =>
        <tr key = {light.id}>
            <td className = "dashboard-page-view-activelights-table-id"> {light.id} - {light.detections}</td>
            <td className = "dashboard-page-view-activelights-table-date"> {light.date} </td>
            <td className = "dashboard-page-view-activelights-table-time"> {light.time} </td>
            <td className = "dashboard-page-view-activelights-table-stats"> {light.stats} </td>
        </tr>
    );

    useEffect(() =>
    {
        // simulate getting data
        let light0 = new ActiveLightObject("1.1.2", 1234, "2020-09-01", "12:55:55", "IN PROGRESS");
        let light1 = new ActiveLightObject("1.1.3", 1234, "2020-09-01", "13:55:55", "IN PROGRESS");
        let light2 = new ActiveLightObject("1.1.4", 1234, "2020-09-01", "14:55:55", "IN PROGRESS");
        let light3 = new ActiveLightObject("1.1.5", 1234, "2020-09-01", "15:55:55", "IN PROGRESS");
        let light4 = new ActiveLightObject("1.1.6", 1234, "2020-09-01", "16:55:55", "IN PROGRESS");
        let light5 = new ActiveLightObject("1.2.7", 1234, "2020-09-01", "17:55:55", "IN PROGRESS");
        let light6 = new ActiveLightObject("1.1.8", 1234, "2020-09-01", "18:55:55", "IN PROGRESS");
        let light7 = new ActiveLightObject("1.1.9", 1234, "2020-09-01", "19:55:55", "IN PROGRESS");
        let light8 = new ActiveLightObject("1.2.1", 1234, "2020-09-01", "20:55:55", "IN PROGRESS");

        setLightData([light0, light1, light2, light3, light4, light5, light6, light7, light8]);
    }, []);

    function handleActiveRefresh()
    {
        console.log("active refresh");
    }

    function handleActiveInfo()
    {
        console.log("active info");
    }

    return(
        <div className = "dashboard-page-view-activelights-container">
            <img alt = "" src = {MotionIcon} className = "dashboard-page-view-activelights-icon"></img>
            <img 
                alt = "" 
                src = {ActiveRefreshIcon} 
                className = "dashboard-page-view-header-refresh"
                onClick = {handleActiveRefresh}
            ></img>
            <div className = "dashboard-page-view-activelights-header-divider"></div>
            <img 
                alt = "" 
                src = {ActiveInfoIcon} 
                className = "dashboard-page-view-header-info"
                onClick = {handleActiveInfo}
            ></img>
            <div className = "dashboard-page-view-header-default">
                <h1 className = "dashboard-page-view-headertop-text">MOST ACTIVE LIGHT(S)</h1>
                <img alt = "" src = {ActiveLightsHeader} className = "dashboard-page-view-headerimg-default"></img>
            </div>
            {/* table */}
            {activeLightsList && 
                <div className = "dashboard-page-view-activelights-table-container">
                    <div className = "dashboard-page-view-activelights-table-header">
                        <h1 className = "dashboard-page-view-activelights-table-header-detections">DETECTIONS</h1>
                        <h1 className = "dashboard-page-view-activelights-table-header-date">DATE</h1>
                        <h1 className = "dashboard-page-view-activelights-table-header-time">TIME</h1>
                        <h1 className = "dashboard-page-view-activelights-table-header-stats">STATS</h1>
                    </div>
                    <div className = "dashboard-page-view-activelights-table-divider"></div>
                    <table className = "dashboard-page-view-activelights-table">
                        <tbody>
                            {activeLightsList}
                        </tbody>
                    </table>
                </div>
            }
            <div className = "dashboard-page-view-border-default"></div>
        </div>
    );
}

export default ActiveLights;