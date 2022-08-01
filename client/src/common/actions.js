import { gql } from '@apollo/client';

const GET_MESSAGES = gql`
    subscription {
        messages {
            id
            user
            content
            likes
            dislikes
            replies {
                user
                content
            }
        }
    }
`;

const LIKE_SUBSCRIPTION = gql`
  subscription Like($user: String!, $messageId: String!) {
    like(user: $user, messageId: $messageId) {
        likes
        dislikes
    }
  }
`;

const DISLIKE_SUBSCRIPTION = gql`
  subscription Dislike($user: String!, $messageId: String!) {
    dislike(user: $user, messageId: $messageId) {
        likes
        dislikes
    }
  }
`;

const REPLY_SUBSCRIPTION = gql`
  subscription Reply($messageId: String!) {
      reply(messageId: $messageId) {
          replies {
              user
              content
          }
      }
  }
`;

const GET_MESSAGE = gql`
    subscription {
        like {
            id
            user
            content
            likes
            dislikes
        }
    }
`;

const POST_MESSAGE = gql`
    mutation ($user:String!, $content:String!) {
        postMessage(user: $user, content: $content)
    }
`;

const POST_USER = gql`
    mutation {
        postUser
    }
`;

const POST_LIKE = gql`
    mutation ($user:String!, $messageId:String!) {
        postLike(user: $user, messageId: $messageId)
    }
`;

const POST_DISLIKE = gql`
    mutation ($user:String!, $messageId:String!) {
        postDislike(user: $user, messageId: $messageId)
    }
`;

const POST_REPLY = gql`
    mutation ($user:String!, $messageId:String!, $content:String!) {
        postReply(user: $user, messageId: $messageId, content: $content) {
            id
            user
            content
        }
    }
`;

export { GET_MESSAGES, POST_MESSAGE, POST_USER, POST_LIKE, POST_DISLIKE, GET_MESSAGE, LIKE_SUBSCRIPTION, DISLIKE_SUBSCRIPTION, POST_REPLY, REPLY_SUBSCRIPTION };