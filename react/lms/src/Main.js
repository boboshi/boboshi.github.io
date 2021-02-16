import "./resources/css/fonts.css";

import React, {useEffect} from "react";
import {Route, HashRouter, Redirect} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Dashboard from "./components/Dashboard";

function Main(props)
{
    // called every render
    useEffect(() => {
        //console.log("effect");
      });

    return (
        <HashRouter>
            <div className = "main-page">
                <div className = "pages">
                    <Route exact path = "/"><Redirect to = "/login" /></Route>
                    <Route path = "/login" component = {LoginForm}></Route>
                    <Route path = "/signup" component = {SignUpForm}></Route>
                    <Route 
                        path = "/dashboard" 
                        render = {(props) => <Dashboard {...props} />}>
                    </Route>
                </div>
            </div>
        </HashRouter>
    );
}

export default Main;

//  render = {(props) => <LoginForm changePage = {changePage} {...props} />}>