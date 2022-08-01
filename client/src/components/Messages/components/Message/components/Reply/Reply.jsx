import React from 'react';

const Reply = ({ reply }) => {
    return (
        <div
            style={{
                display: 'flex',
                margin: '5px 0',
                padding: '0 10px'
            }}
        >
            <span>{reply.content}</span>
            <span
                style={{
                    marginLeft: 'auto',
                }}
            >
                #{reply.user}
            </span>
        </div>
    );
};

export default Reply;