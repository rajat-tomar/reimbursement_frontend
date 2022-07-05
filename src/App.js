import React from "react";
import {GetExpenses} from "./components/expense/GetExpenses";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import {CreateExpense} from "./components/expense/CreateExpense";

const BASE_URL = process.env.REACT_APP_BASE_URL

function App() {
    return (<>
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={
                    <>

                    </>
                }/>
                <Route path="/create_expense" element={<CreateExpense BASE_URL={BASE_URL}/>}/>
                <Route path="/expenses" element={<GetExpenses BASE_URL={BASE_URL}/>}/>
            </Routes>
            <Footer/>
        </Router>
    </>)
}

export default App;


