import React from 'react';

const Line = ({
    top = 10,
    bottom = 10,
    text = ""
}) =>
{
    const line = {
        width: "100%",
        height: "1px",
        backgroundColor: "#E6E6E6",
        margin: `${top}px 0 ${bottom}px 0`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
    const font = {
        color: "#AAAFB2",
        fontSize: "16px",
        backgroundColor: "white",
        padding: "0 10px",
    }
    return (
        <div style={line}>
            <div style={font}>{text}</div>
        </div>
    );
};

export default Line;