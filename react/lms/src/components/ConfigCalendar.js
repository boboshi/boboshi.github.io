import "../resources/css/configcalendar.css";

import React, {useEffect, useState} from "react";
import Calendar from 'react-calendar';

import PrevIcon from "../resources/dashboard/calendar-prev.svg";
import NextIcon from "../resources/dashboard/calendar-next.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";

function ConfigCalendar(props)
{
    const [date, setDate] = useState(new Date());

    useEffect(() =>
    {
        // simulate getting data
        
    }, []);

    let months = ["Jan", "Feb", "Mar", "Apr", "May" , "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function DayOfWeek(d)
    {
        return days[d.getDay()];
    }

    function MonthYearFormatterBottom(d)
    {
        let year = d.getFullYear();
        let month = d.getMonth();
        return months[month] + " " + year;
    }

    function MonthYearFormatter(locale, d)
    {
        let year = d.getFullYear();
        let month = d.getMonth();
        return months[month] + ", " + year;
    }

    function onDateSelect(date)
    {
        setDate(date);
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
        <div 
            className = "dashboard-page-config-calendar-container" 
            style = {props.lights ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
        >
            {/* calendar itself */}
            <Calendar
                onChange = {onDateSelect} 
                value = {date}
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
            <div className = "dashboard-page-config-bottom-header" >
                {DayOfWeek(date) + ", " + MonthYearFormatterBottom(date)}
            </div>
            {/* radio buttons */}

        </div>
    );
}

export default ConfigCalendar;