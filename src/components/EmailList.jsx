import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pic from '../Assets/profile-circle-icon-1023x1024-ucnnjrj1.png'

const EmailList = () => {
    const [emails, setEmails] = useState([]);
    const [Aloading, setALoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [viewFiles, setViewFiles] = useState('-100%')
    const navigate = useNavigate(); // Lowercase `navigate` for convention

    useEffect(() => {
        const fetchEmails = async () => {
            setALoading(true);
            try {
                const response = await axios.get('https://task-be-bb6x.onrender.com/emails');
                console.log(response);
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
            } finally {
                setALoading(false);
            }
        };

        fetchEmails();
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchAttachments = async () => {
            try {
                const res = await axios.get('https://task-be-bb6x.onrender.com/attachments');
                const tempArr = res.data.flatMap((data) => data.attachments);

                // Remove duplicates based on `filename` or any unique property
                const uniqueAttachments = Array.from(new Set(tempArr.map(a => a.filename)))
                    .map(filename => {
                        return tempArr.find(a => a.filename === filename);
                    });

                setAttachments(uniqueAttachments);
            } catch (error) {
                console.error('Error fetching attachments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttachments();
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchAttachments = async () => {
            try {
                const res = await axios.get('https://task-be-bb6x.onrender.com/attachments');
                const tempArr = res.data.flatMap((data) => data.attachments);

                // Remove duplicates based on `filename` or any unique property
                const uniqueAttachments = Array.from(new Set(tempArr.map(a => a.filename)))
                    .map(filename => {
                        return tempArr.find(a => a.filename === filename);
                    });

                setAttachments(uniqueAttachments);
            } catch (error) {
                console.error('Error fetching attachments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttachments();
    }, [emails]);

    const handleViewMail = (id) => {
        emails.forEach((data) => {
            if (data.id === id) {
                navigate('/view', { state: { id: id, msg: data.snippet } });
            }
        })
    };

    const handleSideNav = (val) => {
        setViewFiles(val)
    }

    const handleAttachments = async (path) => {
        console.log(path);
        const res = await axios.get(`https://task-be-bb6x.onrender.com/viewattachments?path=${path}`)
        navigate('/viewfile', {state:{path : res.data}})
    }

    return (
        <Fragment>
            <main className='w-[100%] md:grid grid-cols-10'>
                <section className='md:overflow-y-auto md:h-[730px] md:col-span-8'>
                    <div className='border-b-2 flex justify-between items-center sticky top-0 bg-white p-5 font-bold text-2xl'>
                        <p>All Emails</p>
                        <i onClick={() => handleSideNav('0')} className="fa-sharp md:hidden block fa-solid fa-less-than fa-2xs"> attachments</i>
                    </div>
                    <div>
                        {emails.map(email => (
                            <div onClick={() => handleViewMail(email.id)} key={email.id} className='p-5 break-all hover:bg-zinc-200'>
                                <p><strong>Date:</strong> {new Date(Number(email.internalDate)).toLocaleString()}</p>
                                <div className='flex py-5 gap-5'>
                                    <div className='h-[100px] w-[100px]'>
                                        <img src={pic} alt="" />
                                    </div>
                                    <div>
                                        <p className='text-2xl'><strong>{email.sender}</strong></p>
                                        <p>{email.snippet}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p style={{ display: Aloading ? 'block' : 'none' }} className='text-center p-3'>Loading...</p>
                    </div>
                </section>
                <section style={{ right: viewFiles }} className='md:overflow-y-auto w-[75%] md:w-[100%] md:h-[730px] top-0 bg-white fixed md:static shadow-xl flex flex-col gap-5 h-[100%] text-2xl col-span-2'>
                    <div className='flex items-center justify-between pl-5'>
                        <i onClick={() => handleSideNav('-100%')} className="fa-sharp md:hidden block fa-solid fa-less-than fa-2xs"></i>
                        <h1 className='text-xl bg-white sticky top-0 font-semibold p-5'>Attachments</h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {attachments.map((doc) => (
                            <p onClick={() => handleAttachments(doc.filename)} key={doc.filename} className='text-sm px-5 py-4 hover:bg-zinc-200 break-words'>
                                {doc.filename}
                            </p>
                        ))}
                        <p style={{ display: loading ? 'block' : 'none' }} className='text-center text-sm p-3'>Loading...</p>
                    </div>
                </section>
            </main>
        </Fragment>
    );
};

export default EmailList;
