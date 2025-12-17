import React from 'react';
import {Search} from 'lucide-react'

const SearchBar = () => {
    const [isFocused, setFocused] = React.useState(false)
    const [text, setText] = React.useState("")

    const search = {
        width: "90%",
        height: "40px",
        background: "#f5f5f5",
        margin: "15px 0",
        borderRadius: "8px",
        color: "#828282",
        display: "flex",
        alignItems: "center",
        columnGap: "10px",
        padding: "0 10px",
        boxSizing: "border-box",
        position: "fixed",
        zIndex: 10,
        boxShadow: "0 0 10px #FFFFFF",
    }
    const field = {
        width: "100%",
        height: "40px",
        background: "transparent",
        border: "none",
        color: "#828282",
        fontFamily: "Montserrat",
        fontSize: "16px",
    }
    const placeholder = {
        position: "absolute",
        left: "44px",
        fontFamily: "Montserrat",
        fontSize: "16px",
    }
    return (
        <label style={search}>
            <Search color="#828282" />
            <input type="text" style={field} onChange={e => setText(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(text !== "")} />
            {!isFocused && <div style={placeholder}>Подобрать подарок</div>}
        </label>
    );
};

export default SearchBar;