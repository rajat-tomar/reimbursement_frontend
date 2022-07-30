import React, {useContext, useEffect} from 'react';
import {UserContext} from '../App';
import jwt_decode from 'jwt-decode';
import {BASE_URL} from "../constants";

const Login = () => {
    const {state, dispatch} = useContext(UserContext);

    const handleCallbackResponse = (response) => {
        if (response?.credential) {
            loginUser(response.credential);
        } else {
            window.alert("Failed to sign in user");
        }
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(document.getElementById("signInDiv"), {theme: "outline", size: "large"});
    });

    const loginUser = (userCredential) => {
        const userObject = jwt_decode(userCredential)
        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${userCredential}`
            }
        }
        fetch(`${BASE_URL}/login`, options)
            .then((response) => (response.json()))
            .then((data) => {
                const user = {
                    "name": userObject?.name, "email": userObject?.email, "role": data?.role
                }
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", data?.token);
                dispatch({type: "USER", payload: true})
            })
    }

    return (<div>
        Sign In to continue
        <div id="signInDiv"/>
    </div>);
};

export default Login;
