import React from 'react';
import {ChevronLeft} from 'lucide-react'

const Header = ({
    onClick = () => {},
    border = true,
    text = ''
}) => {
    return (
        <div className='header' style={{borderBottom: border ? '1px solid #787878' : 'none'}}>
            <div className='header-icon' onClick={onClick}>
                <ChevronLeft color="#000000" />
            </div>
            {text}
        </div>
    );
};

export default Header;