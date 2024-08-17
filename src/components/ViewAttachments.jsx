import React from "react";
import { useLocation } from "react-router-dom";

const ViewAttachments = () => {
    const location = useLocation();
    const { path, type } = location.state; // Expecting 'path' to be base64 data and 'type' to be the MIME type

    // Construct the data URL based on the attachment type
    const dataUrl = `data:${type};base64,${path}`;

    // Determine the file type and render accordingly
    const renderAttachment = () => {
        if (type.startsWith('image/')) {
            return (
                <img src={dataUrl} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            );
        } else if (type === 'application/pdf') {
            return (
                <iframe
                    src={dataUrl}
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                    title="PDF Viewer"
                />
            );
        } else {
            return <p>Unsupported file type</p>;
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {renderAttachment()}
        </div>
    );
};

export default ViewAttachments;

