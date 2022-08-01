const { GraphQLServer, PubSub } = require('graphql-yoga');

const users = [];
const messages = [];

const typeDefs = `
    type User {
        id: ID!
    }

    type Reply {
        id: ID!
        user: String!
        content: String!
        messageId: String!
    }

    type Message {
        id: ID!
        user: String!
        content: String!
        likes: [String!]
        dislikes: [String!]
        replies: [Reply!]
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
        postUser: ID!
        postLike(user: String!, messageId: String!): Int!
        postDislike(user: String!, messageId: String!): Int!
        postReply(user: String!, messageId: String!, content: String!): Message!
    }

    type Subscription {
        messages: [Message!]
        like(user: String!, messageId: String!): Message!
        dislike(user: String!, messageId: String!): Message!
        reply(messageId: String!): Message!
    }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    Query: {
        messages: () => messages,
        // user: (id) => users.find(user => user === id)
    },
    Mutation: {
        postUser: (parent, {}) => {
            const id = users.length;
            users.push(id.toString());
            return id;
        },
        postMessage: (parent, { user, content }) => {
            const id = messages.length;
            messages.push({
                id,
                content,
                user,
                likes: [],
                dislikes: [],
                replies: []
            });
            subscribers.forEach((fn) => fn());
            return id;
        },
        postLike: (parent, { user, messageId }) => {
            const message = messages.find((mess) => mess.id == messageId);
            if (message.likes.includes(user)) {
                message.likes = message.likes.filter(liker => liker !== user);
                
                pubsub.publish('LIKE', message);
                return 0;
            }
            else if (message.dislikes.includes(user)) {
                message.dislikes = message.dislikes.filter(disliker => disliker !== user);
                message.likes.push(user);

                pubsub.publish('LIKE', message);
                return 1;
            }
            else {
                message.likes.push(user);

                pubsub.publish('LIKE', message);
                return 1;
            }
         },
        postDislike: (parent, { user, messageId }) => {
            const message = messages.find((mess) => mess.id == messageId);
            if (message.dislikes.includes(user)) {
                message.dislikes = message.dislikes.filter(disliker => disliker !== user);

                pubsub.publish('DISLIKE', message);
                return 0;
            }
            else if (message.likes.includes(user)) {
                message.likes = message.likes.filter(liker => liker !== user);
                message.dislikes.push(user);

                pubsub.publish('DISLIKE', message);
                return 1;
            }
            else {
                message.dislikes.push(user);

                pubsub.publish('DISLIKE', message);
                return 1;
            }
        },
        postReply: (parent, { user, messageId, content }) => {
            const message = messages.find(mes => mes.id == messageId);
            message.replies.push({
                user,
                content
            });
            pubsub.publish('REPLY', message);
            return message;
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdates(() => pubsub.publish(channel, { messages }));
                setTimeout(() => pubsub.publish(channel, { messages }), 0);
                return pubsub.asyncIterator(channel);
            }
        },
        like: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('LIKE'),
            resolve: payload => payload
        },
        dislike: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('DISLIKE'),
            resolve: payload => payload
        },
        reply: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('REPLY'),
            resolve: payload => payload
        }
    }
}

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({port}) => {
    console.log(`Server is on http://localhost:${port}/`);
});