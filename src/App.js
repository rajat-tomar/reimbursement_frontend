import React from "react";
import {GetExpenses} from "./components/expense/GetExpenses";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import {CreateExpense} from "./components/expense/CreateExpense";
import {Login} from "./components/Login";

function App() {
    return (<>
        <Router>
            <Header/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/create_expense" element={<CreateExpense/>}/>
                <Route path="/expenses" element={<GetExpenses/>}/>
            </Routes>
            <Footer/>
        </Router>
    </>)
}

export default App;


