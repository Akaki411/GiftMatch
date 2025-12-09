import React, {useContext, useState} from 'react';
import Ident from "../../components/client-components/ident.jsx";
import ClientInput from "../../components/client-components/client-input.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import {Context} from "../../main.jsx";

const EditProfile = () =>
{
    const {user} = useContext(Context);
    const [firstName, setFirstName] = useState(user.user.firstName)
    const [lastName, setLastName] = useState(user.user.lastName)
    const [email, setEmail] = useState(user.user.email)
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")

    const saveButtton = {
        width : "90%",
        position : "fixed",
        bottom : "15%",
    }
    return (
        <div className="client-content">
            <Ident size={30}/>
            <ClientInput placeholder="Имя" value={user.user.firstName} onChange={setFirstName} />
            <ClientInput placeholder="Фамилия" value={user.user.lastName} onChange={setLastName} />
            <ClientInput placeholder="email" value={user.user.email} onChange={setEmail} />
            <ClientInput placeholder="Новый пароль" type="password" onChange={setNewPassword} />
            <ClientInput placeholder="Повтор пароля" type="password" onChange={setRetypePassword} />
            <Ident size={30}/>
            <ClientInput placeholder="Старый пароль" type="password" onChange={setPassword}/>
            <div style={saveButtton}>
                <BlackButton text='Продолжить'/>
            </div>

        </div>
    );
};

export default EditProfile;