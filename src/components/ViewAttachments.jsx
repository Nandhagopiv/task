import React from "react";
import { useLocation } from "react-router-dom";

const ViewAttachments = () => {
    const location = useLocation();
    const base64Data = location.state.path; // Base64 string of the PDF
    const pdfData = `data:application/pdf;base64,${base64Data}`;

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src={pdfData}
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                title="PDF Viewer"
            />
            <img src={`data:image/jpeg;base64,${location.state.path}`} alt="" />
        </div>
    );
}

export default ViewAttachments;
