import "../resources/css/configcalendar.css";

import React, {useEffect, useState} from "react";
import Calendar from 'react-calendar';

import PrevIcon from "../resources/dashboard/calendar-prev.svg";
import NextIcon from "../resources/dashboard/calendar-next.svg";
import RadioButtonOff from "../resources/dashboard/icon-radio-button-off.svg";
import RadioButtonOn from "../resources/dashboard/icon-radio-button-on.svg";
import PhotosensorDivider from "../resources/dashboard/calendar-photosensor-radio-divider.svg";
import FullBrightnessDivider from "../resources/dashboard/calendar-fullbrightness-radio-divider.svg";
import MotionDivider from "../resources/dashboard/calendar-motion-radio-divider.svg";
import PhotosensorIcon from "../resources/dashboard/calendar-photosensor-icon.svg";
import FullBrightnessIcon from "../resources/dashboard/Icon material-lightbulb-outline.svg";
import MotionIcon from "../resources/dashboard/MotionSensor-icon-GY (black).svg";

function RadioButtonGroup(props)
{
    return(
        <div className = {"dashboard-page-config-calendar-radio-container" + props.containerOrder}>
            <img 
                alt = "" 
                src = {props.enabled ? RadioButtonOn : RadioButtonOff} 
                className = "dashboard-page-config-calendar-radio"
                onClick = {props.onClick}
            ></img>
            <img 
                alt = "" 
                src = {props.containerOrder === "0" ? PhotosensorDivider : 
                        props.containerOrder === "1" ? FullBrightnessDivider : MotionDivider} 
                className = "dashboard-page-config-calendar-radio-divider"
            ></img>
            <img 
                alt = ""
                src = {props.containerOrder === "0" ? PhotosensorIcon : 
                        props.containerOrder === "1" ? FullBrightnessIcon : MotionIcon} 
                className = {"dashboard-page-config-calendar-radio-icon" + props.containerOrder}
            ></img>
            <div className = "dashboard-page-config-calendar-radio-text">
                {props.containerOrder === "0" ? "Photosensor Control" :
                    props.containerOrder === "1" ? "Full Brightness" : "Motion Trigger"}
            </div>
            <div className = "dashboard-page-config-calendar-radio-time">
                {props.data && 
                (props.containerOrder === "0" ? props.data[0] + " - " + props.data[1] :
                    props.containerOrder === "1" ? props.data[4] + " - " + props.data[5] :
                        props.data[8] + " - " + props.data[9])}
            </div>
        </div>
    );
}

function ConfigCalendar(props)
{
    const [photoRadio, setPhotoRadio] = useState(false);
    const [fullBrightnessRadio, setFullBrightnessRadio] = useState(false);
    const [motionRadio, setMotionRadio] = useState(false);

    useEffect(() =>
    {
        // simulate getting data
        var dayOfWeek = props.currDate.getDay();
        
        setPhotoRadio(props.schedule[3] && props.schedule[2][dayOfWeek]);
        setFullBrightnessRadio(props.schedule[7] && props.schedule[6][dayOfWeek])
        setMotionRadio(props.schedule[11] && props.schedule[10][dayOfWeek]);
    }, [props.schedule, props.currDate]);

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
        // change date
        props.setDate(date);
        // set radio button states
        var dayOfWeek = date.getDay();
        
        setPhotoRadio(props.schedule[3] && props.schedule[2][dayOfWeek]);
        setFullBrightnessRadio(props.schedule[7] && props.schedule[6][dayOfWeek])
        setMotionRadio(props.schedule[11] && props.schedule[10][dayOfWeek]);
    }

    // radio buttons do nothing for now
    function handlePhotosensorRadioButton()
    {
        //setPhotoRadio(!photoRadio);
    }

    function handleFullBrightnessRadioButton()
    {
        //setFullBrightnessRadio(!fullBrightnessRadio);
    }

    function handleMotionRadioButton()
    {
        //setMotionRadio(!motionRadio);
    }

    const prevButton =
    (
        <img alt = "" src = {PrevIcon} className = "dashboard-page-config-calendar-prevnext"></img>
    );

    const nextButton =
    (
        <img alt = "" src = {NextIcon} className = "dashboard-page-config-calendar-prevnext"></img>
    );

    function tileContent({date, view})
    {
        if (view === "month")
        {
            var dayOfWeek = date.getDay();
            var photo = (props.schedule[3] && props.schedule[2][dayOfWeek]) ? true : false;
            var fullbrightness = (props.schedule[7] && props.schedule[6][dayOfWeek]) ? true : false;
            var motion = (props.schedule[11] && props.schedule[10][dayOfWeek]) ? true : false;
            
            // 3 icon set up
            // middle left: 44%
            // left   left: 
            // right  left: 

            // 2 icon set up
            // left  left: 
            // right left: 

            if (photo && fullbrightness && motion)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-photosensor-event"></div>
                        <div className = "dashboard-page-config-calendar-fullbrightness-event"></div> 
                        <div className = "dashboard-page-config-calendar-motion-event"></div> 
                    </div>
                );
            }
            else if (photo && fullbrightness)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div 
                            className = "dashboard-page-config-calendar-photosensor-event" 
                            style = {{left: "33%"}}
                        ></div>
                        <div 
                            className = "dashboard-page-config-calendar-fullbrightness-event" 
                            style = {{left: "55%"}}
                        ></div> 
                    </div>
                );
            }
            else if (photo && motion)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-photosensor-event" style = {{left: "33%"}}></div> 
                        <div className = "dashboard-page-config-calendar-motion-event" style = {{left: "55%"}}></div> 
                    </div>
                );

            }
            else if (fullbrightness && motion)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-fullbrightness-event" style = {{left: "33%"}}></div> 
                        <div className = "dashboard-page-config-calendar-motion-event" style = {{left: "55%"}}></div> 
                    </div>
                );
            }
            else if (photo)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-photosensor-event" style = {{left: "44%"}}></div>
                    </div>
                );
            }
            else if (fullbrightness)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-fullbrightness-event" style = {{left: "44%"}}></div> 
                    </div>
                );
            }
            else if (motion)
            {
                return(
                    <div className = "dashboard-page-config-calendar-indicators">
                        <div className = "dashboard-page-config-calendar-motion-event" style = {{left: "44%"}}></div> 
                    </div>
                );
            }
        }
    }

    return(
        <div 
            className = "dashboard-page-config-calendar-container" 
            style = {props.lights ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
        >
            {/* calendar itself */}
            <Calendar
                onChange = {onDateSelect} 
                value = {props.currDate}
                calendarType = {"US"}
                minDetail = "month"
                maxDetail = "month"
                defaultView = "month"
                nextLabel = {nextButton}
                prevLabel = {prevButton}
                formatMonthYear = {MonthYearFormatter}
                tileContent = {tileContent}
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
            <div className = "dashboard-page-config-calendar-bottom-header" >
                {DayOfWeek(props.currDate) + ", " + props.currDate.getDate() + " " + 
                 MonthYearFormatterBottom(props.currDate)}
            </div>
            {/* radio buttons */}
            <RadioButtonGroup
                data = {props.schedule}
                enabled = {photoRadio}
                containerOrder = {"0"}
                onClick = {handlePhotosensorRadioButton}
            ></RadioButtonGroup>
            <RadioButtonGroup
                data = {props.schedule}
                enabled = {fullBrightnessRadio}
                containerOrder = {"1"}
                onClick = {handleFullBrightnessRadioButton}
            ></RadioButtonGroup>
            <RadioButtonGroup
                data = {props.schedule}
                enabled = {motionRadio}
                containerOrder = {"2"}
                onClick = {handleMotionRadioButton}
            ></RadioButtonGroup>
        </div>
    );
}

export default ConfigCalendar;