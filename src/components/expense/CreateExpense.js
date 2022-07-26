import React, {useEffect, useRef, useState} from 'react';
import {BASE_URL} from "../../constants";

export const CreateExpense = () => {
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [category, setCategory] = useState("")
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

    const uploadImage = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "expenses")
        data.append("cloud_name", "dpdgq7zyk")
        fetch("  https://api.cloudinary.com/v1_1/dpdgq7zyk/image/upload", {
            method: "post", body: data
        })
            .then((response) => response.json())
            .then(data => {
                if (data?.url) {
                    setUrl(data.url)
                } else {
                    alert("error uploading file")
                }
                setLoading(false)
            })
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
                    alert("Expense created successfully")
                    setAmount("")
                    setDate("")
                    setCategory("")
                    setImage(null)
                    setUrl("")
                    inputFileRef.current.value = null
                } else {
                    alert("Oops! Could not create expense. Please try again!")
                }
            })
    }

    useEffect(() => {
        if (url) {
            createExpense()
        }
    }, [url])

    return (<>
        <div className="grid h-screen place-items-center">
            <div className="w-full max-w-lg">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="w-full  px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="amount">
                            Amount
                        </label>
                        <input
                            className="block w-full bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                            id="amount" type="text" value={amount} placeholder="Amount"
                            onChange={(e) => setAmount(e.target.value)}/>
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
                    <div className="w-full px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="date">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                                id="date" type="date" value={date} onChange={(e) => {
                                setDate(e.target.value)
                            }}/>
                        </div>
                    </div>
                    <div className="w-full px-3 mb-6 md:mb-0">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                               htmlFor="file_input">Upload Receipt</label>
                        <input
                            className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 py-3 px-4 mb-3"
                            id="file_input" type="file"
                            onChange={(e) => {
                                setImage(e.target.files[0])
                            }}
                            ref={inputFileRef}
                        />
                    </div>
                    <div className="w-full px-3 py-2 text-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 rounded border border-blue-700 text-white font-bold py-3 px-4"
                            type="submit" onClick={(e) => handleCreateExpense(e)}>
                            {loading ? "Creating..." : "Create Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>)
}