import React from 'react';

import {CommentList} from '../../atoms/CommentList';
import {TabList} from '../../atoms/Tabs';

import {Comment} from 'src/interfaces/comment';

export type CommentTabs = 'discussion' | 'debate';

export const useCommentTabs = (
  comments?: Comment[],
  debates?: Comment[],
): TabList<CommentTabs>[] => {
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
      component: <CommentList comments={debates || []} />,
    },
  ];
};
