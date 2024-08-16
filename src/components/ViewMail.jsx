import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ViewMail = () => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const location = useLocation();
    const id = location.state?.id;
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata',
    };

    useEffect(() => {
        if (!id) return; // Ensure id is available before making a request

        const fetchEmails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://task-be-bb6x.onrender.com/getmail?id=${id}`);
                setContent(response.data.payload.headers);
            } catch (error) {
                console.error('Error fetching email:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails()
    }, [id])

    if (loading) return <p className="p-3 text-center">Loading...</p>

    return (
        <Fragment>
            <section>
                <h1 className="p-5 text-xl font-bold border-b-2">{content.find(item => item.name === 'Subject')?.value || 'Unknown'}</h1>
            </section>
            <section className="flex gap-4 border-b-2 py-5 flex-col">
                <p className="px-5 text-xl">From: {content.find(item => item.name === 'From')?.value || 'Unknown'}</p>
                <p className="px-5 text-xl">To: {content.find(item => item.name === 'To')?.value || 'Unknown'}</p>
                <p className="px-5 font-semibold text-xl">Date: {new Date(content.find(item => item.name === 'Date')?.value).toLocaleString('en-IN', options) || 'Unknown'}</p>
            </section>
            <section className="flex gap-4 py-5 flex-col">
                <p className="px-5 text-xl">{location.state.msg}</p>
            </section>
        </Fragment>
    );
};

export default ViewMail;
