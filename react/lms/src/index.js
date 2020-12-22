// imports
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ThreeJsScene from "./threejsscene";

// three.js scene component
class App extends Component 
{
	render() 
	{
		return (<div><ThreeJsScene /></div>);
	}
}
const rootElement = document.getElementById("root");
ReactDOM.render(<ThreeJsScene />, rootElement);