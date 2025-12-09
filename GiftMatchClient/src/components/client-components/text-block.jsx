import React from 'react';

const TextBlock = ({
    children,
    size = 14,
    style = {}
}) => {
    return (
        <div className="text-block" style={{fontSize: size, ...style}}>
            {children}
        </div>
    );
};

export default TextBlock;