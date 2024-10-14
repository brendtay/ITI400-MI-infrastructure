// BackgroundImageButtons.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

const BackgroundImageButtons = () => {
    return (
        <div className='text-center'>
            <h1 className="text-white mb-4">Report Public Infrastructure Issues</h1>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 className="text-white mb-4">
                    Help us keep our community safe and well-maintained by reporting issues like potholes, broken sidewalks, and more. Your input makes a difference!
                </h3>
            </div>
            <div className="button-container d-flex justify-content-center">
                <Button className="btn btn-primary btn-lg mx-2">Report An Issue Now</Button>
                <Button className="btn btn-secondary btn-lg mx-2">Check In On A Report</Button>
            </div>
        </div>
    );
};

export default BackgroundImageButtons;
