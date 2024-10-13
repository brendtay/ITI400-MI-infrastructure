import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/backgroundImage.css';
import background from '../images/background-image.jpg';
import { Container } from 'react-bootstrap';

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

    // Adjust the background position based on scroll
    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: `center ${scrollY * 0.5}px`, // Parallax effect
        width: '100vw',
        height: '80vh',
        position: 'relative',
        top: 0,
        zIndex: 1,
    };

    return (
        <div className="masthead" style={backgroundStyle}>
            <div className='color-overlay d-flex flex-column justify-content-center align-items-center'>
                {/* Centered Text Above Buttons */}
                <h1 className="text-white mb-4 text-center">Report Public Infrastructure Issues</h1>

                {/* Wrapper for limiting text width */}
                <div style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <h3 className="text-white mb-4">
                        Help us keep our community safe and well-maintained by reporting issues like potholes, broken sidewalks, and more. Your input makes a difference!
                    </h3>
                </div>

                {/* Button Container with side-by-side buttons */}
                <div className="button-container d-flex justify-content-center">
                    <button className="btn btn-primary btn-lg mx-2">Report An Issue Now</button>
                    <button className="btn btn-secondary btn-lg mx-2">Check In On A Report</button>
                </div>
            </div>
        </div>
    );
}
