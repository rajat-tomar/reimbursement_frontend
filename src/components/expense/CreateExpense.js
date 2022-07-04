import React, {useState} from "react";

const CreateExpense = (props) => {
    const [amount, setAmount] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState({
        success: false, value: ""
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
                .finally(() => {
                    setAmount("");
                })
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

export default CreateExpense;