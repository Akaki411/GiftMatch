import React from 'react';
import {TextAlignStart} from "lucide-react"

const AdminHeader = ({
    children,
    text = "Список",
    logo = <TextAlignStart size={16} color="#333E4C" />
}) => {
    const head = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "#ECF0F1",
        border: "1px solid #AAAFB2",
        width: "95%",
        minHeight: "50px",
        padding: "0 20px",
        boxShadow: "0 2px 4px #D7D7D7",
        marginTop: "30px",
    }
    const content_block = {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        columnGap: "15px",
    }
    const font = {
        color: "#2B3C4C"
    }

    return (
        <div style={head}>
            <div style={content_block}>
                {logo}
                <div style={font}>{text}</div>
            </div>
            <div style={content_block}>
                {children}
            </div>
        </div>
    );
};

export default AdminHeader;