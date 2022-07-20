import {BASE_URL} from "../../constants";
import {useEffect, useState} from "react";

export const GetReimbursements = () => {
    const [reimbursements, setReimbursements] = useState([])
    const [total, setTotal] = useState(0)

    const getReimbursements = () => {
        fetch(`${BASE_URL}/reimbursements`, {
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
    
    useEffect(() => {
        getReimbursements()
    }, [])

    useEffect(() => {
        calculateTotal()
    }, [reimbursements])

    return (<>
        <div className="flex flex-col items-center">
            <button type="submit">Submit</button>
            <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Pending
                        Reimbursements</h5>
                </div>
                <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reimbursements && reimbursements.map((reimbursement, index) => {
                            return (<>
                                {(reimbursement.status === "pending") && <li key={index} className="py-3 sm:py-4">
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
                                </li>}
                            </>)
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