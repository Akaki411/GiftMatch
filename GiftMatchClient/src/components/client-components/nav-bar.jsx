import React from 'react';
import HomeIcon from "../../resources/svg/home-icon.jsx";
import HearIcon from "../../resources/svg/heart-icon.jsx";
import CartIcon from "../../resources/svg/cart-icon.jsx";
import UserIcon from "../../resources/svg/user-icon.jsx";
import {CART_ROUTE, FAVORITES_ROUTE, HOME_ROUTE, PROFILE_ROUTE} from "../../utils/consts.js";

const NavBar = ({
    page = "home"
}) => {

    const buttons = {
        home: {
            icon: HomeIcon,
            link: HOME_ROUTE,
        },
        favorites: {
            icon: HearIcon,
            link: FAVORITES_ROUTE
        },
        cart: {
            icon: CartIcon,
            link: CART_ROUTE,
        },
        profile: {
            icon: UserIcon,
            link: PROFILE_ROUTE
        }
    }


    return (
        <div className="nav-bar">
            {Object.keys(buttons).map((key) => {
                return <LinkBlock key={key} button={buttons[key]} isActive={page === key}/>
            })}
        </div>
    );
};

const LinkBlock = ({
    button,
    isActive = false
}) => {
    return (
        <a href={window.location.origin + button.link} className="nav-link">
            <button.icon color={isActive ? "#F00E3A" : "#000000"} size={32} />
        </a>
    );
};

export default NavBar;