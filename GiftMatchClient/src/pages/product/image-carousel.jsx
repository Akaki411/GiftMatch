import React, { useState } from 'react';

const styles = {
    carouselContainer: {
        width: '100%',
        minHeight: '300px',
        height: '300px',
        position: 'relative',
        overflow: 'hidden',
    },
    carouselTrack: {
        display: 'flex',
        transition: 'transform 0.3s ease-in-out',
        height: '300px',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        flexShrink: 0,
        objectFit: 'contain',
        backgroundColor: '#f5f5f5',
    },
    navigationButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ddd',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#333',
        zIndex: 10,
    },
    prevButton: {
        left: '15px',
    },
    nextButton: {
        right: '15px',
    },
    indicators: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '15px',
    },
    indicator: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#ddd',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    activeIndicator: {
        backgroundColor: '#333',
    },
    imageCounter: {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '14px',
    },
};

const ProductCarousel = ({
    imageUrls = ["uploads/images/default.webp"]
}) =>
{
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === imageUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div style={styles.carouselContainer}>
            {imageUrls.length > 1 && (
                <button
                    style={{ ...styles.navigationButton, ...styles.prevButton }}
                    onClick={goToPrevious}
                    aria-label="Предыдущее изображение">‹</button>
            )}

            <div
                style={{
                    ...styles.carouselTrack,
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {imageUrls.map((imageUrl, index) => (
                    <img
                        key={index}
                        src={`${import.meta.env.VITE_APP_API_URL}/${imageUrl}`}
                        alt={`Изображение товара ${index + 1}`}
                        style={styles.carouselImage}
                    />
                ))}
            </div>

            {imageUrls.length > 1 && (
                <button
                    style={{ ...styles.navigationButton, ...styles.nextButton }}
                    onClick={goToNext}
                    aria-label="Следующее изображение"
                >
                    ›
                </button>
            )}

            {imageUrls.length > 1 && (
                <div style={styles.imageCounter}>
                    {currentIndex + 1} / {imageUrls.length}
                </div>
            )}

            {imageUrls.length > 1 && (
                <div style={styles.indicators}>
                    {imageUrls.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.indicator,
                                ...(index === currentIndex ? styles.activeIndicator : {}),
                            }}
                            onClick={() => goToSlide(index)}
                            aria-label={`Перейти к изображению ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;