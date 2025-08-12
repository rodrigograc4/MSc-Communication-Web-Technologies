// App.js
import React, { useState, useEffect, createContext } from "react";
import AddTask from "../components/AddTask";
import SearchTask from "../components/SearchTask";
import TaskList from "../components/TaskList";
import PropTypes from "prop-types";

export const TaskContext = createContext();

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");

    ToDoList.propTypes = {
        tasks: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                text: PropTypes.string.isRequired,
                completed: PropTypes.bool.isRequired,
            })
        ),
        search: PropTypes.string,
        setSearch: PropTypes.func,
    };

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks-ex2"));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem("tasks-ex2", JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = (task) => {
        const newTask = {
            id: Date.now(),
            text: task,
            completed: false,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const toggleTaskCompletion = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const filteredTasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <TaskContext.Provider
            value={{
                tasks: filteredTasks,
                addTask,
                removeTask,
                toggleTaskCompletion,
                search,
                setSearch,
            }}
        >
            <div className="min-h-screen bg-dark-blue flex items-center justify-center">
                <div className="max-w-2xl mx-auto p-6 bg-off-blue-white to-pink-300 shadow-2xl rounded-lg min-h-[300px] p-12">
                    <h1 className="text-4xl font-bold text-center text-clean-blue mb-16">
                        To-Do List ({filteredTasks.length} {filteredTasks.length === 1 ? "item" : "items"})
                    </h1>
                    <div className="flex space-x-10 mb-8">
                        <AddTask />
                        <SearchTask />
                    </div>
                    <TaskList />
                </div>
            </div>
        </TaskContext.Provider>
    );
}

export default ToDoList;
