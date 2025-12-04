import React from 'react';

const Header = ({
    title = "Header",
}) => {
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
                {title}
            </div>
        </div>
    )
}

export default Header;