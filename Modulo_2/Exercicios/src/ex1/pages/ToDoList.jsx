import React, { useState, useEffect } from "react";
import AddTask from "../components/AddTask";
import SearchTask from "../components/SearchTask";
import TaskList from "../components/TaskList";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = (task) => {
        const newTask = {
            id: Date.now(),
            text: task,
            completed: false
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const filteredTasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-darkest-red flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-6 bg-off-white to-pink-300 shadow-2xl rounded-lg min-h-[300px] p-12">
                <h1 className="text-4xl font-bold text-center text-clean-orange mb-16">
                    To-Do List
                </h1>
                <div className="flex space-x-10 mb-8">
                    <AddTask addTask={addTask} />
                    <SearchTask search={search} setSearch={setSearch} />
                </div>
                <TaskList
                    tasks={filteredTasks}
                    removeTask={removeTask}
                    toggleTaskCompletion={toggleTaskCompletion}
                />
            </div>
        </div>
    );
}

export default ToDoList;
