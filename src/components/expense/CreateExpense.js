import React, {useEffect, useRef, useState} from 'react';
import {BASE_URL} from "../../constants";

export const CreateExpense = () => {
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [category, setCategory] = useState("")
    const [message, setMessage] = useState({
        success: false, value: ""
    });
    const [showMessage, setShowMessage] = useState(false);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const inputFileRef = useRef(null);
    const empty = (value) => {
        return value === "";
    }
    const [loading, setLoading] = useState(false);

    const isValid = () => {
        if (empty(amount)) {
            alert("please enter a valid amount")
            return false;
        } else if (empty(date)) {
            alert("please select a valid date")
            return false;
        } else if (empty(category)) {
            alert("please select a valid category")
            return false;
        }

        return true;
    }

    useEffect(() => {
        if (url) {
            createExpense()
        }
    }, [url])

    const uploadImage = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "expenses")
        data.append("cloud_name", "dpdgq7zyk")
        fetch("  https://api.cloudinary.com/v1_1/dpdgq7zyk/image/upload", {
            method: "post", body: data
        })
            .then(resp => resp.json())
            .then(data => {
                setUrl(data.url)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }

    const handleCreateExpense = (e) => {
        e.preventDefault()
        if (isValid()) {
            setLoading(true)
            uploadImage()
        }
    }

    const createExpense = () => {
        fetch(`${BASE_URL}/expense`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("id_token")}`
            }, body: JSON.stringify({
                amount: Number(amount), expense_date: date, category: category, image_url: url
            })
        })
            .then((response) => {
                if (response.status === 201) {
                    setMessage({
                        success: true, value: "successfully created expense"
                    })
                    setAmount("")
                    setDate("")
                    setCategory("")
                    setImage(null)
                    setUrl("")
                    setShowMessage(true)
                    inputFileRef.current.value = null
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
                <form className="w-full max-w-lg">
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
                                <option>Fuel/Travel Allowance</option>
                                <option>Learning and Development</option>
                                <option>Mobile Phone</option>
                                <option>Broadband</option>
                                <option>Project</option>
                                <option>Tech Conferences</option>
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
                    <div>
                        <input
                            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="file_input" type="file"
                            onChange={(e) => {
                                setImage(e.target.files[0])
                            }}
                            ref={inputFileRef}
                        />
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                        type="submit" onClick={(e) => handleCreateExpense(e)}>
                        {loading ? "Loading..." : "Create Expense"}
                    </button>
                </form>
            </div>
    </>)
}