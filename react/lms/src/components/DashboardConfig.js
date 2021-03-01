//import ThreeJsScene from "./threejsscene";

import "../resources/css/dashboardconfig.css";

import React, {useState, useEffect} from "react";

import ConfigMotionSensor from "./ConfigMotionSensor";
import ConfigSettings from "./ConfigSettings";
import ConfigSchedule from ".//ConfigSchedule";
import ConfigBrightness from "./ConfigBrightness";
import ConfigCalendar from "./ConfigCalendar";

function DashboardConfig(props)
{
    const [motionDetection, setMotionDetection] = useState("ON");
    const [motionSensitivity, setMotionSensitivity] = useState("Medium-High");
    const [sync, setSync] = useState("ON");
    const [intensity, setIntensity] = useState("Fast");
    const [holdTime, setHoldTime] = useState("15");
    const [holdTimeUnits, setHoldTimeUnits] = useState("Seconds");
    const [dimmedBrightness, setDimmedBrightness] = useState(0.7);
    const [motionBrightness, setMotionBrightness] = useState(0.7);
    const [maxBrightness, setMaxBrightness] = useState(0.7);
    // schedule and calendar related stuff
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
    const [schedule, setSchedule] = useState([]);

    useEffect(() =>
    {
        // simulate getting data
        setSchedule(["07:00", "18:59", [false, true, true, true, true, true, false], true, 
                     "19:00", "23:59", [false, true, true, true, true, true, false], true,
                     "00:00", "06:59", [false, true, true, true, true, true, false], true]);
    }, []);

    function handleSubmitButton()
    {
        console.log("selected light info: " + props.area + ", " + props.block + ", " + props.level +
                    ", " + props.lights);
        console.log("motion detection: " + motionDetection);
        console.log("motion sensitivity: " + motionSensitivity);
        console.log("clock sync: " + sync);
        console.log("light intensity: " + intensity);
        console.log("hold time: " + holdTime + " " + holdTimeUnits);
        console.log("dimmed brightness:" + dimmedBrightness);
        console.log("motion brightness: " + motionBrightness);
        console.log("max brightness: " + maxBrightness);
        console.log("schedule data: " + schedule);
    }

    function placeholder()
    {
        console.log("Lights not selected");
    }

    return(
        <div className = "dashboard-page-config">
            <ConfigMotionSensor 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
                motionDetection = {motionDetection}
                motionSensitivity = {motionSensitivity}
                setMD = {setMotionDetection}
                setMS = {setMotionSensitivity}    
            />
            <ConfigSettings 
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
                sync = {sync}
                setSync = {setSync}
                setIntensity = {setIntensity}
                setHoldTime = {setHoldTime}
                setHoldTimeUnits = {setHoldTimeUnits}  
            />
            <ConfigSchedule
                schedule = {schedule}
                setSchedule = {setSchedule}
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
            />
            <ConfigBrightness
                lights = {props.lights}
                dimmedBrightness = {dimmedBrightness}
                motionBrightness = {motionBrightness}
                maxBrightness = {maxBrightness}
                setDimmed = {setDimmedBrightness}
                setMotion = {setMotionBrightness}
                setMax = {setMaxBrightness}
            />
            <ConfigCalendar
                currDate = {currentSelectedDate}
                setDate = {setCurrentSelectedDate}
                schedule = {schedule}
                location = {props.location}
                area = {props.area}
                block = {props.block}
                level = {props.level}
                lights = {props.lights}
            />
            {/* buttons */}
            <div 
                className = "dashboard-page-config-cancel" 
                onClick = {props.cancel}
            >
                CANCEL
            </div>
            <div
                className = "dashboard-page-config-submit" 
                onClick = {props.lights ? handleSubmitButton : placeholder}
            >
                SUBMIT
            </div>
        </div>
    );
}

export default DashboardConfig;