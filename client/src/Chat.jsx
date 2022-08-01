import React, { useEffect, useState } from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, Col, FormInput, Button  } from 'shards-react';

import Messages from './components/Messages/Messages';

import { POST_MESSAGE, POST_USER } from './common/actions';

let user = sessionStorage.getItem('user');

const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
      reconnect: true
    }
});

const client = new ApolloClient({
    link,
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

const Chat = () => {
    const [message, messageSet] = useState('');

    const [postMessage] = useMutation(POST_MESSAGE);

    const [postUser, { data }] = useMutation(POST_USER);
    useEffect(() => {
        if (!user || user.length === 0) {
            postUser();
        }
    }, [postUser]);
    if (!user || user.length === 0) {
        if (data) {
            sessionStorage.setItem('user', data.postUser);
            user = sessionStorage.getItem('user');
        }
    }

    const onSend = () => {
        if (message.length > 0) {
            postMessage({ variables: { user, content: message } });
            messageSet('');
        }
    }

    return (
        <Container>
            <Messages user={user} />
            <Row>
                <Col xs={2} style={{ padding: 0 }}>
                    <FormInput 
                        label="User"
                        value={'#'+user}
                        readOnly
                    />
                </Col>
                <Col xs={8}>
                    <FormInput 
                        label="Content"
                        value={message}
                        onChange={(evt) => messageSet(evt.target.value)}
                        onKeyUp={(evt) => {
                            if (evt.keyCode === 13) {
                                onSend();
                            }
                        }}
                    />
                </Col>
                <Col xs={2} style={{ padding: 0 }}>
                    <Button onClick={() => onSend()} style={{ width: '100%' }}>
                        Send
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);