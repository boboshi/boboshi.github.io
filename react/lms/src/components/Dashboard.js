import React, {useState} from "react";
import {Route, HashRouter, useHistory, Redirect} from "react-router-dom";
import DashboardSelect from "../components/DashboardSelect";
import SidebarLogo from "../resources/dashboard/Aztech logo 2020@2x.png";
import SidebarToggleButton from "../resources/dashboard/menu_icon@2x.png";
import Timestamp from "../components/Timestamp"

function Dashboard(props)
{
    const history = useHistory();
    const [version, setVersion] = useState("3.0.0");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");

    function sidebarToggle()
    {
        var sb = document.getElementsByClassName("dashboard-page-sidebar");

        if (sb[0].style.transform === "translate3d(-100%, 0px, 0px)")
            sb[0].style.transform = "translate3d(0%, 0px, 0px)";
        else
            sb[0].style.transform = "translate3d(-100%, 0px, 0px)";
    }

    function handleDashboardButton()
    {
        history.push("/dashboard");
    }

    function handleLocationButton()
    {

    }

    return(
        <HashRouter>
            <div className = "dashboard-page">
                <div className = "dashboard-page-header">

                </div>
                <div className = "dashboard-page-sidebar">
                    {/* path buttons */}
                    <div className = "dashboard-page-header-paths">
                        <div className = "dashboard-page-header-dashboardtext">
                            DASHBOARD
                            <button 
                                className = "dashboard-page-header-dashboardbtn"
                                onClick = {handleDashboardButton}
                            ></button>
                        </div>
                        {selectedLocation &&
                            <div className = "dashboard-page-header-locationtext">
                                qweqweqwewqeqweqweqwe
                                <button
                                    className = "dashboard-page-header-locationbtn"
                                    onClick = {handleLocationButton}
                                ></button>
                            </div>
                        }
                    </div>
                    {/* sidebar toggle button */}
                    <img
                        src = {SidebarToggleButton} 
                        className = "dashboard-page-sidebar-togglebtnimg">
                    </img>
                    <button 
                        onClick = {sidebarToggle} 
                        className = "dashboard-page-sidebar-togglebtn">
                    </button>
                    {/* logo */}
                    <img src = {SidebarLogo} className = "dashboard-page-sidebar-logo"></img>
                    {/* bottom text */}
                    <div className = "dashboard-page-sidebar-bottomtext">
                        <Timestamp />
                        <h1 className = "dashboard-page-sidebar-bottomtext-versiontext">VER {version}</h1>
                    </div>
                </div>
                <div className = "pages">
                    {/*
                    <Route exact path = "/dashboard"><Redirect to = "/dashboard/map" /></Route>
                    <Route path = "/dashboard/map" component = {DashboardLocationSelect}></Route>
                    */}
                    <Route 
                        path = "/dashboard" 
                        render = {(props) => <DashboardSelect 
                                                setLocation = {setSelectedLocation}
                                                setArea = {setSelectedArea}
                                                setBlock = {setSelectedBlock}
                                            {...props}/>}>
                    </Route>
                </div>
            </div>
        </HashRouter>
    );
}

export default Dashboard;

//  render = {(props) => <LoginForm changePage = {changePage} {...props} />}>