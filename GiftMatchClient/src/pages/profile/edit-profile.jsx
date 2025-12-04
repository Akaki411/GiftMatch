import React from 'react';
import Ident from "../../components/client-components/ident.jsx";
import ClientInput from "../../components/client-components/client-input.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";

const EditProfile = () => {
    const saveButtton = {
        width : "90%",
        position : "fixed",
        bottom : "15%",
    }

    return (
        <div className="client-content">
            <Ident size={30}/>
            <ClientInput placeholder="Имя"/>
            <ClientInput placeholder="Фамилия"/>
            <ClientInput placeholder="email"/>
            <ClientInput placeholder="Новый пароль" type="password"/>
            <ClientInput placeholder="Повтор пароля" type="password"/>
            <div style={saveButtton}>
                <BlackButton text='Продолжить'/>
            </div>

        </div>
    );
};

export default EditProfile;