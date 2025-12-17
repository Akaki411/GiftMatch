import React from 'react';
import {Search} from "lucide-react"

const AdminSearchPlace = ({
    onSearch = () => {},
    onChange = () => {},
}) =>
{
    const [text, setText] = React.useState("")

    const searchPlace = {
        width: "180px",
        height: "24px",
        background: "#DADADA",
        borderRadius: "25px",
        boxSizing: "border-box",
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
    }

    const search = {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        border: 0,
        fontSize: "12px",
    }

    const magnifier = {
        cursor: "pointer",
    }

    return (
        <div style={searchPlace}>
            <input type="text" style={search} onChange={(e) => {
                setText(e.target.value)
                onChange(e.target.value)
            }}/>
            <Search size={14} color="#aaafb2" style={magnifier} onClick={()=>onSearch(text)}/>
        </div>
    );
};

export default AdminSearchPlace;