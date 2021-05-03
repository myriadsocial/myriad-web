import { useState } from 'react';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useConversation, ConversationActionType } from 'src/components/conversation/conversation.context';
import { ExtendedConversation } from 'src/interfaces/conversation';
import * as ConversationAPI from 'src/lib/api/conversation';

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

  return {
    error,
    loading,
    conversations: state.conversations,
    loadConversation: load
  };
};
