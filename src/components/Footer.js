import {Link} from "react-router-dom";

export const Footer = () => {
    return (<>
        <footer className="sticky fixed
             inset-x-0
             bottom-0
             mb-0
             text-center bg-gray-900 text-white">
            <div className="container mx-auto px-2 py-2">
                <div className="flex flex-col items-center">
                    <Link to="/" className="text-white">
                        <img className="h-8 w-auto"
                             src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="workflow"/>
                    </Link>
                    <p className="p-4">
                        © 2022 Copyright: GaussB Labs
                    </p>
                </div>
            </div>
        </footer>
    </>)
}
