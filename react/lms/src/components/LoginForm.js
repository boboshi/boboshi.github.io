import "../resources/css/loginsignup.css";

import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import BG from "../resources/login/nastuh-abootalebi-284883-unsplash@2x.png";
import LoginRect from "../resources/login/Rectangle 2@2x.png";
import Line from "../resources/login/Path 1.svg";
import Logo from "../resources/login/Aztech logo 2020-WH.svg";

function LoginForm(props)
{
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmitNext(e)
    {
        e.preventDefault();
        console.log({email});
        console.log({password});
        history.push("/dashboard")
    }

    function handleForgotPW(e)
    {
        e.preventDefault();
        history.push("/signup");
    }

    function handleChangeEmail(e)
    {
        setEmail(e.target.value);
    }

    function handleChangePassword(e)
    {
        setPassword(e.target.value);
    }

    return (
        <div>
            <img alt = "" src = {BG} className = "main-page-bg"></img>
            <div className = "main-page-footer">
                <h1 className = "main-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                <h2 className = "main-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
            </div>
            <div className = "login-page-form">
                <img alt = "" src = {LoginRect} className = "login-page-form-rect"></img>
                <h1 className = "login-page-form-welcome">Welcome Back!</h1>
                <img alt = "" src = {Logo} className = "login-page-form-logo"></img>
                <h2 className = "login-page-form-logintext">LOGIN</h2>
                <h3 className = "login-page-form-lmstext">Lighting Management System (LMS)</h3>
                <form onSubmit = {handleSubmitNext}>
                    <div>
                        <input
                            type = "text"
                            id = "login-email"
                            className = "login-page-form-email"
                            name = "email"
                            value = {email}
                            placeholder = "EMAIL"
                            onChange = {handleChangeEmail}
                        ></input>
                    </div>
                    <div>
                        <input
                            type = "password"
                            id = "login-password"
                            className = "login-page-form-password"
                            name = "password"
                            value = {password}
                            placeholder = "PASSWORD"
                            onChange = {handleChangePassword}
                        ></input>
                    </div>
                    <div>
                        <button type = "submit" className = "login-page-form-nextbtn"></button>
                    </div>
                </form>
                <form onSubmit = {handleForgotPW}>
                    <h1 className = "login-page-form-forgottext">FORGOT PASSWORD?</h1>
                    <button type = "submit" className = "login-page-form-pwbtn">
                        <h1 className = "login-page-form-pwbtntext">CHECK HERE</h1>
                    </button>
                </form>
                <img alt = "" src = {Line} className = "login-page-form-line"></img>
                <h1 className = "login-page-form-agreetext">
                    By clicking on next, you acknowledge that you have read and accepted the Terms of Service and the Privacy Policy.
                </h1>
            </div>
        </div>
    );
}

export default LoginForm;