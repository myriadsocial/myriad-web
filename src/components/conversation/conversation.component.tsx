import React, {useEffect} from 'react';

import {useSession} from 'next-auth/client';

import {useConversationHook} from './use-conversation-hook';

import {useConversation} from 'src/components/conversation/conversation.context';
import PostComponent from 'src/components/post/post.component';
import {useToken} from 'src/hooks/use-token.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

type Props = {
  post: Post;
  user: User;
};

const Conversation = ({post, user}: Props) => {
  const {state} = useConversation();
  const {setPost} = useConversationHook(user);
  const [session] = useSession();
  const userId = session?.user.userId as string;
  const {loadAllUserTokens} = useToken(userId);

  useEffect(() => {
    setPost(post);
    loadAllUserTokens();
  }, []);

  if (!state.viewed) return null;

  return (
    <div>
      <PostComponent post={state.viewed} tippingClicked={() => console.log('clicked')} />
    </div>
  );
};

export default Conversation;
