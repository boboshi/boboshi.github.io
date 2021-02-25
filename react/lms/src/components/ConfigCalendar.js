import "../resources/css/configcalendar.css";

import React, {useState} from "react";
import Calendar from 'react-calendar';

function ConfigCalendar(props)
{
    const [date, setDate] = useState(new Date());

    function onDateSelect(date)
    {
        setDate(date);
        console.log(date);
    }

    return(
        <div className = "dashboard-page-config-calendar-container">
            <Calendar 
                onChange = {onDateSelect} 
                value = {date}
                calendarType = {"US"}
            />
        </div>
    );
}

export default ConfigCalendar;