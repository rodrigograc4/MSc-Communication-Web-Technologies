import React from "react";

function Buttons({ handleDeposit, handleWithdraw }) {
    return (
        <div className="flex space-x-2">
            <button
                className="w-full bg-nice-pink text-white p-2 rounded-lg transition duration-200 ease-in-out"
                onClick={handleDeposit}
            >
                Deposit
            </button>
            <button
                className="w-full bg-nice-pink text-white p-2 rounded-lg transition duration-200 ease-in-out"
                onClick={handleWithdraw}
            >
                Withdraw
            </button>
        </div>
    );
}

export default Buttons;
