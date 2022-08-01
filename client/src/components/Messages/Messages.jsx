import React from 'react';
import { useSubscription } from '@apollo/client';

import { GET_MESSAGES } from '../../common/actions';

import Message from './components/Message/Message';

const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES);

    if (!data) {
        return null;
    }

    return (
        <>
            {data.messages.map((message) => (
                <Message message={message} user={user} key={message.id} />
            ))}
        </>
    );
};

export default Messages;