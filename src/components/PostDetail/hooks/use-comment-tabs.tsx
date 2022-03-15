import React, {useMemo, useState} from 'react';

import dynamic from 'next/dynamic';

import {TabItems, TabHookProps} from 'src/components/atoms/Tabs';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

const CommentListContainer = dynamic(
  () => import('src/components/CommentList/CommentList.container'),
  {ssr: false},
);

export const useCommentTabs = (post?: Post): TabHookProps<SectionType> => {
  const [selected, setSelected] = useState<SectionType>(SectionType.DISCUSSION);

  const tabs: TabItems<SectionType>[] = useMemo(() => {
    if (!post) return [];

    return [
      {
        id: SectionType.DISCUSSION,
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
        id: SectionType.DEBATE,
        title: `Debate (${post.metric.debates || 0})`,
        icon: '😡 ',
        component: (
          <CommentListContainer
            placeholder={'Your downvote will be submitted after you post a comment'}
            referenceId={post.id}
            section={SectionType.DEBATE}
          />
        ),
      },
    ];
  }, [post]);

  return {
    selected,
    setSelected,
    tabs,
  };
};
