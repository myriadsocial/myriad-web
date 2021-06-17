import React, { useEffect } from 'react';

import { useConversationHook } from './use-conversation-hook';

import { useConversation } from 'src/components/conversation/conversation.context';
import PostComponent from 'src/components/post/post.component';
import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { Post } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';

type Props = {
  post: Post;
  user: User;
};

const Conversation = ({ post, user }: Props) => {
  const { state } = useConversation();
  const { setPost } = useConversationHook(user);
  const { tokens } = usePolkadotApi();

  useEffect(() => {
    setPost(post);
  }, []);

  if (!state.viewed) return null;

  return (
    <div>
      <PostComponent post={state.viewed} balanceDetails={tokens.length > 0 ? tokens : []} />
    </div>
  );
};

export default Conversation;
