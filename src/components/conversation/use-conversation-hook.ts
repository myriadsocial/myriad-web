import { useState } from 'react';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useConversation, ConversationActionType } from 'src/components/conversation/conversation.context';
import { ExtendedConversation } from 'src/interfaces/conversation';
import { Comment, Post } from 'src/interfaces/post';
import * as ConversationAPI from 'src/lib/api/conversation';
import * as PostAPI from 'src/lib/api/post';

export const useConversationHook = (user: WithAdditionalParams<User>) => {
  const { state, dispatch } = useConversation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const conversations: ExtendedConversation[] = await ConversationAPI.load(user.address as string);

      dispatch({
        type: ConversationActionType.LOAD_CONVERSATION,
        payload: conversations
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const setPost = (post: Post) => {
    dispatch({
      type: ConversationActionType.LOAD_CONVERSATION_DETAIL,
      payload: post
    });
  };

  const reply = async (postId: string, comment: Comment) => {
    const data = await PostAPI.reply(postId, comment);

    dispatch({
      type: ConversationActionType.REPLY_CONVERSATION,
      payload: {
        ...data,
        user
      }
    });
  };

  const loadComments = async (postId: string) => {
    const data = await PostAPI.loadComments(postId);

    dispatch({
      type: ConversationActionType.LOAD_REPLY,
      payload: data
    });
  };

  return {
    error,
    loading,
    conversations: state.conversations,
    loadConversation: load,
    setPost,
    reply,
    loadComments
  };
};
