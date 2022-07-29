import { gql } from '@apollo/client';

const GET_MESSAGES = gql`
    subscription {
        messages {
            id
            content
            user
        }
    }
`;

const POST_MESSAGE = gql`
    mutation ($user:String!, $content:String!) {
        postMessage(user: $user, content: $content)
    }
`;

export { GET_MESSAGES, POST_MESSAGE };