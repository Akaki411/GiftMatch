import React from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Popup from "../../components/functional/popup.jsx";
import Registration from "../registration/registration.jsx";

const Home = () => {

    return (
        <div className="client-wrapper">

            <div onClick={() => {setRegIsActive(!regIsActive)}}>home</div>
            <NavBar/>
        </div>
    );
};

export default Home;