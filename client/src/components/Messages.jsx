import React from 'react';
import { useSubscription } from '@apollo/client';

import { GET_MESSAGES } from '../common/actions';

const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES);
    if (!data) {
        return null;
    }

    return (
        <>
            {data.messages.map(({ id, user: messageUser, content }) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
                        paddingBottom: '1em'
                    }}
                >
                    {user !== messageUser && (
                        <div
                            style={{
                                height: 50,
                                width: 50,
                                marginRight: '0.5em',
                                border: '2px solid #e5e6ea',
                                borderRadius: 25,
                                textAlign: 'center',
                                fontSize: '18pt',
                                paddingTop: 5
                            }}
                        >
                            {messageUser.slice(0,2).toUpperCase()}
                        </div>
                    )}
                    <div
                        style={{
                            background: user === messageUser ? '#58bf56' : '#e5e6ea',
                            color: user === messageUser ? 'white' : 'black',
                            padding: '1em',
                            borderRadius: '1em',
                            maxWidth: '60%'
                        }}
                    >
                        {content}
                    </div>
                </div>
            ))}
        </>
    );
};

export default Messages;