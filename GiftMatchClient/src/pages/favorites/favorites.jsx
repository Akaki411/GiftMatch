import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Popup from "../../components/functional/popup.jsx";
import Registration from "../registration/registration.jsx";
import {Context} from "../../main.jsx";
import Unauth from "../unauth/unauth.jsx";
import FavoritesContent from "./favorites-content.jsx";
import WishlistContent from "./wishlist-content.jsx";

const Favorites = () => {
    const {user} = useContext(Context);
    const [page, setPage] = useState("favorites");
    const [regIsActive, setRegIsActive] = React.useState(!user.isAuth);

    const pages = {
        favorites: {
            title: "Избранное",
            page: <FavoritesContent/>
        },
        wishlist: {
            title: "Мои вишлисты",
            page: <WishlistContent/>
        }
    }

    return (
        <div className="client-wrapper">
            <Header pages={pages} page={page} onClick={setPage} />
            {user.isAuth ? pages[page].page : <Unauth onClick={() => {setRegIsActive(true)}}/>}
            <NavBar page="favorites" />
            <Popup isActive={regIsActive} headerSettings={{border: false}} onClose={() => setRegIsActive(false)}>
                <Registration/>
            </Popup>
        </div>
    );
};

const Header = ({
    pages = {},
    page = "favorites",
    onClick = () => {}
}) => {
    const [cursorPosition, setCursorPosition] = React.useState(Object.keys(pages).indexOf(page) === 0 ? "25%" : "75%");

    useEffect(() => {
        setCursorPosition(Object.keys(pages).indexOf(page) === 0 ? "25%" : "75%")
    }, [page]);

    const header = {
        position: "sticky",
        height: "50px",
        border: "1px solid #E6E6E6",
    }
    const cursor = {
        height: "2px",
        width: "6px",
        background: "#000",
        borderRadius: 5,
        position: "absolute",
        top: "75%",
        left: cursorPosition,
        transition: "0.2s",
    }

    return (
        <div className="header" style={header}>
            {Object.keys(pages).map(key => (
                <HeaderBlock key={key} page={key} title={pages[key].title} onClick={onClick} isActive={key === page} />
            ))}
            <div style={cursor}/>
        </div>
    )
}

const HeaderBlock = ({
    page = "favorites",
    title = "Избранное",
    isActive = false,
    onClick = () => {}
}) => {
    const cell = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
        fontFamily: "Montserrat",
        color: isActive ? "#000" : "#AAAFB2",
        transition: "0.2s",
    }
    return (
        <div style={cell} onClick={() => {onClick(page)}}>
            {title}
        </div>
    )
}

export default Favorites;