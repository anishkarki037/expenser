// Loading.js
import React from 'react';

const Loading = () => {
    return (
        <div className="loading">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;
