import React from "react";

function Historic({ history }) {
    return (
        <div className="min-h-[320px]">
            <h3 className="text-2xl font-semibold text-magenta mb-4">Transactions History</h3>
            <ul className="space-y-2">
                {history.map((transaction, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-3 mb-2 bg-white shadow rounded-lg"
                    >
                        <span>{transaction.type}:</span>
                        <span
                            className={`font-semibold ${transaction.type === 'Deposit' ? 'text-green-600' : 'text-black'
                                }`}
                        >
                            {transaction.type === 'Deposit' ? `+ $${transaction.amount}` : `- $${transaction.amount}`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Historic;