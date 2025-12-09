import React, {useContext} from 'react';
import Ident from "../../components/client-components/ident.jsx";
import Avatar from "./avatar.jsx";
import TextBlock from "../../components/client-components/text-block.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";
import GrayButton from "../../components/client-components/gray-button.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import {useNavigate} from "react-router-dom";
import {AUTH_ROUTE, LOGOUT_ROUTE, ADMIN_ROUTE} from "../../utils/consts.js";

const ProfileContent = observer(({
     onClick = () => {}
}) => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const formatDate = (date) =>
    {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    const logout = () => {
        navigate(AUTH_ROUTE + LOGOUT_ROUTE)
    }

    const admin = () => {
        navigate(ADMIN_ROUTE)
    }

    const toAdmin = {
        width: "100%",
        position: "absolute",
        bottom: 75,
    }

    return (
        <div className="client-wrapper">
            <div className="client-content">
                <Ident size={60}/>
                <Avatar/>
                <Ident size={20}/>
                <TextBlock size={24} style={{fontWeight: "bold"}}>{user.user.firstName} {user.user.lastName}</TextBlock>
                <Ident size={30}/>
                <ProfileCell title="Имя:" value={user.user.firstName}/>
                <ProfileCell title="Фамилия:" value={user.user.lastName}/>
                <ProfileCell title="Email:" value={user.user.email}/>
                <ProfileCell title="Регистрация:" value={formatDate(new Date(user.user.createdAt))}/>
                <Ident size={30}/>
                <GrayButton text="Изменить" onClick={onClick}/>
                <Ident/>
                <GrayButton text="Выйти" onClick={logout}/>
                {["ADMIN", "MODER", "SUPPORT"].includes(user.role) && <div style={toAdmin}>
                    <BlackButton text="GiftMatch ADMIN" onClick={admin}/>
                </div>}
            </div>
        </div>
    )
})

const ProfileCell = ({
    title = "",
    value = ""
}) => {
    const cell = {
        height: "40px",
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
    }
    const key = {
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        textAlign: "left",
    }

    return (
        <div style={cell} className="text-block">
            <div style={{flex: 2, color: "#787878", ...key}}>{title}</div>
            <div style={{flex: 3, width: "100%", ...key}}>{value}</div>
        </div>
    )
}

export default ProfileContent;