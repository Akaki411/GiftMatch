import React from 'react';
import {Gift} from "lucide-react";

const GiftMatchLogo = () =>
{
    const box = {
        width: "100%",
        height: "200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "32px",
        fontFamily: "Montserrat",
        fontWeight: "bold",
    }


    return (
        <div style={box}>
            Gift
            <Gift size={40} color="#000000"/>
            atch
        </div>
    );
};

export default GiftMatchLogo;