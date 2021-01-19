import React, {useState} from "react";

function LoginForm(props)
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e)
    {
        e.preventDefault();
        console.log("submitted");
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
        <div className = "login-form">
            <form onSubmit = {handleSubmit}>
                <div>
                    <input
                        type = "text"
                        id = "login-email"
                        className = "login-input"
                        name = "email"
                        value = {email}
                        placeholder = "EMAIL"
                        onChange = {handleChangeEmail}
                    ></input>
                </div>
                <div>
                    <input
                        type = "text"
                        id = "login-password"
                        className = "login-input"
                        name = "password"
                        value = {password}
                        placeholder = "PASSWORD"
                        onChange = {handleChangePassword}
                    ></input>
                </div>
                <div>
                    <button type = "submit" className = "login-btn">
                        Next
                    </button>
                </div>

            </form>
        </div>
    );
}

export default LoginForm;