import React from 'react';
import Header from "../../components/client-components/header.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import GrayButton from "../../components/client-components/gray-button.jsx";
import GoogleIcon from "../../resources/vector_icons/google-icon.jsx";
import AppleIcon from "../../resources/vector_icons/apple-icon.jsx";
import ClientInput from "../../components/client-components/client-input.jsx";
import GiftmatchLogo from "../../components/client-components/giftmatch-logo.jsx";
import Line from "../../components/client-components/line.jsx";
import TextBlock from "../../components/client-components/text-block.jsx";
import Ident from "../../components/client-components/ident.jsx";




const Registration = () =>
{
    return (
        <div className="client-wrapper">
            <Header border={false}/>
            <div className="client-content">
                <GiftmatchLogo/>
                <TextBlock size={22}><b>Введите email</b></TextBlock>
                <TextBlock size={14}>Введите email для входа или регистрации</TextBlock>
                <Ident/>
                <ClientInput placeholder="email"/>
                <Ident/>
                <BlackButton text='Продолжить'></BlackButton>
                <Line text="или" bottom={40} top={40}/>
                <GrayButton text='Продолжить с Google'><GoogleIcon/></GrayButton>
                <Ident/>
                <GrayButton text='Продолжить с Apple'><AppleIcon size={28}/></GrayButton>
                <Ident size={25}/>
                <TextBlock size={12}>Нажимая продолжить вы соглашаетесь с <span className="gray">Условиями Использования</span> и <span className="gray">Политикой Конфиденциальности</span></TextBlock>
            </div>
        </div>
    );
};

export default Registration;