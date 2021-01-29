import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import NotificationIcon from "../resources/dashboard/Component 14 – 3(plain)@2x.png"
import NotificationIconAlert from "../resources/dashboard/Component 14 – 3(no number)@2x.png"

const Notification = forwardRef((props, ref) =>
{
    const node = useRef();
    const [notifications, setNotifications] = useState(props.notifications);
    const [isOpen, setIsOpen] = useState(false);

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

    useEffect(() => 
    {    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {document.removeEventListener("mousedown", handleClickOutside);};
    }, []);

    const openTemplate =
    (
        <div className = "what">
            
        </div>
    );

    return(
        <div>
            {props.notifications ?
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