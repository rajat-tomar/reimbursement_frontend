import React, {useState} from 'react';

export const GetExpenses = (props) => {
    const [expenses, setExpenses] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState({
        success: false, value: ""
    });

    const getExpenses = () => {
        fetch(`${props.BASE_URL}/expenses`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    setMessage({
                        success: false, value: "could not get expenses try again"
                    })
                    setShowMessage(true);
                }
            }).then((data) => {
            setExpenses(data.data)
            console.log(expenses)
        }).catch((error) => {
            setMessage({
                success: false, value: error.message
            })
            setShowMessage(true);
        }).finally(() => {
            setExpenses([]);
        }).finally(() => {
            setShowMessage(false);
        }).finally(() => {
            setMessage({
                success: false, value: ""
            })
        })
    }

    return (<>
            {showMessage && (<div>
                <p className={message.success ? 'text-green-400' : 'text-red-400'}>{message.value}</p>
                <button onClick={() => setShowMessage(false)}>X</button>
            </div>)}

            <button onClick={() => getExpenses()}>Get Expenses</button>
            {expenses.length === 0 ? <p>No Expenses</p> :
                expenses.map((expense) => {
                    return (<p key={expense}>{expense.amount}</p>)
                })}
        </>
    )
}
