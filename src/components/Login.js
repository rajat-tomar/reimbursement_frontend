import {BASE_URL} from "../constants";

export const Login = () => {
    return (
        <div>
            <form action={BASE_URL+'/login'} method="GET">
                <button type="submit">Login With Google</button>
            </form>
        </div>
    )
}