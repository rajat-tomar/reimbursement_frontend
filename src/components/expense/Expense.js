import React, {useState} from "react";

const Expense = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [amount, setAmount] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState({
        success: "", value: ""
    });

    const handleAmountChange = (e) => {
        setAmount(e?.target?.value);
    }

    const valid = (amount) => {
        if (amount === "") {
            setMessage({
                success: false, value: "amount is invalid"
            })
            setShowMessage(true);
            return false;
        }
        return true;
    }

    const createExpense = async (amount) => {
        if (valid(amount)) {
            await fetch(`${BASE_URL}/expense`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    amount: Number(amount)
                })
            })
                .then(response => console.log("response", response))
        }
    }

    return (<>
        {showMessage && (<div>
            <p className={message?.success ? 'text-green-400' : 'text-red-400'}>{message.value}</p>
            <button onClick={() => setShowMessage(false)}>X</button>
        </div>)}

        <input type="text" name="amount" placeholder="Amount" value={amount} onChange={handleAmountChange}/>
        <button onClick={() => createExpense(amount)}>Create Expense</button>
    </>)
}

export default Expense;