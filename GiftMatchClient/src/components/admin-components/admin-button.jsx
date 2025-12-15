import React from 'react';

const AdminButton = ({
    text = "Кнопка",
    onClick = () => {},
    width = "100%",
    height = "40px",
    isActive = true
}) => {
    return (
        <div onClick={() => {if(isActive) onClick()}} style={{width: width, height: height, backgroundColor: isActive ? "#16BB99" : "#E7E7E7"}} className="admin-button">
            {text}
        </div>
    );
};

export default AdminButton;