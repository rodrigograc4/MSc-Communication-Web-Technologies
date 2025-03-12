import React from "react";

function SearchTask({ search, setSearch }) {
    return (
        <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-clean-orange"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );
}

export default SearchTask;
