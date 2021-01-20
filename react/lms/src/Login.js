import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import BG from "./resources/login/nastuh-abootalebi-284883-unsplash.png";
import Copyright from "./resources/login/copyright.png"
import PPTC from "./resources/login/Privacy Policy · Terms & Conditions.png"

function Login(props)
{
    return (
        <div className = "login-page">
            <img src = {BG} className = "login-page-bg"></img>
            <div className = "login-page-footer"></div>
            <img src = {Copyright} className = "login-page-footer-copyright"></img>
            <img src = {PPTC} className = "login-page-footer-pptc"></img>
            <LoginForm />
        </div>
    );
}

export default Login;