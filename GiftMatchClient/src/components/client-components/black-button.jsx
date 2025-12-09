import React from 'react';
import {ClipLoader} from "react-spinners";

const BlackButton = ({
    text = 'Кнопка',
    onClick = () => {},
    children,
    isLoading = false,
    isActive = true,
}) => {
    return (
        <div className="black-button" onClick={() => {if(isActive) onClick()}} style={{backgroundColor: isActive ? "#000" : "#888"}}>
            {children}
            {isLoading ? <ClipLoader color="#fff" size={14} speedMultiplier={1.5}/> : text}
        </div>
    );
};

export default BlackButton;