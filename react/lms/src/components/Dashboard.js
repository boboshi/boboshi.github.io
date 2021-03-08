import "../resources/css/dashboard.css";

import React, {useState, useRef, useEffect} from "react";
import {Route, HashRouter, useHistory, useLocation} from "react-router-dom";

import Map from "../resources/dashboard/map@2x.png";
import SidebarLogo from "../resources/dashboard/Aztech logo 2020.svg";
import SidebarToggleButton from "../resources/dashboard/menu_icon.svg";

import DashboardIcon from "../resources/dashboard/icon-dashboard.svg";
import DashboardSelectedIcon from "../resources/dashboard/icon-dashboard-selected.svg";
import ConfigIcon from "../resources/dashboard/icon-config.svg";
import ConfigSelectedIcon from "../resources/dashboard/icon-config-selected.svg";
import PhotosensorIcon from "../resources/dashboard/icon-photosensor.svg";
import PhotosensorSelectedIcon from "../resources/dashboard/icon-photosensor-selected.svg";
import DatachartsIcon from "../resources/dashboard/icon-datacharts.svg";
import DatachartsSelectedIcon from "../resources/dashboard/icon-datacharts-selected.svg";
import LightCycleIcon from "../resources/dashboard/icon-lightcycle.svg";
import LightCycleSelectedIcon from "../resources/dashboard/icon-lightcycle-selected.svg";
import UsersIcon from "../resources/dashboard/icon-users.svg";
import UsersSelectedIcon from "../resources/dashboard/icon-users-selected.svg";
import LibraryAddIcon from "../resources/dashboard/icon-add.svg";
import LibraryAddSelectedIcon from "../resources/dashboard/icon-add-selected.svg";

import AdminProfile from "../resources/dashboard/office-admin-profile.png";
import DefaultUser from "../resources/dashboard/icon-userdropdown-default.svg";

import Timestamp from "./Timestamp";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import UserDropdown from "./UserDropdown";
import SidebarIcon from "./SidebarIcon";
import DashboardView from "./DashboardView";
import DashboardConfig from "./DashboardConfig";
import DashboardPhotosensor from "./DashboardPhotosensor";
import DashboardDatacharts from "./DashboardDatacharts";
import DashboardLightCycle from "./DashboardLightCycle";
import DashboardUserManagement from "./DashboardUserManagement";
import DashboardAdd from "./DashboardAdd";

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
    const location = useLocation();

    const locationDDRef = useRef();
    const areaDDRef = useRef();
    const blockDDRef = useRef();
    const levelDDRef = useRef();
    const lightDDRef = useRef();

    const notificationRef = useRef();

    const arrowVar = ">";

    const [darkMode, setDarkMode] = useState(false);
    const [version, setVersion] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [userList, setUserList] = useState(null);

    // dropdown
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedLight, setSelectedLight] = useState("");

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
        let curruser = new UserObject("office_admin", "Project Manager", AdminProfile);
        let user0 = new UserObject("VIOLA CHAN", "Design Manager", DefaultUser);
        let user1 = new UserObject("MANNMO WONG", "Designer", DefaultUser);

        setVersion("3.0.0");
        setAlerts([notification0, notification1, notification2]);
        setCurrUser(curruser);
        setUserList([user0, user1]);
    }, []);

    function goToPath(path)
    {
        if(location.pathname !== path)
            history.push(path);
    }

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
        setSelectedLevel("");
        setSelectedLight("");

        if (locationDDRef.current)
            locationDDRef.current.clearChoice();
        if (areaDDRef.current)
            areaDDRef.current.clearChoice();
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
        if (levelDDRef.current)
            levelDDRef.current.clearChoice();
        if (lightDDRef.current)
            lightDDRef.current.clearChoice();
        
        goToPath("/dashboard");
    }

    function handleLocationButton()
    {
        setSelectedArea("");
        setSelectedBlock("");
        setSelectedLevel("");
        setSelectedLight("");

        if (areaDDRef.current)
            areaDDRef.current.clearChoice();
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
        if (levelDDRef.current)
            levelDDRef.current.clearChoice();
        if (lightDDRef.current)
            lightDDRef.current.clearChoice();
    }

    function handleAreaButton()
    {
        setSelectedBlock("");
        setSelectedLevel("");
        setSelectedLight("");

        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
        if (levelDDRef.current)
            levelDDRef.current.clearChoice();
        if (lightDDRef.current)
            lightDDRef.current.clearChoice();
    }

    function handleBlockButton()
    {
        goToPath("/dashboard/view");
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

        setSelectedLevel("");
        setSelectedLight("");

        if (levelDDRef.current)
            levelDDRef.current.clearChoice();
        if (lightDDRef.current)
            lightDDRef.current.clearChoice();
        
        if (location.pathname === "/dashboard")
            goToPath("/dashboard/view");
    }

    function setSelectedLevelHelper(level)
    {
        setSelectedLevel(level);
        
        setSelectedLight("");

        if (lightDDRef.current)
            lightDDRef.current.clearChoice();
    }

    function setSelectedLightHelper(light)
    {
        setSelectedLight(light);
    }

    function handleSearch(search)
    {
        console.log(search);
    }

    function changeUser(str)
    {
        console.log("change to user " + str);
    }

    function addUser()
    {
        goToPath("/dashboard/usermanagement");
    }

    function userSettings(str)
    {
        console.log("DO SOME USER SETTINGS STUFF");
    }

    function logout()
    {
        history.push("/login");
    }

    function handleSidebarButton(path)
    {
        goToPath(path);
    }

    function handleSidebarDarkModeToggle()
    {
        setDarkMode(!darkMode);

        var dm = document.getElementsByClassName("dashboard-page-sidebar-icon-darkmode-circle");

        if (dm[0].style.transform === "translate(70%, -35%)")
            dm[0].style.transform = "translate(-25%, -35%)";
        else
            dm[0].style.transform = "translate(70%, -35%)";
    }

    function handleConfigCancel()
    {
        goToPath("/dashboard/view");
    }

    const defaultPaths =
    (
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
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext-selected" :
                                        "dashboard-page-header-buttontext"}
                         onClick = {handleLocationButton}>
                         {selectedLocation}
                    </div>
                </span>
            }
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedBlock ? "dashboard-page-header-buttontext-selected" :
                                        "dashboard-page-header-buttontext"}
                         onClick = {handleAreaButton}>
                        {selectedArea}
                    </div>
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
    );

    const configPaths =
    (
        <div className = "dashboard-page-header-paths">
            <div className = "dashboard-page-header-dashboardtext">
                CONFIGURATIONS
            </div>
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext-selected" :
                                        "dashboard-page-header-buttontext"}>
                         {selectedArea}
                    </div>
                </span>
            }
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext" : 
                                        "dashboard-page-header-buttontext-selected"}>
                         GENERAL
                    </div>
                </span>
            }
        </div>
    );

    const photosensorPaths =
    (
        <div className = "dashboard-page-header-paths">
            <div className = "dashboard-page-header-dashboardtext">
                CONFIGURATIONS
            </div>
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext-selected" :
                                        "dashboard-page-header-buttontext"}>
                         {selectedArea}
                    </div>
                </span>
            }
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext" : 
                                        "dashboard-page-header-buttontext-selected"}>
                         PHOTOSENSOR
                    </div>
                </span>
            }
        </div>
    );

    const datachartsPaths =
    (
        <div className = "dashboard-page-header-paths">
            <div className = "dashboard-page-header-dashboardtext">
                DATA CHARTS
            </div>
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext-selected" :
                                        "dashboard-page-header-buttontext"}>
                         ENERGY CONSUMPTION
                    </div>
                </span>
            }
            {selectedArea &&
                <span>
                    <span className = "dashboard-page-header-patharrows">
                        {arrowVar}
                    </span>
                    <div className = {!selectedArea ? "dashboard-page-header-buttontext" : 
                                        "dashboard-page-header-buttontext-selected"}>
                         MOTION DETECTION
                    </div>
                </span>
            }
        </div>
    );


    const umPaths =
    (        
        <div className = "dashboard-page-header-paths">
            <div className = "dashboard-page-header-dashboardtext"
                 onClick = {handleDashboardButton}>
                DASHBOARD
            </div>
            <span>
                <span className = "dashboard-page-header-patharrows">
                    {arrowVar}
                </span>
                <div className = "dashboard-page-header-buttontext-selected">
                     USER MANAGEMENT
                </div>
            </span>
        </div>
    );

    const defaultTemplate =
    (
        <div className = "dashboard-page-selector">
            <div className = "dashboard-page-selector-0" style = {{zIndex: 10}}>
                <Dropdown 
                    ref = {locationDDRef}
                    title = "LOCATION"
                    options = {["SINGAPORE"]}
                    initial = {selectedLocation}
                    selectOption = {setSelectedLocationHelper}
                ></Dropdown>
            </div>
            {selectedLocation && 
                <div>
                    <div className = "dashboard-page-selector-1" style = {{zIndex: 10}}>
                        <Dropdown
                            ref = {areaDDRef}
                            title = "AREA"
                            options = {["GEYLANG"]}
                            initial = {selectedArea}
                            selectOption = {setSelectedAreaHelper}
                        ></Dropdown>
                    </div>
                </div>
            }
            {selectedLocation && selectedArea &&
                <div>
                    <div className = "dashboard-page-selector-2" style = {{zIndex: 10}}>
                        <Dropdown
                            ref = {blockDDRef}
                            title = "BLOCK"
                            options = {["Office_Lights"]}
                            initial = {selectedBlock}
                            selectOption = {setSelectedBlockHelper}
                        ></Dropdown>
                    </div>
                </div>
            }
            {location.pathname === "/dashboard" && selectedLocation &&
                <div>
                    <img alt = "" src = {Map} className = "dashboard-page-selector-sgmapimg"></img>
                </div>
            }
        </div>
    );

    const configTemplate =
    (
        <div className = "dashboard-page-selector">
            <div className = "dashboard-page-selector-0" style = {{zIndex: 10}}>
                <Dropdown 
                    ref = {areaDDRef}
                    title = "AREA"
                    options = {["GEYLANG"]}
                    initial = {selectedArea}
                    selectOption = {setSelectedAreaHelper}
                ></Dropdown>
            </div>
            {selectedArea &&
                <div>
                    <div className = "dashboard-page-selector-1" style = {{zIndex: 10}}>
                        <Dropdown
                            ref = {blockDDRef}
                            title = "BLOCK(S)"
                            options = {["Office_Lights"]}
                            initial = {selectedBlock}
                            selectOption = {setSelectedBlockHelper}
                        ></Dropdown>
                    </div>
                </div>
            }
            {selectedArea && selectedBlock &&
                <div>
                    <div className = "dashboard-page-selector-2" style = {{zIndex: 10}}>
                        <Dropdown
                            ref = {levelDDRef}
                            title = "LEVEL"
                            options = {["ALL SELECTED"]}
                            initial = {selectedLevel}
                            selectOption = {setSelectedLevelHelper}
                        ></Dropdown>
                    </div>
                </div>
            }
            {selectedArea && selectedBlock && selectedLevel &&
                <div>
                    <div className = "dashboard-page-selector-3" style = {{zIndex: 10}}>
                        <Dropdown
                            ref = {lightDDRef}
                            title = "LIGHT(S)"
                            options = {["ALL SELECTED"]}
                            initial = {selectedLight}
                            selectOption = {setSelectedLightHelper}
                        ></Dropdown>
                    </div>
                </div>
            }
        </div>
    );

    function pathHelper()
    {
        switch(location.pathname)
        {
            case("/dashboard/usermanagement"):
                return umPaths;
            case("/dashboard/config"):
                return configPaths;
            case("/dashboard/photosensor"):
                return photosensorPaths;
            case("/dashboard/datacharts"):
                return datachartsPaths;
            default:
                return defaultPaths;
        }
    }

    return(
        <div className = "dashboard-page">
            <div className = "dashboard-page-header">
                <SearchBar handleSearch = {handleSearch}/>
                {alerts != null && <Notification ref = {notificationRef} notifications = {alerts}/>}
                <div className = "dashboard-page-header-divider"></div>
                {currUser != null && userList != null && 
                <UserDropdown 
                    currUser = {currUser} 
                    userList = {userList}
                    changeUser = {changeUser}
                    addUser = {addUser}
                    userSettings = {userSettings}
                    logout = {logout}
                />}
            </div>
            <div className = "dashboard-page-sidebar">
                {/* path buttons */}
                {pathHelper()}
                {/* sidebar toggle button */}
                <button 
                    onClick = {sidebarToggle} 
                    className = "dashboard-page-sidebar-togglebtn">
                    <img
                        alt = ""
                        src = {SidebarToggleButton} 
                        className = "dashboard-page-sidebar-togglebtnimg">
                    </img>
                </button>
                {/* logo */}
                <img alt = "" src = {SidebarLogo} className = "dashboard-page-sidebar-logo"></img>
                {/* sidebar buttons */}
                <div className = "dashboard-page-sidebar-icon-container">
                    <SidebarIcon 
                        onClick = {handleSidebarButton}
                        path = "/dashboard/view" 
                        icon = {DashboardIcon} 
                        selectedicon = {DashboardSelectedIcon} 
                        tooltip = "Dashboard"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/config" 
                        icon = {ConfigIcon}
                        selectedicon = {ConfigSelectedIcon}
                        tooltip = "Configuration"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/photosensor" 
                        icon = {PhotosensorIcon}
                        selectedicon = {PhotosensorSelectedIcon}
                        tooltip = "Photosensor"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/datacharts" 
                        icon = {DatachartsIcon}
                        selectedicon = {DatachartsSelectedIcon} 
                        tooltip = "Data charts"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/lightcycle" 
                        icon = {LightCycleIcon}
                        selectedicon = {LightCycleSelectedIcon} 
                        tooltip = "LightCycle"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/usermanagement" 
                        icon = {UsersIcon}
                        selectedicon = {UsersSelectedIcon} 
                        tooltip = "Users"
                    ></SidebarIcon>
                    <SidebarIcon 
                        onClick = {handleSidebarButton} 
                        path = "/dashboard/add" 
                        icon = {LibraryAddIcon}
                        selectedicon = {LibraryAddSelectedIcon}
                        tooltip = "Add"
                    ></SidebarIcon>
                    {/* dark mode toggle button */}
                    <div
                        title = "Dark Mode"
                        className = "dashboard-page-sidebar-darkmode-container"
                        onClick = {handleSidebarDarkModeToggle}
                    >
                        <div className = "dashboard-page-sidebar-icon-darkmode-circle"></div>
                    </div>
                </div>
                {/* bottom text */}
                <div className = "dashboard-page-sidebar-bottomtext">
                    <Timestamp />
                    {version != null && 
                    <h1 className = "dashboard-page-sidebar-bottomtext-versiontext">VER {version}</h1>}
                </div>
            </div>
            {/* default, non-config page */}
            {location.pathname !== "/dashboard/config" && defaultTemplate}
            {/* config or photosensor */}
            {(location.pathname === "/dashboard/config" || location.pathname === "/dashboard/photosensor")
             && configTemplate}
            {/* footer */}
            <div className = {location.pathname !== "/dashboard/view" ? 
                                (location.pathname !== "/dashboard/config" ? 
                                    "dashboard-page-footer" : "dashboard-page-config-footer") : 
                                        "dashboard-page-view-footer"}>
                <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
            </div> :
            <HashRouter>
                <div className = "pages">
                    <Route 
                        path = "/dashboard/view" 
                        render = {(props) => <DashboardView 
                                                location = {selectedLocation}
                                                area = {selectedArea}
                                                block = {selectedBlock} 
                                                {...props} />}
                                            >
                    </Route>
                    <Route 
                        path = "/dashboard/config" 
                        render = {(props) => <DashboardConfig 
                                                location = {selectedLocation}
                                                area = {selectedArea}
                                                block = {selectedBlock}
                                                level = {selectedLevel}
                                                lights = {selectedLight}
                                                cancel = {handleConfigCancel}
                                                {...props} />}
                                            >
                    </Route>
                    <Route 
                        path = "/dashboard/photosensor" 
                        render = {(props) => <DashboardPhotosensor 
                                                location = {selectedLocation}
                                                area = {selectedArea}
                                                block = {selectedBlock}
                                                level = {selectedLevel}
                                                lights = {selectedLight}
                                                cancel = {handleConfigCancel}
                                                {...props} />}
                                            >
                    </Route>
                    <Route 
                        path = "/dashboard/datacharts" 
                        render = {(props) => <DashboardDatacharts {...props} />}>
                    </Route>
                    <Route 
                        path = "/dashboard/lightcycle" 
                        render = {(props) => <DashboardLightCycle {...props} />}>
                    </Route>
                    <Route 
                        path = "/dashboard/usermanagement" 
                        render = {(props) => <DashboardUserManagement 
                                                location = {selectedLocation}
                                                area = {selectedArea}
                                                block = {selectedBlock}
                                                {...props} />}>
                    </Route>
                    <Route 
                        path = "/dashboard/add" 
                        render = {(props) => <DashboardAdd {...props} />}>
                    </Route>
                </div>
            </HashRouter>
        </div>
    );
}

export default Dashboard;