import React from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Header from "../../components/client-components/header.jsx";

const Cart = () => {
    return (
        <div className="client-wrapper">
            <Header text="Корзина" />
            cart
            <NavBar page="cart"/>
        </div>
    );
};

export default Cart;