import React, {useState} from "react";
import SearchIcon from "../resources/dashboard/search icon.svg";

function SearchBar(props)
{
    const [search, setSearch] = useState("");

    function handleChangeSearch(e)
    {
        setSearch(e.target.value);
        props.handleSearch(search);
    }

    return(
        <div>
            <img alt = "" src = {SearchIcon} className = "dashboard-page-header-searchiconimg"></img>
            <input
                type = "text"
                id = "searchbar"
                className = "dashboard-page-header-searchbar"
                name = "search"
                defaultValue = {search}
                placeholder = "SEARCH"
                onChange = {handleChangeSearch}
             ></input>
        </div>
    );
}

export default SearchBar;