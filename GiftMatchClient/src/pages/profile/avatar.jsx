import React, {useContext} from 'react';
import {Context} from "../../main.jsx";
import {observer} from "mobx-react-lite";

const avatar =
{
    width: 150,
    height: 150,
    borderRadius: "50%",
    backgroundSize: "cover"
}

const Avatar = observer(() => {
    const {user} = useContext(Context)

    return (
        <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/uploads/avatars/${user.avatar ? user.avatar : "avatar.webp"})`, ...avatar}}>

        </div>
    );
})

export default Avatar;