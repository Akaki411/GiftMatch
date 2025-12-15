import React, {useContext, useState} from 'react';
import Ident from "../../components/client-components/ident.jsx";
import ClientInput from "../../components/client-components/client-input.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import {Context} from "../../main.jsx";
import Line from "../../components/client-components/line.jsx";
import {editUser} from "../../http/user-api.js";

const saveButton = {
    width : "90%",
    position : "fixed",
    bottom : "15%",
}

const EditProfile = () =>
{
    const {user} = useContext(Context);
    const [firstName, setFirstName] = useState(user.user.firstName)
    const [lastName, setLastName] = useState(user.user.lastName)
    const [email, setEmail] = useState(user.user.email)
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")

    const submit = () =>
    {
        if(password === "")
        {
            alert("Для изменения данных польззователя необходимо ввести пароль")
            return
        }
        if((newPassword.length < 6 && newPassword.length > 0) || newPassword !== retypePassword)
        {
            alert("Новый пароль не совпадает или меньше 6 символов")
            return
        }
        editUser({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
            NewPassword: newPassword,
        }).then(response => {
            localStorage.setItem("user", JSON.stringify(response.data))
            window.location.reload()
        }).catch((e) => {
            alert(`Произошла ошибка!\n\n${e.message}`)
        })
    }

    return (
        <div className="client-content">
            <Ident size={30}/>
            <ClientInput placeholder="Имя" value={user.user.firstName} onChange={setFirstName} />
            <ClientInput placeholder="Фамилия" value={user.user.lastName} onChange={setLastName} />
            <ClientInput placeholder="email" value={user.user.email} onChange={setEmail} />
            <ClientInput placeholder="Новый пароль" type="password" onChange={setNewPassword} />
            <ClientInput placeholder="Повтор пароля" type="password" onChange={setRetypePassword} />
            <Line top={30} bottom={20}/>
            <ClientInput placeholder="Старый пароль" type="password" onChange={setPassword}/>
            <div style={saveButton}>
                <BlackButton text='Продолжить' isActive={password !== ""} onClick={submit}/>
            </div>

        </div>
    );
};

export default EditProfile;