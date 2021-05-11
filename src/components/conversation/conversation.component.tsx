import React, { useEffect } from 'react';

import { User } from 'next-auth';

import { useConversationHook } from './use-conversation-hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useConversation } from 'src/components/conversation/conversation.context';
import PostComponent from 'src/components/timeline/post/post.component';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  post: Post;
  user: WithAdditionalParams<User>;
};

const Conversation = ({ post, user }: Props) => {
  const { state } = useConversation();
  const { setPost, reply, loadComments } = useConversationHook(user);

  useEffect(() => {
    setPost(post);
  }, []);

  const handleReply = (comment: Comment) => {
    reply(comment.postId, comment);
  };

  if (!state.viewed) return null;

  return (
    <div>
      <PostComponent post={state.viewed} open={true} reply={handleReply} loadComments={loadComments} />
    </div>
  );
};

export default Conversation;
