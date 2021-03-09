// imports
import React, {useState} from "react";
import {Route, NavLink, HashRouter} from "react-router-dom";
import {nanoid} from "nanoid";
import ThreeJsScene from "./threejsscene.js"
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

const FILTER_MAP =
{
    All: () => true,
    Active: task => !task.completed,
    Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props)
{
    const [tasks, setTasks] = useState(props.tasks);
    const [filter, setFilter] = useState("All");

    const taskList = tasks
        .filter(FILTER_MAP[filter])
        .map(task => 
        <Todo
            key = {task.id}
            id = {task.id}
            name = {task.name}
            completed = {task.completed}
            toggleTaskCompleted = {toggleTaskCompleted}
            deleteTask = {deleteTask}
            editTask = {editTask}
        />
    );

    const filterList = FILTER_NAMES.map(name => 
        <FilterButton 
            key = {name}
            name = {name}
            isPressed = {name === filter}
            setFilter = {setFilter}
        />
    );

    const taskStr = taskList.length !== 1 ? "tasks" : "task";
    const headerText = taskList.length.toString() + " " + taskStr;

    function addTask(name)
    {
        const newTask = {id: "todo-" + nanoid(),
                         name: name,
                         completed: false};
        setTasks([...tasks, newTask]);
    }

    function toggleTaskCompleted(id)
    {
        const updatedTasks = tasks.map(task =>
            {
                if (id === task.id)
                    return {...task, completed: !task.completed};

                return task;
            });
        setTasks(updatedTasks);
    }

    function deleteTask(id)
    {
        const remainingTasks = tasks.filter(task => id !== task.id);
        setTasks(remainingTasks);
    }

    function editTask(id, newName)
    {
        const editedTaskList = tasks.map(task =>
            {
                if (id === task.id)
                    return {...task, name: newName};
                return task;
            });
        setTasks(editedTaskList);
    }

	return (
        <div className = "todo app stack-large">
            <h1>Todo List</h1>
            <Form addTask = {addTask}/>
            <div className = "filters btn-group stack-exception">
                {filterList}
            </div>
            <h2 id = {"list-heading"}>
                {headerText}
            </h2>
            <ul
                role = "list"
                className = "todo-list stack-large stack-exception"
                aria-labelledby = "list-heading"
            >
                {taskList}
            </ul>
        </div>
	);
}

export default App;