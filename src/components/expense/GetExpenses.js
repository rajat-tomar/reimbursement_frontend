import {useEffect, useState} from "react";


export const GetExpenses = (props) => {
    const [expenses, setExpenses] = useState([]);

    const getExpenses = () => {
        fetch(`${props.BASE_URL}/expenses`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
            }).then((data) => {
            setExpenses(data.data)
        })
    }

    useEffect(() => {
        getExpenses();
    }, [])

    console.log(expenses)
    return (<>

        <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Your Expenses</h5>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Amount
                </a>
            </div>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {expenses.map((expense, index) => {
                        return (
                            <li key={index} className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {/*<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg"*/}
                                        {/*     alt="Neil image"/>*/}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            Category Name
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            Date of expense
                                        </p>
                                    </div>
                                    <div
                                        //inline-flex
                                        className="items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <span>₹{expense.amount}</span>
                                        <br/>
                                        <button onClick={() => {
                                            fetch(`${props.BASE_URL}/expense?id=${expense.id}`, {
                                                method: 'DELETE'
                                            }).then((response) => {
                                                if (response.status === 200) {
                                                    getExpenses();
                                                }
                                            })
                                        }}
                                                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    </>)
}
