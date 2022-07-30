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

    const getUsers = () => {
        fetch(`${BASE_URL}/users`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data?.length > 0) {
                    setUsers(data)
                }
            })
    }

    const handleDate = (e) => {
        const value = e.target.value
        setDateRange({...dateRange, [e.target.name]: value})
    }

    const handleExpenseApprove = (e, id, amount, category) => {
        e.preventDefault();
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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

    const handleExpenseDelete = (e, id) => {
        e.preventDefault();
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            if (response.status === 204) {
                getExpenses()
            }
        })
    }

    const handleExpenseReject = (e, id) => {
        e.preventDefault();
        fetch(`${BASE_URL}/expense?id=${id}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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

    const getExpenses = () => {
        fetch(`${BASE_URL}/expenses?category=${category}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&userId=${userId}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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

    const createReimbursement = (amount, expenseId, category) => {
        fetch(`${BASE_URL}/reimbursement`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }, body: JSON.stringify({
                amount: amount, user_id: Number(userId), expense_id: expenseId, category: category
            })
        }).then((response) => {
            if (response.status === 201) {
            }
        })
    }

    useEffect(() => {
        if (currentUser.role === "admin" || currentUser.role === "ca") {
            getUsers()
        }
    }, [currentUser.role])

    useEffect(() => {
        getExpenses()
    }, [dateRange, userId, category])

    return (<>
        <div className="grid h-screen place-items-center">
            <div className="w-full max-w-lg">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-8 date-range-picker">
                            <div className="date-range-picker__input">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                       htmlFor="start-date">Start Date</label>
                                <input
                                    className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                    type="date" id="start-date" name="startDate"
                                    onChange={handleDate}/>
                            </div>
                            <div className="w-1/2 date-range-picker__input">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                       htmlFor="end-date">End Date</label>
                                <input
                                    className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                    type="date" id="end-date" name="endDate"
                                    onChange={handleDate}/>
                            </div>
                        </div>

                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="category">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    className="block w-full bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                    id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">select a category</option>
                                    <option>Fuel/Travel Allowance</option>
                                    <option>Learning and Development</option>
                                    <option>Mobile Phone</option>
                                    <option>Broadband</option>
                                    <option>Project</option>
                                    <option>Tech Conferences</option>
                                </select>
                            </div>
                        </div>
                        {(currentUser.role === "admin" || currentUser.role === "ca") && (<>
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                       htmlFor="user">
                                    User
                                </label>
                                <div className="relative">
                                    <select
                                        className="block w-full bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                        id="user" value={userId} onChange={(e) => setUserId(e.target.value)}>
                                        <option value="">select a user</option>
                                        {users?.map((user) => {
                                            return <option key={user.id}
                                                           value={user.id}>{user.name} - {user.email}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </>)}
                    </div>
                </form>
                <div
                    className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        {(expenses?.length > 0) ? (<>
                            {userId ?
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Expenses</h5> :
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Your
                                    Expenses
                                </h5>}
                        </>) : <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">No
                            Pending
                            Expenses</h5>}
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {(expenses?.length > 0) && expenses.map((expense, index) => {
                                const date = new Date(expense.expense_date)
                                return (<li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <a href={expense.image_url} rel="noreferrer" target="_blank"
                                           className="text-blue-500">Receipt</a>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {expense.category}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {date.toDateString()}
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <span className="font-semibold">₹{expense.amount}</span>
                                            <br/>
                                            {(expense.status === "pending") ? <>
                                                {((currentUser.role === "admin" || currentUser.role === "ca") && userId !== "") ? <>
                                                    <button
                                                        className="text-sm font-medium text-green-600 hover:underline"
                                                        onClick={(e) => handleExpenseApprove(e, expense.id, expense.amount, expense.category)}>Approve
                                                    </button>
                                                    <button className="text-sm font-medium text-red-600 hover:underline"
                                                            onClick={(e) => handleExpenseReject(e, expense.id)}>Reject
                                                    </button>
                                                </> : (<button
                                                    className="text-sm font-medium text-blue-600 hover:underline"
                                                    onClick={(e) => handleExpenseDelete(e, expense.id)}>
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
        </div>
    </>)
}
