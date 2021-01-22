import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import BG from "./resources/login/nastuh-abootalebi-284883-unsplash.png";

function Login(props)
{
    return (
        <div className = "login-page">
            <img src = {BG} className = "login-page-bg"></img>
            <LoginForm />
            <div className = "login-page-footer">
                <h1 className = "login-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                <h2 className = "login-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
            </div>
        </div>
    );
}

export default Login;