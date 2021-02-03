import React, {useState, useEffect} from "react";

function DashboardView(props)
{
    const [totalLights, setTotalLights] = useState(null);
    const [lightsOn, setLightsOn] = useState(null);
    const [lightsOff, setLightsOff] = useState(null);
    const [lightsDimmed, setLightsDimmed] = useState(null);
    const [lightFaults, setLightFaults] = useState(null);

    useEffect(() =>
    {
        // simulate getting data
        setTotalLights(100);
        setLightsOn(50);
        setLightsOff(10);
        setLightsDimmed(40);
        setLightFaults(3);
    })

    return(
        <div className = "dashboard-page-view">
            THIS IS DASHBOARD VIEW FOR {props.block} <br/>
            TOTAL LIGHTS: {totalLights} <br/>
            LIGHTS ON: {lightsOn} <br/>
            LIGHTS OFF: {lightsOff} <br/>
            LIGHTS DIMMED: {lightsDimmed} <br/>
            LIGHTS FAULTS: {lightFaults}
        </div>
    );
}

export default DashboardView;