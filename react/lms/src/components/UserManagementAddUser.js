import React, {useEffect, useState} from "react";

import AddUserIcon from "../resources/dashboard/usermanagement-adduser.svg";
import ButtonIcon from "../resources/dashboard/usermanagement-addbox-button.svg";
import UpArrowIcon from "../resources/dashboard/Icon ionic-md-arrow-dropup.svg";
import DownArrowIcon from "../resources/dashboard/Icon ionic-md-arrow-dropdown.svg";
import EyeIcon from "../resources/dashboard/icon-eye.svg";
import EyeOffIcon from "../resources/dashboard/icon-eye-off.svg";

function UserManagementAddUser(props)
{
    const [username, setUserName] = useState("");
    const [usertype, setUsertype] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [currTypeIndex, setCurrTypeIndex] = useState(0);
    const [lastTypeIndex, setLastTypeIndex] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // simulate getting data
    useEffect(() =>
    {
        setCurrTypeIndex(0);
        setLastTypeIndex(props.userTypes.length - 1);
    }, [props.userTypes]);

    function handleOpenMenu()
    {
        props.setOpen(!props.open);
    }

    function handleChangeUsername(e)
    {
        setUserName(e.target.value);
    }

    function handleChangeEmail(e)
    {
        setEmail(e.target.value);
    }

    function handleChangeContactNumber(e)
    {
        setContactNumber(e.target.value);
    }

    function handleChangePassword(e)
    {
        setPassword(e.target.value);
    }

    function handleChangeConfirmPassword(e)
    {
        setConfirmPassword(e.target.value);
    }

    function handleUpArrow()
    {
        if (usertype === "" || currTypeIndex === lastTypeIndex)
        {
            setCurrTypeIndex(0);
            setUsertype(props.userTypes[0]);
        }
        else
        {
            setCurrTypeIndex(currTypeIndex + 1);
            setUsertype(props.userTypes[currTypeIndex + 1]);
        }
    }

    function handleDownArrow()
    {
        if (usertype === "" || currTypeIndex === 0)
        {
            setCurrTypeIndex(lastTypeIndex);
            setUsertype(props.userTypes[lastTypeIndex]);
        }
        else
        {
            setCurrTypeIndex(currTypeIndex - 1);
            setUsertype(props.userTypes[currTypeIndex - 1]);
        }
    }

    function handleTogglePasswordHide()
    {
        setShowPassword(!showPassword);
    }

    function handleToggleConfirmPasswordHide()
    {
        setShowConfirmPassword(!showConfirmPassword);
    }

    function placeholder() {}

    function handleSubmit(e)
    {
        e.preventDefault();
        props.add(username);
    }

    return(
        <div className = "dashboard-page-usermanagement-adduser-container">
            {/* main card */}
            <div 
                className = "dashboard-usermanagement-addbox-box" 
                style = {props.open ? {borderRadius: "6px 6px 0px 0px"} : {borderRadius: "6px 6px 6px 6px"}}
            >
                {/* icon */}
                <img alt = "" src = {AddUserIcon} className = "dashboard-usermanagement-addbox-icon"></img>
                {/* title */}
                <div className = "dashboard-usermanagement-addbox-title">
                    Register New User
                </div>
                {/* text */}
                <div className = "dashboard-usermanagement-addbox-text">
                    Register new user to control the smart system light for your estate.
                </div>
                {/* button */}
                <div 
                    className = "dashboard-usermanagement-addbox-button"
                    style = {props.enabled ? {opacity: 1.0} : {opacity: 0.5, pointerEvents: "none"}}
                    onClick = {handleOpenMenu}
                >
                    <img alt = "" src = {ButtonIcon} className = "dashboard-usermanagement-addbox-button-icon"></img>
                    <div className = "dashboard-usermanagement-addbox-button-text">
                        Register New User
                    </div>
                </div>
            </div>
            {/* dropdown menu */}
            {props.open &&
                <div className = "dashboard-usermanagement-addbox-dropdown-container">
                    <form onSubmit = {handleSubmit}>
                        <input
                            type = "text"
                            id = "usermanagement-input-username"
                            className = "dashboard-usermanagement-addbox-input"
                            name = "username"
                            value = {username}
                            placeholder = "USER NAME"
                            onChange = {handleChangeUsername}
                        ></input>
                        <div style = {{position: "relative"}}>
                            <input
                                style = {{pointerEvents: "none"}}
                                type = "text"
                                id = "usermanagement-input-usertype"
                                className = "dashboard-usermanagement-addbox-input"
                                name = "usertype"
                                value = {usertype}
                                placeholder = "USER TYPE"
                                onChange = {placeholder}
                            ></input>
                            {/* user type select buttons */}
                            <img
                                alt = ""
                                src = {UpArrowIcon}
                                className = "dashboard-usermanagement-addbox-up"
                                onClick = {handleUpArrow}
                            ></img>
                            <img
                                alt = ""
                                src = {DownArrowIcon}
                                className = "dashboard-usermanagement-addbox-down"
                                onClick = {handleDownArrow}
                            ></img>
                        </div>
                        <input
                            type = "text"
                            id = "usermanagement-input-email"
                            className = "dashboard-usermanagement-addbox-input"
                            name = "email"
                            value = {email}
                            placeholder = "EMAIL"
                            onChange = {handleChangeEmail}
                        ></input>
                        <input
                            type = "text"
                            id = "usermanagement-input-contactnumber"
                            className = "dashboard-usermanagement-addbox-input"
                            name = "contactnumber"
                            value = {contactNumber}
                            placeholder = "CONTACT NUMBER"
                            onChange = {handleChangeContactNumber}
                        ></input>
                        <div style = {{position: "relative"}}>
                            <input
                                type = {showPassword ? "text" : "password"}
                                id = "usermanagement-input-password"
                                className = "dashboard-usermanagement-addbox-input"
                                name = "password"
                                value = {password}
                                placeholder = "PASSWORD"
                                onChange = {handleChangePassword}
                            ></input>
                            {/* show/hide password button */}
                            <img 
                                alt = "" 
                                src = {showPassword ? EyeOffIcon : EyeIcon} 
                                className = "dashboard-usermanagement-addbox-hide"
                                onClick = {handleTogglePasswordHide}
                            ></img>
                        </div>
                        <div style = {{position: "relative"}}>
                            <input
                                type = {showConfirmPassword ? "text" : "password"}
                                id = "usermanagement-input-confirmpassword"
                                className = "dashboard-usermanagement-addbox-input"
                                name = "confirmpassword"
                                value = {confirmPassword}
                                placeholder = "CONFIRM PASSWORD"
                                onChange = {handleChangeConfirmPassword}
                            >
                            </input>
                            {/* show/hide password button */}
                            <img 
                                alt = "" 
                                src = {showConfirmPassword ? EyeOffIcon : EyeIcon} 
                                className = "dashboard-usermanagement-addbox-hide"
                                onClick = {handleToggleConfirmPasswordHide}
                            ></img>
                        </div>
                        {/* register button */}
                        <button className = "dashboard-usermanagement-addbox-submit" type = "submit">
                            REGISTER
                        </button>
                    </form>
                </div>
            }
        </div>
    );
}

export default UserManagementAddUser;