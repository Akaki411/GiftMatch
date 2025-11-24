import React from 'react';

const AdminInput =({
    type = "text",
    style = {},
    onChange = () => {},
    placeholder = "Текст..."
}) => {
    return (
        <input type={type} style={style} onChange={key => {onChange(key.target.value)}} className="round-input" placeholder={placeholder}/>
    )
}

export default AdminInput