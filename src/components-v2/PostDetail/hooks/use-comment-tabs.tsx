import React from 'react';

import {CommentList} from '../../atoms/CommentList';
import {TabItems} from '../../atoms/Tabs';

import {Comment} from 'src/interfaces/comment';

export type CommentTabs = 'discussion' | 'debate';

export const useCommentTabs = (
  comments?: Comment[],
  debates?: Comment[],
): TabItems<CommentTabs>[] => {
  return [];
  return [
    {
      id: 'discussion',
      title: `Discussion (${comments?.length || 0})`,
      icon: '🤔 ',
      component: <CommentList comments={comments || []} />,
    },
    {
      id: 'debate',
      title: `Debate (${debates?.length || 0})`,
      icon: '😡 ',
      component: (
        <CommentList
          placeholder={'Your downvote will be submitted when you post a comment'}
          comments={debates || []}
          focus
          expand
        />
      ),
    },
  ];
};
