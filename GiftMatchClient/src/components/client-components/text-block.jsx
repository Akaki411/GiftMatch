import React from 'react';

const TextBlock = ({
    children,
    size = 14
}) => {
    return (
        <div className="text-block" style={{fontSize: size}}>
            {children}
        </div>
    );
};

export default TextBlock;