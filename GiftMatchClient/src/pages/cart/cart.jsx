import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Header from "../../components/client-components/header.jsx";
import {Context} from "../../main.jsx";
import Registration from "../registration/registration.jsx";
import Popup from "../../components/functional/popup.jsx";
import UnAuth from "../unauth/unAuth.jsx";
import Product from "../product/product.jsx";
import CartItems from "./cart-items.jsx";
import {checkout, getAllCartItems} from "../../http/cart-api.js";
import Ident from "../../components/client-components/ident.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE} from "../../utils/consts.js";

const Cart = () => {
    const {user} = useContext(Context);
    const [product, setProduct] = useState(-1);
    const [regIsActive, setRegIsActive] = useState(!user.isAuth);

    return (
        <div className="client-wrapper">
            <Header title="Корзина" />
            {user.isAuth ? <CartContent onOpen={key => setProduct(key)}/> : <UnAuth onClick={() => {setRegIsActive(true)}} />}
            <NavBar page="cart"/>
            <Popup isActive={regIsActive} headerSettings={{border: false}} onClose={() => setRegIsActive(false)}>
                <Registration/>
            </Popup>
            <Popup isActive={product !== -1} onClose={() => setProduct(-1)} zIndex={11}>
                <Product productId={product}/>
            </Popup>
        </div>
    );
};

const text = {
    fontFamily: "Montserrat",
    fontSize: "16px",
}
const CartContent = ({
    onOpen = () => {}
}) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([])
    const [amount, setAmount] = useState(0)

    const [adress, setAdress] = useState("")
    const [phone, setPhone] = useState("")
    const [note, setNote] = useState("")

    const createOrder = () => {
        if(adress === "" && phone === "")
        {
            alert("Заполните адрес и телефон")
            return
        }
        checkout({
            deliveryAddress: adress,
            phone: phone,
            notes: note,
        }).then(() => {
            window.location.reload()
        })
    }

    useEffect(() => {
        getAllCartItems().then((response) => {
            setCartItems(response.data.items)
            setAmount(response.data.totalAmount)
        })
    }, [])

    if(cartItems.length === 0)
    {
        return (
            <div className="client-wrapper">
                <div className="client-content" style={{rowGap:'30px'}}>
                    <Ident size={150}/>
                    Товары не добавлены
                    <BlackButton text="К покупкам!" onClick={() => {navigate(HOME_ROUTE)}}/>
                </div>
            </div>
        )
    }

    return (
        <div className="client-wrapper invisible-scrolling" style={{overflowY: 'scroll'}}>
            <CartInfoLine text="Адрес">
                <WhiteInput placeholder="Введите адрес" onChange={setAdress}/>
            </CartInfoLine>
            <CartInfoLine text="Телефон">
                <WhiteInput placeholder="Введите номер телефона" onChange={setPhone} type="number"/>
            </CartInfoLine>
            <CartInfoLine text="Заметка">
                <WhiteInput placeholder="Заметка к заказу" onChange={setNote}/>
            </CartInfoLine>
            <CartInfoLine text="Доставка">
                Бесплатная 3 - 4 дня
            </CartInfoLine>
            <CartInfoLine text="Оплата">
                Мир ***1234
            </CartInfoLine>
            <CartItems items={cartItems} onOpen={onOpen} />
            <Ident size={10}/>
            <div style={{width:'90%', display: 'flex', justifyContent:'space-between'}}>
                <div style={text}>Стоимость товаров</div>
                <div style={text}>{amount}</div>
            </div>
            <Ident size={10}/>
            <div style={{width:'90%', display: 'flex', justifyContent:'space-between'}}>
                <div style={text}>Доставка</div>
                <div style={text}>Бесплатно</div>
            </div>
            <Ident size={10}/>
            <div style={{width:'90%', display: 'flex', justifyContent:'space-between'}}>
                <div style={{fontWeight: "bold", ...text}}>Итог</div>
                <div style={{fontWeight: "bold", ...text}}>{amount}</div>
            </div>
            <Ident size={40}/>
            <div className="client-content">
                <BlackButton text="Оформить заказ" isActive={adress !== "" && phone !== ""} onClick={createOrder} />
            </div>
            <Ident size={100}/>
        </div>
    )
}

const line = {
    width: "100%",
    minHeight: 50,
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
    justifyContent: "center"
}
const content = {
    width: "90%",
    height: "100%",
    display: "flex",
    alignItems: "center",
}
const font = {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: "bold",
}
const child = {
    flex: 2,
    fontFamily: "Montserrat",
    fontSize: 14,
}
const CartInfoLine = ({
    text = "Название",
    children,
}) => {
    return (
        <div style={line}>
            <div style={content}>
                <div style={font}>
                    {text}
                </div>
                <div style={child}>
                    {children}
                </div>
            </div>
        </div>
    )
}

const whiteInput = {
    width: "100%",
    height: "100%",
    border: "none",
    fontFamily: "Montserrat",
    fontSize: 14
}
const WhiteInput = ({
    onChange = () => {},
    placeholder = "Введите...",
    type = "text",
}) => {
    return (
        <input type={type} style={whiteInput} onChange={key => onChange(key.target.value)} placeholder={placeholder} />
    )
}


export default Cart;