import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ViewMail = () => {
    const [loading, setLoading] = useState(false);
    const[attachment, setAttachment] = useState([])
    const navigate = useNavigate()
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
                console.log(response.data);
                setContent(response.data.payload.headers);
                setAttachment(response.data.attachments)
            } catch (error) {
                console.error('Error fetching email:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails()
    }, [id])

    const handleAttachments = async (filename) => {
        try {
            const response = await axios.get(`https://task-be-bb6x.onrender.com/viewattachments?filename=${filename}`);
            navigate('/viewfile', { state: { path: response.data.path, type: response.data.type } });
        } catch (error) {
            console.error('Error fetching attachment file:', error);
        }
    };

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
            <section className="my-10">
                <div className='flex gap-2 justify-center items-center'>
                    {
                        attachment.map((data) => {
                            return <div onClick={() => handleAttachments(data.filename)} className='flex cursor-pointer bg-white rounded-3xl flex-wrap gap-2 items-center px-5 py-2'>
                                <i className="fa-solid fa-file text-[#E33851]"></i>
                                <p className='text-sm'>
                                    {data.filename}
                                </p>
                            </div>
                        })
                    }
                </div>
            </section>
        </Fragment>
    );
};

export default ViewMail;
