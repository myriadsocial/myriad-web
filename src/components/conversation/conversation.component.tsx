import React, { useEffect } from 'react';

import { useSession } from 'next-auth/client';

import { useConversationHook } from './use-conversation-hook';

import { useConversation } from 'src/components/conversation/conversation.context';
import PostComponent from 'src/components/post/post.component';
import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { useToken } from 'src/hooks/use-token.hook';
import { Post } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';

type Props = {
  post: Post;
  user: User;
};

const Conversation = ({ post, user }: Props) => {
  const { state } = useConversation();
  const { setPost } = useConversationHook(user);
  const { tokensReady } = usePolkadotApi();
  const [session] = useSession();
  const userId = session?.user.userId as string;
  const { loadAllUserTokens, userTokens } = useToken(userId);

  useEffect(() => {
    setPost(post);
    loadAllUserTokens();
  }, []);

  if (!state.viewed) return null;

  return (
    <div>
      <PostComponent availableTokens={userTokens} post={state.viewed} balanceDetails={tokensReady.length > 0 ? tokensReady : []} />
    </div>
  );
};

export default Conversation;
