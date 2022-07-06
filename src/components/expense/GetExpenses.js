import {useEffect, useState} from "react";

export const GetExpenses = (props) => {
    const [expenses, setExpenses] = useState([])
    const [category, setCategory] = useState("")
    const [dateRange, setDateRange] = useState({
        startDate: "", endDate: ""
    })

    const handleChange = (e) => {
        const value = e.target.value
        setDateRange({...dateRange, [e.target.name]: value})
    }

    const submit = (e) => {
        e.preventDefault()
        if (dateRange.startDate !== "" && dateRange.endDate === "") {
            alert("please select both start date and end date")
        } else if ((dateRange.startDate === "" && dateRange.endDate !== "")) {
            alert("please select both start date and end date")
        } else {
            getExpenses()
        }
    }

    const getExpenses = () => {
        fetch(`${props.BASE_URL}/expenses?category=${category}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
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

    return (<>
        <form onSubmit={submit}>
            <div className="flex flex-col items-center">
                <div className="flex date-range-picker">
                    <div className="date-range-picker__input">
                        <label htmlFor="start-date">Start Date</label>
                        <input type="date" id="start-date" name="startDate"
                               onChange={handleChange}/>
                    </div>
                    <div className="w-1/2 date-range-picker__input">
                        <label htmlFor="end-date">End Date</label>
                        <input type="date" id="end-date" name="endDate" value={dateRange.endDate}
                               onChange={handleChange}/>
                    </div>
                </div>


                <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select
                    a
                    Category</label>
                <select id="categories"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Choose a category</option>
                    <option>Broadband</option>
                    <option>Mobile Phone</option>
                    <option>Learning and Development</option>
                    <option>Fuel/Travel Allowance</option>
                    <option>Tech Conferences</option>
                    <option>Conference related travel and accommodations</option>
                </select>

                <button type="submit">Submit</button>


                <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Your Expenses</h5>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                            Amount
                        </a>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {expenses ? expenses.map((expense, index) => {
                                //format date
                                const date = new Date(expense.expense_date)
                                return (<li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        {/*<div className="flex-shrink-0">*/}
                                        {/*<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg"*/}
                                        {/*     alt="Neil image"/>*/}
                                        {/*</div>*/}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {expense.category}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {date.toDateString()}
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
                                </li>)
                            }) : <li>No expenses found</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    </>)
}
