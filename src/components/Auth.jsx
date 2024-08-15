import React from 'react';

const Auth = () => {
    const handleAuth = () => {
        window.location.href = 'https://task-be-bb6x.onrender.com/auth';
    };

    return (
        <div className='text-center mt-[50%] md:mt-[15%]'>
            <h1 className='text-4xl font-bold py-7'>Login Here</h1>
            <button className='bg-black py-3 rounded-3xl px-5 text-white font-bold' onClick={handleAuth}>Sign in with Google</button>
        </div>
    );
};

export default Auth;
