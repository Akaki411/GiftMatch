import React from 'react';
import {ChevronLeft} from 'lucide-react'

const PopupHeader = ({
    onClick = () => {},
    border = true,
    text = ''
}) => {
    return (
        <div className='header' style={{borderBottom: border ? '1px solid #E6E6E6' : 'none'}}>
            <div className='header-icon' onClick={onClick}>
                <ChevronLeft color="#000000" />
            </div>
            {text}
        </div>
    );
};

export default PopupHeader;