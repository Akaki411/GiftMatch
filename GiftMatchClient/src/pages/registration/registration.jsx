import React, {useState} from 'react';
import BlackButton from "../../components/client-components/black-button.jsx";
import GrayButton from "../../components/client-components/gray-button.jsx";
import GoogleIcon from "../../resources/svg/google-icon.jsx";
import AppleIcon from "../../resources/svg/apple-icon.jsx";
import ClientInput from "../../components/client-components/client-input.jsx";
import GiftMatchLogo from "../../components/client-components/gift-match-logo.jsx";
import Line from "../../components/client-components/line.jsx";
import TextBlock from "../../components/client-components/text-block.jsx";
import Ident from "../../components/client-components/ident.jsx";
import {checkEmail, login, registration} from "../../http/auth-api.js";

const form = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
}

const Registration = () =>
{
    const [state, setState] = useState("email");
    const [email, setEmail] = useState("");

    const states = {
        email: <EmailForm onSubmit={key => setState(key ? "login" : "registration")} onChange={setEmail}/>,
        login: <LoginForm email={email}/>,
        registration: <RegForm email={email}/>
    }

    return (
        <div className="client-wrapper">
            <div className="client-content">
                <GiftMatchLogo/>
                {states[state]}
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

const EmailForm = ({
    onSubmit = () => {},
    onChange = () => {},
}) => {
    const [email, setEmail] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);

    const check_email = () => {
        if(email === "" || isWaiting) return
        if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        {
            alert("Не верный формат электронной почты")
            return
        }
        setIsWaiting(true)
        checkEmail({email}).then(response => {
            if(response.data.isRegister)
            {
                onSubmit(true)
            }
            else
            {
                onSubmit(false)
            }
        }).catch((e) => {
            alert(`Произошла ошибка:\n${e.message}`);
            setIsWaiting(false)
        })
    }


    return (
        <div style={form}>
            <TextBlock size={22}><b>Введите email</b></TextBlock>
            <TextBlock size={14}>Введите email для входа или регистрации</TextBlock>
            <Ident size={20}/>
            <ClientInput placeholder="email" onChange={ key => {
                setEmail(key)
                onChange(key)
            }} type="email"/>
            <Ident/>
            <BlackButton text='Продолжить' isActive={email !== ""} onClick={check_email} isLoading={isWaiting}/>
        </div>
    )
}

const LoginForm = ({email}) => {

    const [password, setPassword] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);

    const auth = () => {
        if(password === "" || isWaiting) return
        setIsWaiting(true)
        login({
            Email: email,
            Password: password
        }).then(response => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setIsWaiting(false)
            window.location.reload()
        }).catch((e) => {
            alert(`Произошла ошибка:\n${e.message}`);
            setIsWaiting(false)
        })
    }

    return (
        <div style={form}>
            <TextBlock size={22}><b>Введите пароль</b></TextBlock>
            <TextBlock size={14}>Введите пароль для входа в аккаунт</TextBlock>
            <Ident size={20}/>
            <ClientInput placeholder="Пароль" onChange={setPassword} type="password"/>
            <Ident/>
            <BlackButton text='Войти' isActive={password !== ""} onClick={auth} isLoading={isWaiting}/>
        </div>
    )
}

const RegForm = ({email}) => {
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [password, setPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")
    const [isWaiting, setIsWaiting] = useState(false)

    const reg = () =>
    {
        if(lastName === "" || firstName === "" || password === "" || retypePassword === "" || isWaiting) return
        if(password.length < 6)
        {
            alert("Пароль слишком короткий!\nВведите пароль длинной 6 или более символов")
            return
        }
        if(password !== retypePassword)
        {
            alert("Пароли не совпадают")
            return
        }

        setIsWaiting(true)
        registration({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
        }).then((response) => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setIsWaiting(false)
            window.location.reload()
        }).catch((e) => {
            alert(`Произошла ошибка:\n${e.message}`);
            setIsWaiting(false)
        })
    }

    return (
        <div style={form}>
            <TextBlock size={22}><b>Регистрация</b></TextBlock>
            <TextBlock size={14}>Введите информацию о себе</TextBlock>
            <Ident size={20}/>
            <ClientInput placeholder="Имя" onChange={setFirstName} type="text"/>
            <ClientInput placeholder="Фамилия" onChange={setLastName} type="text"/>
            <ClientInput placeholder="Пароль" onChange={setPassword} type="password"/>
            <ClientInput placeholder="Повторите пароль" onChange={setRetypePassword} type="password"/>
            <Ident/>
            <BlackButton text='Регистрация' onClick={reg} isActive={lastName !== "" && firstName !== "" && password !== "" && retypePassword !== ""} isLoading={isWaiting}/>
        </div>
    )
}

export default Registration;