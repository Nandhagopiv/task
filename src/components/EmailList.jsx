import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pic from '../Assets/profile-circle-icon-1023x1024-ucnnjrj1.png'

const EmailList = () => {
    const [emails, setEmails] = useState([]);
    const [Aloading, setALoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [peopleArrow, setPeopleArrow] = useState(true);
    const [mailBoxArrow, setMailBoxArrow] = useState(true);
    const [investorsArrow, setInvestorsArrow] = useState(true);
    const navigate = useNavigate()

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
                const tempFrom = res.data.map((data) => {
                    return data.payload.headers.find(item => item.name === 'From')?.value || 'Unknown';
                });

                const tempArr = res.data.flatMap((data) => data.attachments)
                const uniqueAttachments = Array.from(new Set(tempArr.map(a => a.filename)))
                    .map(filename => {
                        return tempArr.find(a => a.filename === filename);
                    });

                const combinedArray = uniqueAttachments.map((obj, index) => (
                    { ...obj, from: tempFrom[index] }
                ));

                setAttachments(combinedArray);

            } catch (error) {
                console.error('Error fetching attachments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttachments();
    }, []);

    const handleViewMail = (id) => {
        emails.forEach((data) => {
            if (data.id === id) {
                navigate('/view', { state: { id: id, msg: data.snippet } });
            }
        });
    };

    const handleAttachments = async (filename) => {
        try {
            const response = await axios.get(`https://task-be-bb6x.onrender.com/viewattachments?filename=${filename}`);
            navigate('/viewfile', { state: { path: response.data.path, type: response.data.type } });
        } catch (error) {
            console.error('Error fetching attachment file:', error);
        }
    };

    const handlePeopleBoxArrow = () => {
        setPeopleArrow(!peopleArrow);
    };

    const handleMailBoxArrow = () => {
        setMailBoxArrow(!mailBoxArrow);
    };

    const handleInvestorsArrow = () => {
        setInvestorsArrow(!investorsArrow);
    };

    const formatDateWithDay = (timestamp) => {
        const date = new Date(Number(timestamp));
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const groupEmailsByDate = (emails) => {
        return emails.reduce((acc, email) => {
            const formattedDate = formatDateWithDay(email.internalDate);

            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(email);

            return acc;
        }, {});
    };

    const groupedEmails = groupEmailsByDate(emails);

    return (
        <Fragment>
            <main className='w-[100%] min-h-[750px] flex gap-3'>
                <section className='bg-zinc-200 flex w-[20%]'>
                    <div className='w-[20%] relative border-r-2 bg-white'>
                        <div className='sticky flex flex-col gap-[275px] top-0'>
                            <div>
                                <div className='w-[100%] h-[60px] flex justify-center items-center'>
                                    <div className='bg-white border-[3px] border-[#2775ED] rounded-2xl p-0.5'>
                                        <div className='bg-[#F5E01B] rounded-xl flex justify-center items-center h-[40px] w-[40px]'>
                                            <i class="fa-solid fa-paper-plane fa-lg"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[100%] flex gap-10 flex-col items-center p-5'>
                                    <i className="fa-regular fa-message"></i>
                                    <i className="fa-regular fa-comment"></i>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <div className='bg-zinc-100 rounded-md px-3 py-2 border border-zinc-200'>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-10'>
                                <div className='flex flex-col gap-[10px] items-center'>
                                    <div className='flex gap-[2px]'>
                                        <i className="fa-regular fa-square fa-2xs"></i>
                                        <i className="fa-regular fa-square fa-2xs"></i>
                                    </div>
                                    <div className='flex gap-[2px]'>
                                        <i className="fa-regular fa-square fa-2xs"></i>
                                        <i className="fa-regular fa-square fa-2xs"></i>
                                    </div>
                                </div>
                                <div className='w-[100%] h-[60px] p-3'>
                                    <img src={pic} alt="Profile" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-[80%] flex flex-col bg-white'>
                        <div className='flex items-center bg-white sticky z-20 top-0 justify-between'>
                            <div className='py-2 px-5 w-[100%] font-bold items-center justify-between flex gap-3'>
                                <h1>Station</h1>
                                <div className='flex items-center gap-3'>
                                    <i className="fa-solid fa-arrow-left fa-xs"></i>
                                    <i className="fa-solid fa-arrow-right fa-xs"></i>
                                    <div className='bg-[#F5E01B] rounded-3xl px-3 py-2'>
                                        <i className="fa-solid fa-pencil"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ scrollbarWidth: 'none' }} className='relative h-[750px] overflow-y-auto'>
                            <div className='py-2 text-zinc-600 text-sm'>
                                <div className='flex items-center hover:bg-zinc-100 px-5 py-2 gap-2'>
                                    <i className="fa-regular fa-message"></i>
                                    <p>Discussions</p>
                                </div>
                                <div className='flex items-center hover:bg-zinc-100 px-5 py-2 gap-2'>
                                    <i className="fa-regular fa-envelope"></i>
                                    <p>Unreads</p>
                                </div>
                                <div className='flex items-center hover:bg-zinc-100 px-5 py-2 gap-2'>
                                    <i className="fa-solid fa-stopwatch"></i>
                                    <p>Later</p>
                                </div>
                                <div className='flex items-center hover:bg-zinc-100 px-5 py-2 gap-2'>
                                    <i className="fa-solid fa-ellipsis"></i>
                                    <p>More</p>
                                </div>
                            </div>
                            <div style={{ height: mailBoxArrow ? 'max-content' : '50px' }} className='m-2 flex flex-col gap-3 rounded-md overflow-y-hidden bg-zinc-100 p-3'>
                                <div className='flex gap-2 items-center'>
                                    <i onClick={handleMailBoxArrow} className="fa-solid fa-caret-down"></i>
                                    <h1 className='font-bold'>Mailboxes</h1>
                                </div>
                                <p>📨All Other Mails</p>
                                <p>📧Calendly</p>
                                <p>💼Centigo</p>
                                <p>👨🏽‍💼Nmbrs Payroll</p>
                                <p>🚆Stripe</p>
                                <p>💰Pre-Seed Investors</p>
                            </div>
                            <div style={{ height: peopleArrow ? 'max-content' : '50px' }} className='m-2 flex flex-col gap-3 rounded-md overflow-y-hidden bg-zinc-100 p-3'>
                                <div className='flex gap-2 items-center'>
                                    <i onClick={handlePeopleBoxArrow} className="fa-solid fa-caret-down"></i>
                                    <h1 className='font-bold'>People</h1>
                                </div>
                                <p>👨🏽‍💼Hester Noorman</p>
                                <p>👨🏽‍💼Jothi Priyadharsan</p>
                            </div>
                            <div style={{ height: investorsArrow ? 'max-content' : '50px' }} className='m-2 flex flex-col gap-3 rounded-md overflow-y-hidden bg-zinc-100 p-3'>
                                <div className='flex gap-2 items-center'>
                                    <i onClick={handleInvestorsArrow} className="fa-solid fa-caret-down"></i>
                                    <h1 className='font-bold'>Investors</h1>
                                </div>
                                <p>💼Accel</p>
                                <p>🚆Air Bridges</p>
                                <p>💰Blossom Capital</p>
                                <p>👨🏽‍💼Global Founders Capital</p>
                                <p>📨First Minute Capital</p>
                                <p>👨🏽‍💼Rockstart</p>
                                <p>📧Inkef Capital</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-[60%] bg-white'>
                    <div className='border-b-2 z-20 sticky top-0 bg-white flex items-center justify-between px-5 py-4 font-bold text-xl'>
                        <div className='flex gap-2 items-center'>
                            <p>All Other Emails</p>
                            <i className="fa-solid fa-angle-down fa-xs"></i>
                        </div>
                        <div className='flex gap-4'>
                            <div className='bg-zinc-100 w-[35px] flex justify-center items-center h-[35px] rounded-3xl'>
                                <i className="fa-solid fa-check fa-xs"></i>
                            </div>
                            <div className='bg-zinc-100 w-[35px] flex justify-center items-center h-[35px] rounded-3xl'>
                                <i className="fa-solid fa-paperclip fa-xs"></i>
                            </div>
                            <div className='bg-[#F5E01B] w-[35px] flex justify-center items-center h-[35px] rounded-3xl'>
                                <i className="fa-regular fa-calendar-days fa-xs"></i>
                            </div>
                            <div className='bg-zinc-100 w-[35px] flex justify-center items-center h-[35px] rounded-3xl'>
                                <i className="fa-solid fa-ellipsis-vertical fa-xs"></i>
                            </div>
                        </div>
                    </div>
                    <div style={{ scrollbarWidth: 'none' }} className='w-[100%] relative h-[750px] overflow-y-auto'>
                        {Object.keys(groupedEmails).map(date => (
                            <div key={date}>
                                <p className='font-medium p-5 text-zinc-500'>{date}</p>
                                {groupedEmails[date].map(email => {
                                    const emailDate = new Date(Number(email.internalDate));

                                    const formattedTime = emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Example: "12:00 PM"

                                    return (
                                        <div
                                            key={email.id}
                                            className='break-words cursor-default border-b-2 flex flex-col gap-3 px-5 py-2 hover:bg-zinc-100'
                                        >
                                            <div onClick={() => handleViewMail(email.id)} className='flex py-2 gap-5'>
                                                <div className='w-[20%]'>
                                                    <p className='font-semibold'>{email.sender}</p>
                                                </div>
                                                <div className='w-[70%] text-nowrap overflow-x-hidden'>
                                                    <p>{email.snippet}</p>
                                                </div>
                                                <div className='w-[10%]'>
                                                    <p className='font-medium'>{formattedTime}</p>
                                                </div>
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                {
                                                    email.attachments.map((data) => {
                                                        return <div onClick={() => handleAttachments(data.filename)} className='flex cursor-pointer bg-slate-200 rounded-3xl flex-wrap gap-2 items-center px-5 py-2'>
                                                            <i className="fa-solid fa-file text-[#E33851]"></i>
                                                            <p className='text-sm'>
                                                                {data.filename}
                                                            </p>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        <p style={{ display: Aloading ? 'block' : 'none' }} className='text-center p-3'>Loading...</p>
                    </div>
                </section>
                <section className='w-[20%] top-0 bg-white flex flex-col gap-5'>
                    <div className='flex items-center bg-white z-20 sticky top-0 justify-between'>
                        <div className='p-5 font-bold items-center flex gap-3'>
                            <h1 className='text-xl'>Files</h1>
                            <p className='text-zinc-300 text-sm'> | All Other Emails</p>
                        </div>
                    </div>
                    <div style={{ scrollbarWidth: 'none' }} className='relative h-[750px] flex flex-col overflow-y-auto'>
                        {attachments.map((doc) => (
                            <div onClick={() => handleAttachments(doc.filename)} className='border-b- cursor-pointer px-5 py-4 flex flex-col gap-2 hover:bg-zinc-100 break-words' key={doc.filename}>
                                <div className='flex gap-2 items-center'>
                                    <i className="fa-solid fa-file text-[#E33851]"></i>
                                    <p className='text-sm'>
                                        {doc.filename}
                                    </p>
                                </div>
                                <p className='text-zinc-500'>from {doc.from.replace(/<[^>]*>/g, '')}</p>
                            </div>
                        ))}
                        <p style={{ display: loading ? 'block' : 'none' }} className='text-center text-sm p-3'>Loading...</p>
                    </div>
                </section>
            </main>
        </Fragment>
    );
};

export default EmailList;
