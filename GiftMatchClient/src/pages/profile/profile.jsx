import React, {useContext} from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import Header from "../../components/client-components/header.jsx";
import Registration from "../registration/registration.jsx";
import Popup from "../../components/functional/popup.jsx";
import {Context} from "../../main.jsx";
import Unauth from "../unauth/unauth.jsx";
import ProfileContent from "./profile-content.jsx";
import EditProfile from "./edit-profile.jsx";

const Profile = () =>
{
    const {user} = useContext(Context);
    const [regIsActive, setRegIsActive] = React.useState(!user.isAuth)
    const [editIsActive, setEditIsActive] = React.useState(false)
    return (
        <div className="client-wrapper">
            <Header title="Аккаунт"/>
            {user.isAuth ? <ProfileContent onClick={() => {setEditIsActive(true)}}/> : <Unauth onClick={() => {setRegIsActive(true)}} />}
            <NavBar page="profile" />
            <Popup isActive={regIsActive} headerSettings={{border: false}} onClose={() => setRegIsActive(false)}>
                <Registration/>
            </Popup>
            <Popup isActive={editIsActive} zIndex={5} onClose={() => setEditIsActive(false)}>
                <EditProfile/>
            </Popup>
        </div>
    );
};

export default Profile;