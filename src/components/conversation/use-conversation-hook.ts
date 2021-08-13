import {useState} from 'react';

import {
  useConversation,
  ConversationActionType,
} from 'src/components/conversation/conversation.context';
import {CommentProps} from 'src/interfaces/comment';
import {ExtendedConversation} from 'src/interfaces/conversation';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as CommentAPI from 'src/lib/api/comment';
import * as ConversationAPI from 'src/lib/api/conversation';

export const useConversationHook = (user: User) => {
  const {state, dispatch} = useConversation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const conversations: ExtendedConversation[] = await ConversationAPI.load(user.id);

      //TODO: change this when post have text
      const posts = await Promise.all(
        conversations.map(async conversation => {
          // if (conversation.post.id) {
          //   const comments = await PostAPI.loadComments(conversation.post.id);

          //   conversation.post.comments = comments;
          // }

          return conversation;
        }),
      );

      dispatch({
        type: ConversationActionType.LOAD_CONVERSATION,
        payload: posts,
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
      payload: post,
    });
  };

  const reply = async (comment: CommentProps) => {
    const data = await CommentAPI.reply(comment);

    dispatch({
      type: ConversationActionType.REPLY_CONVERSATION,
      payload: {
        ...data,
        user,
      },
    });
  };

  const loadComments = async (postId: string) => {
    const {data} = await CommentAPI.loadComments(postId);

    dispatch({
      type: ConversationActionType.LOAD_REPLY,
      payload: data,
    });
  };

  return {
    error,
    loading,
    conversations: state.conversations,
    loadConversation: load,
    setPost,
    reply,
    loadComments,
  };
};
