import React, {useState} from "react";
import LoginRect from "../resources/login/Rectangle 2.png"
import Line from "../resources/login/Path 1.png"
import Logo from "../resources/login/Aztech logo 2020-WH.png"

function LoginForm(props)
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmitNext(e)
    {
        e.preventDefault();
        console.log({email});
        console.log({password});
    }

    function handleForgotPW(e)
    {
        e.preventDefault();
        console.log("forgot pw");
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
        <div className = "login-page-form">
            <img src = {LoginRect} className = "login-page-form-rect"></img>
            <h1 className = "login-page-form-welcome">Welcome Back!</h1>
            <img src = {Logo} className = "login-page-form-logo"></img>
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
                <button type = "submit" className = "login-page-form-pwbtn"></button>
            </form>
        </div>
    );
}

export default LoginForm;