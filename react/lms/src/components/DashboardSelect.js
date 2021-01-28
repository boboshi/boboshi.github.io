import React, {useState} from "react";
import Map from "../resources/dashboard/map@2x.png";
import Dropdown from "../components/Dropdown"

function DashboardSelect(props)
{
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");

    function selectLocation(str)
    {
        setSelectedLocation(str);
        props.setLocation(str);
        setSelectedArea("");
        props.setArea("");
        setSelectedBlock("");
        props.setBlock("");
    }

    function selectArea(str)
    {
        setSelectedArea(str);
        props.setArea(str);
        setSelectedBlock("");
        props.setBlock("");
    }

    function selectBlock(str)
    {
        setSelectedBlock(str);
        props.setBlock(str);
    }

    return(
        <div className = "dashboard-page-selector">
            <div className = "dashboard-page-footer">
                <h1 className = "dashboard-page-footer-copyright">COPYRIGHT © 2020 AZTECH TECHNOLOGIES PTE LTD. ALL RIGHTS RESERVED.</h1>
                <h2 className = "dashboard-page-footer-privacy">PRIVACY POLICY · TERMS & CONDITIONS</h2>
            </div>
            <div className = "dashboard-page-selector-locationdropdown">
                <Dropdown 
                    title = "LOCATION"
                    options = {["SINGAPORE"]}
                    selectOption = {selectLocation}
                ></Dropdown>
            </div>
            {selectedLocation && 
                <div>
                    <img src = {Map} className = "dashboard-page-selector-sgmapimg"></img>
                    <div className = "dashboard-page-selector-areadropdown">
                        <Dropdown
                            title = "AREA"
                            options = {["GEYLANG"]}
                            selectOption = {selectArea}
                        ></Dropdown>
                    </div>
                </div>
            }
            {selectedLocation && selectedArea &&
                <div>
                    <div className = "dashboard-page-selector-blockdropdown">
                        <Dropdown
                            title = "BLOCK"
                            options = {["Office_Lights"]}
                            selectOption = {selectBlock}
                        ></Dropdown>
                    </div>
                </div>
            }
        </div>
    );
}

export default DashboardSelect;