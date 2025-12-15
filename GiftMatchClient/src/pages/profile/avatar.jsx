import React, {useContext, useState} from 'react';
import {Context} from "../../main.jsx";
import {observer} from "mobx-react-lite";
import {Camera} from "lucide-react";
import {changeAvatar} from "../../http/user-api.js";

const avatar =
{
    width: 150,
    height: 150,
    borderRadius: "50%",
    backgroundSize: "cover",
    position: "relative",
}
const changePlace =
{
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}
const change = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

const Avatar = observer(() => {
    const {user} = useContext(Context)

    const newImage = (image) => {
        changeAvatar({Image: image}).then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data))
            window.location.reload()
        })
    }

    return (
        <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${user.user.avatarUrl ? user.user.avatarUrl : "uploads/avatars/avatar.webp"})`, ...avatar}}>
            <div style={changePlace}>
                <label style={change}>
                    <Camera size={20} color="gray" strokeWidth={3}/>
                    <input type="file" accept="image/png, image/jpeg" style={{display: "none"}} onChange={key => newImage(key.target.files[0])}/>
                </label>
            </div>

        </div>
    );
})

export default Avatar;