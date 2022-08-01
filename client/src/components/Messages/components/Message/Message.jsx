import React, { useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { Button } from 'shards-react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
library.add(fas, faThumbsUp, faThumbsDown);

import Reply from './components/Reply/Reply';

import { POST_LIKE, POST_DISLIKE, LIKE_SUBSCRIPTION, DISLIKE_SUBSCRIPTION, POST_REPLY, REPLY_SUBSCRIPTION } from '../../../../common/actions';

const Message = ({ message, user }) => {
    let { id, user: messageUser, content } = message;
    const [replying, replyingSet] = useState(false);
    const [reply, replySet] = useState('');

    const [likes, likesSet] = useState(message.likes.length);
    const [dislikes, dislikesSet] = useState(message.dislikes.length);
    const [replies, repliesSet] = useState(message.replies);

    const { data: likeData } = useSubscription(
        LIKE_SUBSCRIPTION,
        { variables: { user, messageId: id } }
    );

    const { data: dislikeData } = useSubscription(
        DISLIKE_SUBSCRIPTION,
        { variables: { user, messageId: id } }
    );

    const { data: replyData } = useSubscription(
        REPLY_SUBSCRIPTION,
        { variables: { messageId: id } }
    );

    let likers, dislikers;
    const [postLike] = useMutation(POST_LIKE);
    const handleLike = () => {
        postLike({ variables: { user, messageId: id } });
        
        if (likeData) {
            likers = likeData.like.likes;
            dislikers = likeData.like.dislikes;
            likesSet(likers.length);
            dislikesSet(dislikers.length);
        }
    };

    const [postDislike] = useMutation(POST_DISLIKE);
    const handleDislike = () => {
        postDislike({ variables: { user, messageId: id } });

        if (dislikeData) {
            likers = dislikeData.dislike.likes;
            dislikers = dislikeData.dislike.dislikes;
            likesSet(likers.length);
            dislikesSet(dislikers.length);
        }
    };

    let repliers;
    const [postReply] = useMutation(POST_REPLY);
    const handleSendReply = () => {
        if (replying && reply.length !== 0) {
            replySet('');

            postReply({ variables: {user, messageId: id,  content: reply} });

            if (replyData) {
                repliers = replyData.reply.replies;
                repliesSet(repliers);
            }
            console.log('1', repliers);
        }
        if (!(replying && reply.length === 0)) {
            replyingSet(!replying);
        }
        else return;
        console.log('2', repliers);
    }

    console.log('3', repliers);
    return (
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
                    minWidth: '40%',
                    maxWidth: '60%'
                }}
            >
                {content}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                        // justifyContent: 'space-between'
                    }}
                >
                    <span>
                        <span
                            style={{
                                marginRight: 15
                            }}
                        >
                            <button
                                style={{
                                    border: 'none',
                                    background: 'none',
                                }}
                                onClick={handleLike}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-thumbs-up" size='lg' />
                            </button>
                            <span>{likes}</span>
                        </span>
                        

                        <span>
                            <button
                                style={{
                                    border: 'none',
                                    background: 'none'
                                }}
                                onClick={handleDislike}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-thumbs-down" size='lg' />
                            </button>
                            <span>{dislikes}</span>
                        </span>
                    </span>
                    <Button
                        style={{
                            marginLeft: 'auto'            
                        }}
                        onClick={handleSendReply}
                    >
                        {replying ? 'Send' : 'Reply'}
                    </Button>
                </div>
                {replying && (
                    <div
                        style={{
                            width: '80%',
                            marginLeft: 'auto'
                        }}
                    >
                        <input
                            type="text"
                            value={reply}
                            onChange={evt => replySet(evt.target.value)}
                            style={{
                                marginTop: 10,
                                display: 'block',
                                width: '100%'
                            }}
                        />
                        {replies.map(rep => (
                            <Reply reply={rep} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );  
};

export default Message;