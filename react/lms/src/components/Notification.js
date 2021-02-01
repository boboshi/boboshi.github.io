import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import NotificationIcon from "../resources/dashboard/Component 14 – 3(plain)@2x.png";
import NotificationIconAlert from "../resources/dashboard/Component 14 – 3(no number)@2x.png"
import NotificationPoylgon from "../resources/dashboard/polygon.png";

const Notification = forwardRef((props, ref) =>
{
    const node = useRef();
    const [notifications, setNotifications] = useState(props.notifications);
    const [isOpen, setIsOpen] = useState(false);

    const notificationsList = notifications.map(notif =>
        <li
            key = {notif.title}
        >
            {notif.title}
        </li>
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
        <div>
            {notifications.length ?
                <img 
                    alt = "" 
                    src = {NotificationIconAlert} 
                    className = "dashboard-page-header-notification"
                    onClick = {handleNotificationClick}
                ></img> :
                <img 
                    alt = "" 
                    src = {NotificationIcon} 
                    className = "dashboard-page-header-notification"
                    onClick = {handleNotificationClick}
                ></img>
            }
            {isOpen && openTemplate}
        </div>
    );
})

export default Notification;