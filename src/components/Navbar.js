import {Link} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../App";

const Navbar = () => {
    const {state, dispatch} = useContext(UserContext);

    return (<>
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <img className="block lg:hidden h-8 w-auto"
                                 src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="workflow"/>
                            <img className="hidden lg:block h-8 w-auto"
                                 src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="workflow"/>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            {state ? <div className="flex space-x-4">
                                <Link to="logout"
                                      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                                      aria-current="page">Logout</Link>
                                <Link to="create-expense"
                                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                      aria-current="page">CreateExpense</Link>
                                <Link to="/expenses"
                                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Expenses</Link>
                                <Link to="/reimbursements"
                                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Reimbursements</Link>
                            </div> : <div className="flex space-x-4">
                                <Link to="/"
                                      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                                      aria-current="page">Login</Link>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:hidden" id="mobile-menu">
                {state ? <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link to="logout"
                          className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                          aria-current="page">Logout</Link>
                    <Link to="create-expense"
                          className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                          aria-current="page">CreateExpense</Link>
                    <Link to="/expenses"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Expenses</Link>
                    <Link to="/reimbursements"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Reimbursements</Link>
                </div> : <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link to="/"
                          className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                          aria-current="page">Login</Link>
                </div>}
            </div>
        </nav>
    </>)
}

export default Navbar;