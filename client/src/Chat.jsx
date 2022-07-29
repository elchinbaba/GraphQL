import React, { useState } from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, Col, FormInput, Button  } from 'shards-react';

import Messages from './components/Messages';

import { POST_MESSAGE } from './common/actions';

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
    const [state, stateSet] = useState({
        user: 'Jack',
        content: ''
    });

    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () => {
        if (state.content.length > 0) {
            postMessage({ variables: state })
        }
    }

    return (
        <Container>
            <Messages user={state.user} />
            <Row>
                <Col xs={2} style={{ padding: 0 }}>
                    <FormInput 
                        label="User"
                        value={state.user}
                        onChange={(evt) => stateSet({
                            ...state,
                            user: evt.target.value
                        })}
                    />
                </Col>
                <Col xs={8}>
                    <FormInput 
                        label="Content"
                        value={state.content}
                        onChange={(evt) => stateSet({
                            ...state,
                            content: evt.target.value
                        })}
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