import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; // Assuming you're using React Bootstrap
import "./componentCss/backgroundbuttons.css"
const BackgroundImageButtons = () => {
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const navbar = document.querySelector('.navbar'); // Update with your navbar class or ID
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }
    }, []);

    return (
        <div className='text-center' style={{ paddingTop: '80px', paddingBottom: '20px' }}>
            <h1 className="text-white mb-4">Report Public Infrastructure Issues</h1>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
    <h3 className="text-white mb-4 custom-h3">
        Help us keep our community safe and well-maintained by reporting issues like potholes, broken sidewalks, and more. Your input makes a difference!
    </h3>
</div>
            <div className="button-container d-flex flex-column flex-md-row justify-content-center">
                <Button className="btn btn-primary btn-lg mx-2 mb-2 mb-md-0" onClick={() => navigate('/form')}>
                    Report An Issue Now
                </Button>
                <Button className="btn btn-secondary btn-lg mx-2">Check In On A Report</Button>
            </div>
        </div>
    );
};

export default BackgroundImageButtons;
