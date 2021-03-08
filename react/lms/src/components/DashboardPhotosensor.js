import "../resources/css/dashboardphotosensor.css";

import React, {useState, useEffect} from "react";

import PhotosensorDarkness from "./PhotosensorDarkness";
import PhotosensorBrightness from "./PhotosensorBrightness";

function DashboardPhotosensor(props)
{
    const [darknessDetection, setDarknessDetection] = useState("ON");
    const [brightnessDetection, setBrightnessDetection] = useState("ON");
    const [environmentalOffset, setEnvironmentalOffset] = useState(25);
    const [darknessIntensity, setDarknessIntensity] = useState(25);
    const [darkThreshold, setDarkThreshold] = useState(50);
    const [lightingOffset, setLightingOffset] = useState(50);
    const [brightnessIntensity, setBrightnessIntensity] = useState(100);
    const [brightnessThreshold, setBrightnessThreshold] = useState(150);

    useEffect(() =>
    {
        // simulate getting data

    }, []);

    function handleSubmitButton()
    {
        console.log("selected light info: " + props.area + ", " + props.block + ", " + props.level +
                    ", " + props.lights);
        console.log("darkness detection: " + darknessDetection);
        console.log("environmental offset: " + environmentalOffset);
        console.log("darkness intensity: " + darknessIntensity);
        console.log("dark threshold: " + darkThreshold);
        console.log("brightness detection: " + brightnessDetection);
        console.log("lighting offset: " + lightingOffset);
        console.log("brightness intensity: " + brightnessIntensity);
        console.log("brightness threshold: " + brightnessThreshold);
    }

    function placeholder()
    {
        console.log("Lights not selected");
    }

    return(
        <div className = "dashboard-page-photosensor">
            <PhotosensorDarkness
                lights = {props.lights}
                darknessDetection = {darknessDetection}
                environmentalOffset = {environmentalOffset}
                darknessIntensity = {darknessIntensity}
                darkThreshold = {darkThreshold}
                setEnvironmentalOffset = {setEnvironmentalOffset}
                setDarknessIntensity = {setDarknessIntensity}
                setDarkThreshold = {setDarkThreshold}
                setDarknessDetection = {setDarknessDetection}
            />
            <PhotosensorBrightness
                lights = {props.lights}
                brightnessDetection = {brightnessDetection}
                lightingOffset = {lightingOffset}
                brightnessIntensity = {brightnessIntensity}
                brightnessThreshold = {brightnessThreshold}
                setLightingOffset = {setLightingOffset}
                setBrightnessIntensity = {setBrightnessIntensity}
                setBrightnessThreshold = {setBrightnessThreshold}
                setBrightnessDetection = {setBrightnessDetection}
            />
            {/* buttons */}
            <div 
                className = "dashboard-page-photosensor-cancel" 
                onClick = {props.cancel}
            >
                CANCEL
            </div>
            <div
                className = "dashboard-page-photosensor-submit" 
                onClick = {props.lights ? handleSubmitButton : placeholder}
            >
                SUBMIT
            </div>
        </div>
    );
}

export default DashboardPhotosensor;