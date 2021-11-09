import React from 'react';

import {CommentListContainer} from 'src/components-v2/atoms/CommentList';
import {TabItems} from 'src/components-v2/atoms/Tabs';
import {Comment} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

export type CommentTabs = 'discussion' | 'debate';

export const useCommentTabs = (
  post: Post,
  comments?: Comment[],
  debates?: Comment[],
): TabItems<CommentTabs>[] => {
  return [
    {
      id: 'discussion',
      title: `Discussion (${post.metric.discussions || 0})`,
      icon: '🤔 ',
      component: (
        <CommentListContainer
          placeholder={'Write a Discussion...'}
          referenceId={post.id}
          section={SectionType.DISCUSSION}
        />
      ),
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
