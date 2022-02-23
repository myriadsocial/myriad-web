import React, {useMemo, useState} from 'react';

import dynamic from 'next/dynamic';

import {Comment} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

const CommentListContainer = dynamic(
  () => import('src/components/CommentList/CommentList.container'),
  {ssr: false},
);

export type CommentTabs = 'discussion' | 'debate';

export const useCommentTabs = (post: Post, comments?: Comment[], debates?: Comment[]) => {
  const [activeTab, setActiveTab] = useState<CommentTabs>('discussion');

  const discussionComponent = useMemo(() => {
    return (
      <CommentListContainer
        placeholder={'Write a Discussion...'}
        referenceId={post.id}
        section={SectionType.DISCUSSION}
      />
    );
  }, [post]);

  const debatesComponent = useMemo(() => {
    return (
      <CommentListContainer
        placeholder={'Your downvote will be submitted after you post a comment'}
        referenceId={post.id}
        section={SectionType.DEBATE}
      />
    );
  }, [post]);

  return {
    activeTab,
    setActiveTab,
    tabs: [
      {
        id: 'discussion',
        title: `Discussion (${post.metric.discussions || 0})`,
        icon: '🤔 ',
        component: discussionComponent,
      },
      {
        id: 'debate',
        title: `Debate (${post.metric.debates || 0})`,
        icon: '😡 ',
        component: debatesComponent,
      },
    ],
  };
};
