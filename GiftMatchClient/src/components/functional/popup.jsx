import React, {useEffect, useState} from 'react';
import PopupHeader from "../client-components/popup-header.jsx";

const Popup = ({
    isActive = false,
    onClose = () => {},
    children,
    zIndex = 100,
    headerSettings = {}
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() =>
    {
        if (isActive)
        {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 20);
        }
        else
        {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 200);
        }
    }, [isActive]);

    if (!isVisible) return null;

    return (
        <div className={isAnimating ? "popup popup-active" : "popup"} style={{zIndex}}>
            <PopupHeader onClick={() => {
                onClose()
            }} {...headerSettings}/>
            {children}
        </div>
    );
};

export default Popup;