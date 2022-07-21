import {useEffect, useState} from "react";
import {BASE_URL} from "../../constants";

export const GetExpenses = () => {
    const [expenses, setExpenses] = useState([])
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")
    const [category, setCategory] = useState("")
    const [dateRange, setDateRange] = useState({
        startDate: "", endDate: ""
    })
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const handleDate = (e) => {
        const value = e.target.value
        setDateRange({...dateRange, [e.target.name]: value})
    }

    const getUsers = () => {
        fetch(`${BASE_URL}/users`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data?.length > 0) {
                    setUsers(data)
                }
            })
    }

    const getExpenses = () => {
        fetch(`${BASE_URL}/expenses?category=${category}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&userId=${userId}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            }
        }).then((data) => {
            if (data?.length > 0) {
                setExpenses(data)
            } else {
                setExpenses([])
            }
        })
    }

    const handleExpenseDelete = (id) => {
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }
        }).then((response) => {
        })
    }

    const createReimbursement = (amount, expenseId, category) => {
        fetch(`${BASE_URL}/reimbursement`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }, body: JSON.stringify({
                amount: amount, user_id: Number(userId), expense_id: expenseId, category: category
            })
        }).then((response) => {
            if (response.status === 201) {
            }
        })
    }

    const handleExpenseApprove = (e, id, amount, category) => {
        e.preventDefault();
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }, body: JSON.stringify({
                status: "approved"
            })
        }).then((response) => {
            if (response.status === 204) {
                setExpenses(expenses.map((expense) => {
                    if (expense.id === id) {
                        expense.status = "approved"
                    }
                    return expense
                }));
                createReimbursement(amount, id, category)
            } else {
                alert("could not approve expense")
            }
        })
    }

    const handleExpenseReject = (e, id) => {
        e.preventDefault();
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }, body: JSON.stringify({
                status: "rejected"
            })
        }).then((response) => {
            if (response.status === 204) {
                setExpenses(expenses.map((expense) => {
                    if (expense.id === id) {
                        expense.status = "rejected"
                    }
                    return expense
                }));
            }
        })
    }

    useEffect(() => {
        if (currentUser.role === "admin" || currentUser.role === "ca") {
            getUsers()
        }
    }, [])

    useEffect(() => {
        getExpenses()
    }, [dateRange, userId, category])

    return (<>
        <form>
            <div className="flex flex-col items-center">
                <div className="flex date-range-picker">
                    <div className="date-range-picker__input">
                        <label htmlFor="start-date">Start Date</label>
                        <input type="date" id="start-date" name="startDate"
                               onChange={handleDate}/>
                    </div>
                    <div className="w-1/2 date-range-picker__input">
                        <label htmlFor="end-date">End Date</label>
                        <input type="date" id="end-date" name="endDate"
                               onChange={handleDate}/>
                    </div>
                </div>
                <div className="contents">
                    <>
                        <label htmlFor="categories"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select
                            a
                            Category</label>
                        <select id="categories"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Choose a category</option>
                            <option>Fuel/Travel Allowance</option>
                            <option>Learning and Development</option>
                            <option>Mobile Phone</option>
                            <option>Broadband</option>
                            <option>Project</option>
                            <option>Tech Conferences</option>
                        </select>
                    </>
                    {(currentUser.role === "admin" || currentUser.role === "ca") && <>
                        <label htmlFor="users"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select
                            a
                            User</label>
                        <select id="users"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={userId} onChange={(e) => setUserId(e.target.value)}>
                            <option value="">Choose a user</option>
                            {users && users.map((user, index) => {
                                return <option key={index} value={user.id}>{user.name} - {user.email}</option>
                            })}
                        </select>
                    </>}
                </div>
                <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        {(expenses?.length > 0) ? (<>
                            {userId ?
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Expenses</h5> :
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Your
                                    Expenses
                                </h5>}
                        </>) : <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">No
                            Expenses</h5>}
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {(expenses?.length > 0) && expenses.map((expense, index) => {
                                const date = new Date(expense.expense_date)
                                return (<li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {expense.category}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {date.toDateString()}
                                            </p>
                                        </div>
                                        <div
                                            className="items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <span>₹{expense.amount}</span>
                                            <br/>
                                            {(expense.status === "pending") ? <>
                                                {((currentUser.role === "admin" || currentUser.role === "ca") && userId !== "") ? <>
                                                    <button className="text-sm text-green-600 hover:underline"
                                                            onClick={(e) => handleExpenseApprove(e, expense.id, expense.amount, expense.category)}>Approve
                                                    </button>
                                                    <button className="text-sm text-red-600 hover:underline"
                                                            onClick={(e) => handleExpenseReject(e, expense.id)}>Reject
                                                    </button>
                                                </> : (<button
                                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    onClick={() => handleExpenseDelete(expense.id)}>
                                                    Delete
                                                </button>)}
                                            </> : (<span
                                                className={`${expense.status === "approved" ? "text-green-600" : "text-red-600"}`}>
                                                    {expense.status}
                                                </span>)}
                                        </div>
                                    </div>
                                </li>)
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    </>)
}
