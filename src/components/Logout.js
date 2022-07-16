import React, {useContext, useEffect} from 'react';
import {UserContext} from '../App';
import {useNavigate} from 'react-router-dom';

const Logout = () => {
    const {state, dispatch} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (state) {
            dispatch({type: "USER", payload: false});
            localStorage.clear()
            navigate("/");
        }
    });

    return (<div>

    </div>);
};

export default Logout;