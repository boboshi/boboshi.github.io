import "../resources/css/notification.css";

import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import NotificationIcon from "../resources/dashboard/Component 14 – 3(plain)@2x.png";
import NotificationIconAlert from "../resources/dashboard/Component 14 – 3(no number)@2x.png"
import NotificationPoylgon from "../resources/dashboard/polygon.png";
import NotificationNotRectifiedIcon from "../resources/dashboard/icon-mateiral-perm-scan-wifi.png";
import NotificationRectifiedIcon from "../resources/dashboard/icon-material-security.png";

const Notification = forwardRef((props, ref) =>
{
    const node = useRef();
    const [notifications, setNotifications] = useState(props.notifications);
    const [isOpen, setIsOpen] = useState(false);

    const notificationsList = notifications.map(notif =>
        <div key = {notif.title}>
            {notif.rectified === "true" ?
                <li>
                    <img 
                        alt = ""
                        src = {NotificationNotRectifiedIcon}
                        className = "dashboard-page-header-notification-dropdown-li-icon"
                    ></img>
                    <div className = "dashboard-page-header-notification-dropdown-li-title">{notif.title}</div>
                    <div className = "dashboard-page-header-notification-dropdown-li-description">{notif.description}</div>
                    <div 
                        className =  "dashboard-page-header-notification-dropdown-li-button"
                        onClick = {handleNotificationCheckButton}
                    >CHECK</div>
                </li> :
                <li style={{backgroundColor: "#FF6A1B", border: "1px solid #FF6A1B"}}>
                    <img 
                        alt = ""
                        src = {NotificationRectifiedIcon}
                        className = "dashboard-page-header-notification-dropdown-li-icon"
                    ></img>
                    <div className = "dashboard-page-header-notification-dropdown-li-title">{notif.title}</div>
                    <div className = "dashboard-page-header-notification-dropdown-li-description">{notif.description}</div>
                    <div 
                        className =  "dashboard-page-header-notification-dropdown-li-button"
                    >RECTIFIED</div>
                </li>
            }
        </div>
    );

    useImperativeHandle(ref, () => ({
        placeholderFunc()
        {
            console.log("why are you here");
        }
    }));

    const handleClickOutside = e => 
    {
        if (node.current)
            if (node.current.contains(e.target)) 
                return;
            else
                setIsOpen(false);
    };

    function handleNotificationClick()
    {
        setIsOpen(!isOpen);
    }

    function handleNotificationClearButton()
    {
        setNotifications([]);
    }

    function handleNotificationCheckButton()
    {
        console.log("CHECK");
    }

    useEffect(() => 
    {    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {document.removeEventListener("mousedown", handleClickOutside);};
    }, []);

    const openTemplate =
    (
        <div>
            <img 
                alt = ""
                src = {NotificationPoylgon}
                className = "dashboard-page-header-notification-polygon"
            ></img>
            <div className = "dashboard-page-header-notification-toprect">
                <h1 className = "dashboard-page-header-notification-text">NOTIFICATIONS</h1>
                <div 
                    className =  "dashboard-page-header-notification-clearbtn"
                    onClick = {handleNotificationClearButton}
                >CLEAR</div>
            </div>
            <div className = "dashboard-page-header-notification-dropdown-list">
                <ul className = "dashboard-page-header-notification-dropdown-ul">
                    {notificationsList}
                </ul>
            </div>
        </div>
    );

    return(
        <div ref = {node}>
            {notifications.length ?
                <div className = "dashboard-page-header-notification">
                    <img 
                        alt = "" 
                        src = {NotificationIconAlert} 
                        className = "dashboard-page-header-notification-img"
                        onClick = {handleNotificationClick}
                    ></img>
                    <div className = "dashboard-page-header-notification-number">{notifications.length}</div>
                </div> :
                <div className = "dashboard-page-header-notification">
                    <img 
                        alt = "" 
                        src = {NotificationIcon} 
                        className = "dashboard-page-header-notification-img"
                        onClick = {handleNotificationClick}
                    ></img>
                </div>
            }
            {isOpen && openTemplate}
        </div>
    );
})

export default Notification;