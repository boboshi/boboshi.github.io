import React, {useState, useRef, useEffect} from "react";
import {Route, HashRouter, useHistory, Redirect} from "react-router-dom";
import Map from "../resources/dashboard/map@2x.png";
import SidebarLogo from "../resources/dashboard/Aztech logo 2020@2x.png";
import SidebarToggleButton from "../resources/dashboard/menu_icon@2x.png";

import Timestamp from "../components/Timestamp";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Notification from "../components/Notification";
import UserDropdown from "../components/UserDropdown";

class NotificationObject
{
    constructor(title, description, rectified)
    {
        this.title = title;
        this.description = description;
        this.rectified = rectified;
    }
}

class UserObject
{
    constructor(name, role, image)
    {
        this.name = name;
        this.role = role;
        this.image = image;
    }
}

function Dashboard(props)
{
    const history = useHistory();

    const locationDDRef = useRef();
    const areaDDRef = useRef();
    const blockDDRef = useRef();
    const notificationRef = useRef();
    const userDDRef = useRef();

    const arrowVar = ">";

    const [version, setVersion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [alerts, setAlerts] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [userList, setUserList] = useState(null);

    // simulate getting data
    useEffect(() =>
    {
        let notification0 = new NotificationObject("Alert For Light Offline", 
                                                   "Light 1.2.8 AC Failure",
                                                   "true");
        let notification1 = new NotificationObject("Alert For Light 1.2.7", 
                                                   "Light 1.2.7 AC Failure",
                                                   "false");
        let notification2 = new NotificationObject("Alert For Light 1.2.11", 
                                                   "Light 1.2.11 AC Failure",
                                                   "false");
        let curruser = new UserObject("office_admin", "Project Manager", "default");
        let user0 = new UserObject("VIOLA CHAN", "Design Manager", "default");
        let user1 = new UserObject("MANNMO WONG", "Designer", "default");

        setVersion("3.0.0");
        setAlerts([notification0, notification1, notification2]);
        setCurrUser(curruser);
        setUserList([user0, user1]);
    }, []);

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
        setSelectedLocation("");
        setSelectedArea("");
        setSelectedBlock("");
        if (locationDDRef.current)
            locationDDRef.current.clearChoice();
        if (areaDDRef.current)
            areaDDRef.current.clearChoice();
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
    }

    function handleLocationButton()
    {
        setSelectedArea("");
        setSelectedBlock("");
        if (areaDDRef.current)
            areaDDRef.current.clearChoice();
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
    }

    function handleAreaButton()
    {
        setSelectedBlock("");
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
    }

    function setSelectedLocationHelper(location)
    {
        setSelectedLocation(location);
        handleLocationButton();
    }

    function setSelectedAreaHelper(area)
    {
        setSelectedArea(area);
        handleAreaButton();
    }

    function setSelectedBlockHelper(block)
    {
        setSelectedBlock(block);
    }

    function handleBlockButton()
    {
        console.log(selectedBlock);
    }

    function handleSearch(search)
    {
        console.log(search);
    }

    return(
        <HashRouter>
            <div className = "dashboard-page">
                <div className = "dashboard-page-header">
                    <SearchBar handleSearch = {handleSearch}/>
                    {alerts != null && <Notification ref = {notificationRef} notifications = {alerts}/>}
                    <div className = "dashboard-page-header-divider"></div>
                    {currUser != null && userList != null && 
                    <UserDropdown ref = {userDDRef} currUser = {currUser} userList = {userList}/>}
                </div>
                <div className = "dashboard-page-sidebar">
                    {/* path buttons */}
                    <div className = "dashboard-page-header-paths">
                        <div className = "dashboard-page-header-dashboardtext"
                             onClick = {handleDashboardButton}>
                            DASHBOARD
                        </div>
                        {selectedLocation &&
                            <span>
                                <span className = "dashboard-page-header-patharrows">
                                    {arrowVar}
                                </span>
                                {!selectedArea ? 
                                    <div className = "dashboard-page-header-buttontext-selected"
                                             onClick = {handleLocationButton}>
                                            {selectedLocation}
                                        </div> : 
                                        <div className = "dashboard-page-header-buttontext"
                                             onClick = {handleLocationButton}>
                                            {selectedLocation}
                                    </div>
                                }
                            </span>
                        }
                        {selectedArea &&
                            <span>
                                <span className = "dashboard-page-header-patharrows">
                                    {arrowVar}
                                </span>
                                {!selectedBlock ? 
                                    <div className = "dashboard-page-header-buttontext-selected"
                                         onClick = {handleAreaButton}>
                                        {selectedArea}
                                    </div> : 
                                    <div className = "dashboard-page-header-buttontext"
                                         onClick = {handleAreaButton}>
                                        {selectedArea}
                                    </div>
                                }
                            </span>
                        }
                        {selectedBlock &&
                            <span>
                                <span className = "dashboard-page-header-patharrows">
                                    {arrowVar}
                                </span>
                                <div className = "dashboard-page-header-buttontext-selected"
                                     onClick = {handleBlockButton}>
                                    {selectedBlock.toUpperCase()}
                                </div>
                            </span>
                        }
                    </div>
                    {/* sidebar toggle button */}
                    <img
                        alt = ""
                        src = {SidebarToggleButton} 
                        className = "dashboard-page-sidebar-togglebtnimg">
                    </img>
                    <button 
                        onClick = {sidebarToggle} 
                        className = "dashboard-page-sidebar-togglebtn">
                    </button>
                    {/* logo */}
                    <img alt = "" src = {SidebarLogo} className = "dashboard-page-sidebar-logo"></img>
                    {/* bottom text */}
                    <div className = "dashboard-page-sidebar-bottomtext">
                        <Timestamp />
                        {version != null && 
                        <h1 className = "dashboard-page-sidebar-bottomtext-versiontext">VER {version}</h1>}
                    </div>
                </div>
                <div className = "dashboard-page-selector">
                    <div className = "dashboard-page-selector-locationdropdown">
                        <Dropdown 
                            ref = {locationDDRef}
                            title = "LOCATION"
                            options = {["SINGAPORE"]}
                            selectOption = {setSelectedLocationHelper}
                        ></Dropdown>
                    </div>
                    {selectedLocation && 
                        <div>
                            <div className = "dashboard-page-selector-areadropdown">
                                <Dropdown
                                    ref = {areaDDRef}
                                    title = "AREA"
                                    options = {["GEYLANG"]}
                                    selectOption = {setSelectedAreaHelper}
                                ></Dropdown>
                            </div>
                        </div>
                    }
                    {selectedLocation && selectedArea &&
                        <div>
                            <div className = "dashboard-page-selector-blockdropdown">
                                <Dropdown
                                    ref = {blockDDRef}
                                    title = "BLOCK"
                                    options = {["Office_Lights"]}
                                    selectOption = {setSelectedBlockHelper}
                                ></Dropdown>
                            </div>
                        </div>
                    }
                    {selectedLocation && !selectedBlock &&
                        <div>
                            <img alt = "" src = {Map} className = "dashboard-page-selector-sgmapimg"></img>
                        </div>
                    }
                </div>
                <div className = "dashboard-page-footer">
                    <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                    <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
                </div>
            </div>
        </HashRouter>
    );
}

export default Dashboard;

//  render = {(props) => <LoginForm changePage = {changePage} {...props} />}>