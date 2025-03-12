import React, { useState, useContext } from "react";
import { TaskContext } from "../pages/ToDoList";
import PropTypes from "prop-types";

function AddTask() {
    const [task, setTask] = useState("");
    const { addTask } = useContext(TaskContext);

    AddTask.propTypes = {
        addTask: PropTypes.func.isRequired,
    };

    const handleAddTask = () => {
        if (task.trim()) {
            addTask(task);
            setTask("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddTask();
        }
    };

    return (
        <div className="flex w-full">
            <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-clean-blue"
                placeholder="Add a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                className="bg-clean-blue text-white p-2 rounded-r-lg hover:bg-clean-blue transition duration-200 ease-in-out"
                onClick={handleAddTask}
            >
                Add
            </button>
        </div>
    );
}

export default AddTask;
