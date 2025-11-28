import React from 'react';

const AdminTextArea = ({
    placeholder = "Текст...",
    onChange = () => {},
    style = {},
}) => {
    return (
        <textarea className="round-textarea" placeholder={placeholder} onChange={(key)=>{onChange(key.target.value)}} style={style}/>
    )
}

export default AdminTextArea;