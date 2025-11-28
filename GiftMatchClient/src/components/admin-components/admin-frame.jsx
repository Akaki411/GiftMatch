import React from 'react';
import {Plus} from 'lucide-react';

const AdminFrame = ({
    title = "Заголовок",
    logo = <Plus/>,
    children
}) =>
{
    const block = {
        width: "100%",
        border: "1px solid #AAAFB2",
        margin: "30px 0",
        height: "auto",
        boxSizing: "border-box",
        boxShadow: "0 2px 4px #D7D7D7"
    }
    const head = {
        width: "100%",
        height: "50px",
        borderBottom: "1px solid #AAAFB2",
        backgroundColor: "#ECF0F1",
        display: "flex",
        alignItems: "center",
        columnGap: "10px",
        boxSizing: "border-box",
        padding: "0 20px",
    }

    return (
        <div style={block}>
            <div style={head}>
                {logo}
                <div style={{ color: "#2B3C4C" }}>{title}</div>
            </div>
            <div className="blockContent">
                {children}
            </div>
        </div>
    );
};

export default AdminFrame;