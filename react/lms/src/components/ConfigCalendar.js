import "../resources/css/configcalendar.css";

import React, {useEffect, useState} from "react";
import Calendar from 'react-calendar';

import PrevIcon from "../resources/dashboard/calendar-prev.svg";
import NextIcon from "../resources/dashboard/calendar-next.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";

function ConfigCalendar(props)
{
    useEffect(() =>
    {
        // simulate getting data
        
    }, []);

    let months = ["Jan", "Feb", "Mar", "Apr", "May" , "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function MonthYearFormatter(locale, d)
    {
        let year = d.getFullYear();
        let month = d.getMonth();
        return months[month] + ", " + year;
    }

    const prevButton =
    (
        <img alt = "" src = {PrevIcon} className = "dashboard-page-config-calendar-prevnext"></img>
    );

    const nextButton =
    (
        <img alt = "" src = {NextIcon} className = "dashboard-page-config-calendar-prevnext"></img>
    );

    return(
        <div className = "dashboard-page-config-calendar-container">
            {/* calendar itself */}
            <Calendar
                className = {props.lights ? "react-calendar" : "react-calendar-disabled"}
                onChange = {props.setDate} 
                value = {props.date}
                calendarType = {"US"}
                minDetail = "month"
                maxDetail = "month"
                defaultView = "month"
                nextLabel = {nextButton}
                prevLabel = {prevButton}
                formatMonthYear = {MonthYearFormatter}
            />
            {/* legends */}
            <div className = "dashboard-page-config-photosensor-legend">
                Photosensor Control
            </div>
            <div className = "dashboard-page-config-fullbrightness-legend">
                Full Brightness
            </div>
            <div className = "dashboard-page-config-motion-legend">
                Motion Trigger
            </div>
            {/* legend icons */}
            <div className = "dashboard-page-config-photosensor-icon"></div>
            <div className = "dashboard-page-config-fullbrightness-icon"></div>
            <div className = "dashboard-page-config-motion-icon"></div>
            {/* divider */}
            <div className = "dashboard-page-config-calendar-divider"></div>
            {/* bottom header */}

            {/* radio buttons */}

        </div>
    );
}

export default ConfigCalendar;