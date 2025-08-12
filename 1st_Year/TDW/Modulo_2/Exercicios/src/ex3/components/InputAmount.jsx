import React from "react";

function InputAmount({ amount, setAmount }) {
    return (
        <div className="flex w-full">
            <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-blue"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Input Amount"
            />
        </div>
    );
}

export default InputAmount;
