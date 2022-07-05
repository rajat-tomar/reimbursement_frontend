import React, {useState} from 'react';

export const CreateExpense = (props) => {
    const [amount, setAmount] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [message, setMessage] = useState({
        success: false, value: ""
    });
    const [showMessage, setShowMessage] = useState(false);

    const valid = (amount) => {
        if (amount === "") {
            return false;
        }
        return true;
    }
    const submit = (e) => {
        e.preventDefault()
        if (!valid(amount)) {
            alert("amount is invalid")
        } else {
            createExpense(amount)
        }
    }

    const createExpense = async (amount) => {
        await fetch(`${props.BASE_URL}/expense`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                amount: Number(amount)
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    setMessage({
                        success: true, value: "successfully created expense"
                    })
                    setExpenses([...amount])
                    console.log(expenses)
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
                <button type="submit">Create Expense</button>
            </form>
        </div>
    </>)
}