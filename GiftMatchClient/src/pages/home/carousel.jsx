import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";

const Carousel = observer(() => {
    const {categories} = useContext(Context);
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    }

    const container = {
        position: 'relative',
        width: '100%',
        height: '150px',
        borderRadius: '15px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }
    const sliderTrack = {
        display: 'flex',
        height: '100%',
        width: '100%',
        transition: 'transform 0.5s ease-out',
        transform: `translateX(-${currentIndex * 100}%)`,
    }
    const slideItem = {
        minWidth: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
        padding: '0 10px',
        backgroundColor: '#E1E5E8',
    }
    const title = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#000',
        margin: 0,
        zIndex: 2,
    }
    const imageContainer = {
        flex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundClip: 'no-repeat',
        backgroundSize: 'cover',
    }
    const dotsContainer = {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 5,
    }
    const dot = {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        border: 'none',
        padding: 0,
    }

    return (
        <div style={container}>
            <div style={sliderTrack}>
                {categories.list.map((slide) => {
                    return (
                        <div key={slide.categoryId} style={slideItem}>
                            <div style={{flex: 1, ...title}}>{slide.name}</div>
                            <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${slide.imageUrl})`, flex: 2, ...imageContainer}}/>
                        </div>
                    )
                })}
            </div>

            {/* Точки навигации (Pagination) */}
            <div style={dotsContainer}>
                {categories.list.map((slide, index) => (
                    <button
                        key={slide.categoryId}
                        onClick={() => goToSlide(index)}
                        style={{backgroundColor: currentIndex === index ? '#333' : '#B0B0B0', ...dot}}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
})

export default Carousel;