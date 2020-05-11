import React from 'react';

export default function({name}) {
    
    return (
        <div className='chat-name'>
            {name}
            <div>
                <i className='video icon'></i>
                <i className='microphone icon'></i>
            </div>
        </div>
    );
    
}
