import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Popup from "../../components/functional/popup.jsx";
import Registration from "../registration/registration.jsx";
import {Context} from "../../main.jsx";
import UnAuth from "../unauth/unAuth.jsx";
import FavoritesContent from "./favorites-content.jsx";
import Product from "../product/product.jsx";

const Favorites = () => {
    const {user} = useContext(Context);
    const [regIsActive, setRegIsActive] = React.useState(!user.isAuth);
    const [product, setProduct] = useState(-1);
    return (
        <div className="client-wrapper">
            <Header/>
            {user.isAuth ? <FavoritesContent onOpen={key => setProduct(key)}/> : <UnAuth onClick={() => {setRegIsActive(true)}}/>}
            <NavBar page="favorites" />
            <Popup isActive={regIsActive} headerSettings={{border: false}} onClose={() => setRegIsActive(false)}>
                <Registration/>
            </Popup>
            <Popup isActive={product !== -1} onClose={() => setProduct(-1)} zIndex={11}>
                <Product productId={product}/>
            </Popup>
        </div>
    );
};

const Header = () => {
    const header = {
        position: "sticky",
        height: "50px",
        border: "1px solid #E6E6E6",
    }
    const cell = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
        fontFamily: "Montserrat",
        color: "#000",
        transition: "0.2s",
    }

    return (
        <div className="header" style={header}>
            <div style={cell}>
                Избранное
            </div>
        </div>
    )
}

export default Favorites;