import React, { useContext } from "react";
import { TaskContext } from "../pages/ToDoList";
import PropTypes from "prop-types";

function SearchTask() {
    const { search, setSearch } = useContext(TaskContext);

    SearchTask.propTypes = {
        search: PropTypes.string,
        setSearch: PropTypes.func.isRequired,
    };

    return (
        <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-clean-blue"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );
}

export default SearchTask;
