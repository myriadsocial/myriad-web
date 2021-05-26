import React, { useEffect } from 'react';

import { User } from 'next-auth';

import { useConversationHook } from './use-conversation-hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useConversation } from 'src/components/conversation/conversation.context';
import PostComponent from 'src/components/timeline/post/post.component';
import { Post } from 'src/interfaces/post';

type Props = {
  post: Post;
  user: WithAdditionalParams<User>;
};

const Conversation = ({ post, user }: Props) => {
  const { state } = useConversation();
  const { setPost } = useConversationHook(user);

  useEffect(() => {
    setPost(post);
  }, []);

  if (!state.viewed) return null;

  return (
    <div>
      <PostComponent post={state.viewed} open={true} />
    </div>
  );
};

export default Conversation;
