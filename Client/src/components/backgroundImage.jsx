// BackgroundImage.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/backgroundImage.css';
import background from '../images/background-image.jpg';
import BackgroundImageButtons from './BackgroundImageButtons'; // Import the new component

export default function BackgroundImage() {
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: `center ${scrollY * 0.1}px`, // Parallax effect
        width: '100vw',
        position: 'relative',
        zIndex: 1,
    };

    return (
        <div className="masthead" style={backgroundStyle}>
            <div className='color-overlay d-flex flex-column justify-content-center align-items-center'>
                <BackgroundImageButtons />
            </div>
        </div>
    );
}
