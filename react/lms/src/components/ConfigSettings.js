import React, {useState, useEffect} from "react";

import Header from "../resources/dashboard/configheader-top.svg";
import HeaderIcon from "../resources/dashboard/Icon ionic-ios-settings.svg";

function ConfigSettings()
{
    return(
        <div className = "dashboard-page-config-settings-container">
            {/* header icon */}
            <img alt = "" src = {HeaderIcon} className = "dashboard-page-config-header-top-icon"></img>
            {/* header button(s) */}

            {/* header */}
            <div className = "dashboard-page-config-header-top">
                <h1 className = "dashboard-page-config-header-top-text">SETTINGS</h1>
                <img alt = "" src = {Header} className = "dashboard-page-config-header-top-img"></img>
            </div>
        </div>
    );
}

export default ConfigSettings;