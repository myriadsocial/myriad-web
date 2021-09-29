import React from 'react';

import {Comment} from '../../../interfaces/comment';
import {CommentListContainer} from '../../atoms/CommentList';
import {TabItems} from '../../atoms/Tabs';

import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

export type CommentTabs = 'discussion' | 'debate';

export const useCommentTabs = (
  post: Post,
  comments?: Comment[],
  debates?: Comment[],
): TabItems<CommentTabs>[] => {
  return [];
  return [
    {
      id: 'discussion',
      title: `Discussion (${post.metric.discussions || 0})`,
      icon: '🤔 ',
      component: <CommentListContainer referenceId={post.id} section={SectionType.DISCUSSION} />,
    },
    {
      id: 'debate',
      title: `Debate (${post.metric.debates || 0})`,
      icon: '😡 ',
      component: (
        <CommentListContainer
          placeholder={'Your downvote will be submitted when you post a comment'}
          referenceId={post.id}
          section={SectionType.DEBATE}
          focus={true}
          expand={true}
        />
      ),
    },
  ];
};
