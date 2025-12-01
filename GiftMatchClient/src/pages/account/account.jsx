import React from 'react';
import Header from "../../components/client-components/header.jsx";
import NavBar from "../../components/client-components/nav-bar.jsx";

const Account = () => {
    return (
        <div className="client-wrapper">
            <Header text="Профиль" />
            <div>

            </div>
            <NavBar page="profile" />
        </div>
    );
};

export default Account;