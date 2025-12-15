import React, {useEffect, useState} from 'react';
import {createPortal} from "react-dom";

const PopupAdmin = ({
    isActive = false,
    onClose = () => {},
    children
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 200);
        }
    }, [isActive]);

    if (!isVisible) return null;

    return createPortal(
        <div className="popup-admin" >
            <div className="popup-admin_background" style={{opacity: isAnimating ? 0.3 : 0}} onClick={onClose}/>
            <div className="popup-admin_content invisible-scrolling" style={{opacity: isAnimating ? 1 : 0, transform: `translateY(${isAnimating ? 0 : 40}px)`, overflowY: "scroll"}} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>, document.body);
};

export default PopupAdmin;