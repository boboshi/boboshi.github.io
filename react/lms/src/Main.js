import React, {useState} from "react";
import {Route, useHistory, HashRouter, Redirect} from "react-router-dom"
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

function Main(props)
{
    function changePage(page)
    {
        console.log(page);
    }

    return (
        <HashRouter>
            <div className = "main-page">
                <div className = "main-page-footer">
                    <h1 className = "main-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                    <h2 className = "main-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
                </div>
                <div className = "pages">
                    <Route exact path = "/"><Redirect to = "/login" /></Route>
                    <Route 
                        path = "/login" 
                        render = {(props) => <LoginForm changePage = {changePage} {...props} />}>
                    </Route>
                    <Route path = "/signup" component = {SignUpForm}></Route>
                </div>
            </div>
        </HashRouter>
    );
}

export default Main;