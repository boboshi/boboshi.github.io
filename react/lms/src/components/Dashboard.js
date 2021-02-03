import React, {useState, useRef, useEffect} from "react";
import {Route, HashRouter, useHistory, useLocation} from "react-router-dom";

import Map from "../resources/dashboard/map@2x.png";
import SidebarLogo from "../resources/dashboard/Aztech logo 2020@2x.png";
import SidebarToggleButton from "../resources/dashboard/menu_icon@2x.png";
import DefaultUser from "../resources/dashboard/blank_user.png";
import UsersIcon from "../resources/dashboard/users-solid.png";
import LibraryAddIcon from "../resources/dashboard/library_add.png";

import Timestamp from "../components/Timestamp";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Notification from "../components/Notification";
import UserDropdown from "../components/UserDropdown";
import SidebarIcon from "../components/SidebarIcon";
import DashboardView from "../components/DashboardView";
import DashboardConfig from "../components/DashboardConfig";
import DashboardUserManagement from "../components/DashboardUserManagement";
import DashboardAdd from "../components/DashboardAdd";

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
    const notificationRef = useRef();

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
        let curruser = new UserObject("office_admin", "Project Manager", DefaultUser);
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
        if (locationDDRef.current)
            locationDDRef.current.clearChoice();
        if (areaDDRef.current)
            areaDDRef.current.clearChoice();
        if (blockDDRef.current)
            blockDDRef.current.clearChoice();
        goToPath("/dashboard");
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
        if (location.pathname === "/dashboard")
            goToPath("/dashboard/view");
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
        goToPath("/dashboard/usermanagement");
    }

    function logout()
    {
        history.push("/login");
    }

    function handleSidebarView()
    {
        goToPath("/dashboard/view");
    }

    function handleSidebarConfig()
    {
        goToPath("/dashboard/config");
    }

    function handleSidebarUser()
    {
        goToPath("/dashboard/usermanagement");
    }

    function handleSidebarAdd()
    {
        goToPath("/dashboard/add");
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
                    <SidebarIcon onClick = {handleSidebarView} path = "/dashboard/view" icon = {UsersIcon}></SidebarIcon>
                    <SidebarIcon onClick = {handleSidebarConfig} path = "/dashboard/config" icon = {UsersIcon}></SidebarIcon>
                    <SidebarIcon onClick = {handleSidebarUser} path = "/dashboard/usermanagement" icon = {UsersIcon}></SidebarIcon>
                    <SidebarIcon onClick = {handleSidebarAdd} path = "/dashboard/add" icon = {LibraryAddIcon}></SidebarIcon>
                </div>
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
                {location.pathname === "/dashboard" && selectedLocation &&
                    <div>
                        <img alt = "" src = {Map} className = "dashboard-page-selector-sgmapimg"></img>
                    </div>
                }
                <HashRouter>
                    <div className = "pages">
                        <Route 
                            path = "/dashboard/view" 
                            render = {(props) => <DashboardView block = {selectedBlock} {...props} />}>
                        </Route>
                        <Route 
                            path = "/dashboard/config" 
                            render = {(props) => <DashboardConfig {...props} />}>
                        </Route>
                        <Route 
                            path = "/dashboard/usermanagement" 
                            render = {(props) => <DashboardUserManagement {...props} />}>
                        </Route>
                        <Route 
                            path = "/dashboard/add" 
                            render = {(props) => <DashboardAdd {...props} />}>
                        </Route>
                    </div>
                </HashRouter>
            </div>
            {location.pathname !== "/dashboard/view" ? 
                <div className = "dashboard-page-footer">
                    <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                    <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
                </div> :
                <div className = "dashboard-page-view-footer">
                    <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                    <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
                </div>
            }
        </div>
    );
}

export default Dashboard;