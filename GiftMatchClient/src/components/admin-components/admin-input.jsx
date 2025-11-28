import React from 'react';

const AdminInput =({
    type = "text",
    style = {},
    onChange = () => {},
    placeholder = "Текст...",
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
}) => {
    return (
        <input type={type} min={min} max={max} style={style} onChange={key => {onChange(key.target.value)}} className="round-input" placeholder={placeholder}/>
    )
}

export default AdminInput