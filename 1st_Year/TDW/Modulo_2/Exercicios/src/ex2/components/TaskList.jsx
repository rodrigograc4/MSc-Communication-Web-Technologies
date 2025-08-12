import React, { useContext } from "react";
import { TaskContext } from "../pages/ToDoList";
import PropTypes from "prop-types";

function TaskList() {
    const { tasks, removeTask, toggleTaskCompletion } = useContext(TaskContext);

    TaskList.propTypes = {
        tasks: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                text: PropTypes.string.isRequired,
                completed: PropTypes.bool.isRequired,
            })
        ),
        removeTask: PropTypes.func.isRequired,
        toggleTaskCompletion: PropTypes.func.isRequired,
    };

    return (
        <ul className="min-h-[300px]">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className={`flex justify-between items-center p-3 mb-2 bg-white shadow rounded-lg ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                >
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="mr-2"
                        />
                        <span>{task.text}</span>
                    </div>
                    <button
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() => removeTask(task.id)}
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default TaskList;
