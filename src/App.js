import {createContext, useReducer} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar';
import {initialState, reducer} from './reducer/UseReducer';
import Login from './components/Login';
import Logout from './components/Logout';
import {CreateExpense} from "./components/expense/CreateExpense";
import {GetExpenses} from "./components/expense/GetExpenses";
import {GetReimbursements} from "./components/reimbursement/GetReimbursements";

export const UserContext = createContext(undefined);

const Routing = ({state}) => {
    if (state) {
        return (<Routes>
            <Route path="/" element={<Navigate to="/expenses" replace/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/create-expense" element={<CreateExpense/>}/>
            <Route path="/expenses" element={<GetExpenses/>}/>
            <Route path="/reimbursements" element={<GetReimbursements/>}/>
        </Routes>);
    } else {
        return (<Routes>
            <Route path="/" element={<Login/>}/>
        </Routes>);
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (<>
        <UserContext.Provider value={{state, dispatch}}>
            <Router>
                <Navbar/>
                <Routing state={state}/>
            </Router>
        </UserContext.Provider>
    </>);
}

export default App;


