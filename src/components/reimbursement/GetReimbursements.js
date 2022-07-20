import {BASE_URL} from "../../constants";
import {useEffect, useState} from "react";

export const GetReimbursements = () => {
    const [reimbursements, setReimbursements] = useState([])
    const [total, setTotal] = useState(0)
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")

    const getReimbursements = () => {
        fetch(`${BASE_URL}/reimbursements?userId=${userId}`, {
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
            if (reimbursement.status === "pending") {
                total += reimbursement.amount
            }
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

    useEffect(() => {
        getReimbursements()
    }, [userId])

    useEffect(() => {
        calculateTotal()
    }, [reimbursements])

    useEffect(() => {
        getUsers()
    }, [])

    return (<>
        <div className="flex flex-col items-center">
            {(currentUser.role === "admin" || currentUser.role === "ca") && (<>
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
            </>)}
            <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Pending
                        Reimbursements</h5>
                </div>
                <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reimbursements?.map((reimbursement, index) => {
                            return (reimbursement.status === "pending" && (<li key={index} className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {reimbursement.category}
                                        </p>
                                    </div>
                                    <div
                                        className="items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <span>₹{reimbursement.amount}</span>
                                    </div>
                                </div>
                            </li>))
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
                                    <button
                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500">Process
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </>)
}