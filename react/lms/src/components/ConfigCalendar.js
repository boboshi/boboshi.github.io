import "../resources/css/configcalendar.css";

import React, {useEffect, useState} from "react";
import Calendar from 'react-calendar';

import PrevIcon from "../resources/dashboard/calendar-prev.svg";
import NextIcon from "../resources/dashboard/calendar-next.svg";

function ConfigCalendar(props)
{
    const [date, setDate] = useState(new Date());

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

    function onDateSelect(date)
    {
        setDate(date);
    }

    const prevButton =
    (
        <div>
            <img alt = "" src = {PrevIcon} className = "dashboard-page-config-calendar-prevnext"></img>
        </div>
    );

    const nextButton =
    (
        <div>
            <img alt = "" src = {NextIcon} className = "dashboard-page-config-calendar-prevnext"></img>
        </div>
    );

    return(
        <div className = "dashboard-page-config-calendar-container">
            <Calendar
                className = {props.lights ? "react-calendar" : "react-calendar-disabled"}
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
        </div>
    );
}

export default ConfigCalendar;