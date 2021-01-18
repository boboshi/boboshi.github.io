// imports
import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//import ThreeJsScene from "./threejsscene";

const DATA = [
	{id: "todo-0", name: "Task0", completed: true},
	{id: "todo-1", name: "Task1", completed: false},
	{id: "todo-2", name: "Task2", completed: false}
];

const rootElement = document.getElementById("root");

ReactDOM.render(<App tasks = {DATA}/>, rootElement);
//ReactDOM.render(<ThreeJsScene />, rootElement);