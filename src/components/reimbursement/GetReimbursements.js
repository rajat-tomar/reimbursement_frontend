import {BASE_URL} from "../../constants";
import {useEffect, useState} from "react";

export const GetReimbursements = () => {
    const [reimbursements, setReimbursements] = useState([])
    const [total, setTotal] = useState(0)
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")
    const [dateRange, setDateRange] = useState({
        startDate: "", endDate: ""
    })

    const handleDate = (e) => {
        const value = e.target.value
        setDateRange({...dateRange, [e.target.name]: value})
    }

    const getReimbursements = () => {
        fetch(`${BASE_URL}/reimbursements?userId=${userId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
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
            setReimbursements(data)
        })
    }

    const calculateTotal = () => {
        let total = 0
        reimbursements?.forEach(reimbursement => {
            total += reimbursement.amount
        })
        setTotal(total)
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

    const handleGoToPending = () => {
        setDateRange({startDate: "", endDate: ""})
    }

    const handleProcess = () => {
        fetch(`${BASE_URL}/reimbursements/process`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }, body: JSON.stringify({
                status: "approved", user_id: Number(userId)
            })
        }).then((response) => {
            if (response.status === 204) {
                setReimbursements([])
                alert("Reimbursement processed successfully")
            }
        })
    }

    useEffect(() => {
        getReimbursements()
    }, [userId, dateRange])

    useEffect(() => {
        calculateTotal()
    }, [reimbursements])

    useEffect(() => {
        getUsers()
    }, [])

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
                                    value={dateRange?.startDate}
                                    onChange={handleDate}/>
                            </div>
                            <div className="w-1/2 date-range-picker__input">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                       htmlFor="end-date">End Date</label>
                                <input
                                    className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                    type="date" id="end-date" name="endDate"
                                    value={dateRange?.endDate}
                                    onChange={handleDate}/>
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
                        {(dateRange.startDate === "" || dateRange.endDate === "") ? (<>
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Pending
                                Reimbursements</h5>
                        </>) : (<>
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Processed
                                Reimbursements</h5>
                            <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                                    onClick={() => handleGoToPending()}>
                                Go to pending
                            </button>
                        </>)}
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reimbursements?.map((reimbursement, index) => {
                                const date = new Date(reimbursement.processed_on)
                                return (<li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {reimbursement.category}
                                            </p>
                                            {reimbursement.status === "approved" && (<>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {date.toDateString()}
                                                </p>
                                            </>)}
                                        </div>
                                        <div
                                            className="items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <span>₹{reimbursement.amount}</span>
                                        </div>
                                    </div>
                                </li>)
                            })}
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xl font-bold leading-none text-gray-900 dark:text-white">Total</p>
                                    </div>
                                    <div
                                        className="items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <span>₹{total}</span>
                                        <br/>
                                        {((currentUser.role === "admin" || currentUser.role === "ca") && (dateRange.startDate === "" && dateRange.endDate === "") && (total > 0) && (userId)) && (
                                            <button
                                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                onClick={() => handleProcess()}> Process
                                            </button>)}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>)
}