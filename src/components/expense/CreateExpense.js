import React, {useState} from 'react';
import { BASE_URL} from "../../constants";

export const CreateExpense = () => {
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [category, setCategory] = useState("")
    const [message, setMessage] = useState({
        success: false, value: ""
    });
    const [showMessage, setShowMessage] = useState(false);

    const empty = (value) => {
        return value === "";

    }
    const submit = (e) => {
        e.preventDefault()
        if (empty(amount)) {
            alert("please enter a valid amount")
        } else if (empty(date)) {
            alert("please select a valid date")
        } else if (empty(category)) {
            alert("please select a valid category")
        } else {
            createExpense(amount)
            setAmount("")
            setDate("")
        }
    }

    const createExpense = async (amount) => {
        await fetch(`${BASE_URL}/expense`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                amount: Number(amount), expense_date: date, category: category
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    setMessage({
                        success: true, value: "successfully created expense"
                    })
                    setShowMessage(true);
                } else {
                    setMessage({
                        success: false, value: "could not create expense try again"
                    })
                    setShowMessage(true);
                }
            })
            .catch((error) => {
                setMessage({
                    success: false, value: error.message
                })
                setShowMessage(true);
            })
    }

    return (<>
        {showMessage && (<div>
            <p className={message?.success ? 'text-green-400' : 'text-red-400'}>{message.value}</p>
            <button onClick={() => setShowMessage(false)}>X</button>
        </div>)}
        <div className="grid h-screen place-items-center">
            <form className="w-full max-w-lg" onSubmit={submit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="amount">
                            Amount
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="amount" type="text" value={amount} placeholder="Amount"
                            onChange={(e) => setAmount(e.target.value)}/>
                        <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="category">
                        Category
                    </label>
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">--select an option--</option>
                            <option>Broadband</option>
                            <option>Mobile Phone</option>
                            <option>Learning and Development</option>
                            <option>Fuel/Travel Allowance</option>
                            <option>Tech Conferences</option>
                            <option>Conference related travel and accommodations</option>
                        </select>
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="date">
                        Date
                    </label>
                    <div className="relative">
                        <input
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="date" type="date" value={date} onChange={(e) => {
                            setDate(e.target.value)
                        }}/>
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <button type="submit">Create Expense</button>
            </form>
        </div>
    </>)
}