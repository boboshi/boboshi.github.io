import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import BG from "./resources/login/nastuh-abootalebi-284883-unsplash.png";

function Login(props)
{
    return (
        <div className = "login-page">
            <h1>SITE HEADER</h1>
            <LoginForm />
        </div>
    );
}

export default Login;