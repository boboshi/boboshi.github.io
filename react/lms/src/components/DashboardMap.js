import React, {useState} from "react";
import {Route, HashRouter, useHistory} from "react-router-dom";

function DashboardMap(props)
{
    const history = useHistory();

    function clickPlaceholder(e)
    {
        e.preventDefault();
        history.push("/login");
    }

    return(
        <div className = "dashboard-page-map">
            <div className = "dashboard-page-footer">
                <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
            </div>
            <button onClick = {clickPlaceholder} className = "placeholderbtn">PLACEHOLDERR</button>
        </div>
    );
}

export default DashboardMap;