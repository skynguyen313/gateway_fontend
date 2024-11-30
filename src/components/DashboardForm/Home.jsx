import React from 'react';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    
    return (
        <div className='container'>
            <h2>hi {user && user.full_name}</h2>
            <p style={{textAlign:'center',}}>welcome to your profile</p>
        </div>
    )

    }

export default Home