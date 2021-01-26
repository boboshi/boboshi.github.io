import React, {useState} from "react";
import {Route, HashRouter, useHistory, Redirect} from "react-router-dom";
import DashboardMap from "../components/DashboardMap";
import SidebarLogo from "../resources/dashboard/Aztech logo 2020@2x.png";

function DashboardLanding(props)
{
    const [version, setVersion] = useState("3.0.0");

    function sidebarToggle()
    {
        var sb = document.getElementsByClassName("dashboard-page-sidebar");

        if (sb[0].style.transform === "translate3d(-100%, 0px, 0px)")
            sb[0].style.transform = "translate3d(0%, 0px, 0px)";
        else
            sb[0].style.transform = "translate3d(-100%, 0px, 0px)";
    }

    return(
        <HashRouter>
            <div className = "dashboard-page">
                <div className = "dashboard-page-header">

                </div>
                <div className = "dashboard-page-sidebar">
                    {/* sidebar toggle button */}
                    <button 
                        onClick = {sidebarToggle} 
                        className = "dashboard-page-sidebar-togglebtn">
                    </button>
                    {/* logo */}
                    <img src = {SidebarLogo} className = "dashboard-page-sidebar-logo"></img>
                    {/* bottom text */}
                    <div className = "dashboard-page-sidebar-bottomtext">
                        <h1 className = "dashboard-page-sidebar-bottomtext-datetext">09-09-2020</h1>
                        <h1 className = "dashboard-page-sidebar-bottomtext-timetext">10:27:59</h1>
                        <h1 className = "dashboard-page-sidebar-bottomtext-versiontext">VER {version}</h1>
                    </div>
                </div>
                <div className = "pages">
                    <Route exact path = "/dashboard"><Redirect to = "/dashboard/map" /></Route>
                    <Route path = "/dashboard/map" component = {DashboardMap}></Route>
                </div>
            </div>
        </HashRouter>
    );
}

export default DashboardLanding;