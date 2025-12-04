import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE} from "../../utils/consts";
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";
import {ClimbingBoxLoader} from "react-spinners";

const Logout = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem("token")
        user.setUser({})
        user.setIsAuth(false)
        user.setIsAdmin(false)
        navigate(HOME_ROUTE)
    }, [])

    return (
        <div className="client-wrapper" style={{justifyContent: "center", fontSize: 24}}>
            <ClimbingBoxLoader size={20} color="black"/>
            Пожалуйста подождите...
        </div>
    );
})

export default Logout;