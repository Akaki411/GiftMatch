import React from 'react';

const BlackButton = ({
    text = 'Кнопка',
    onClick = () => {},
    children,
}) => {
    return (
        <div className="black-button" onClick={onClick}>
            {children}
            {text}
        </div>
    );
};

export default BlackButton;