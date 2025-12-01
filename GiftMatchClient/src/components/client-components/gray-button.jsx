import React from 'react';

const GrayButton = ({
    text = 'Кнопка',
    onClick = () => {},
    children,
}) => {
    return (
        <div className="gray-button" onClick={onClick}>
            {children}
            {text}
        </div>
    );
};

export default GrayButton;