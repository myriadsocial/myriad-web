import React, {useCallback, useRef, useState} from 'react';

import {PostDetail} from './PostDetail';
import {PostDetailContainerProps} from './PostDetail.interface';

import {useCommentTabs} from 'components/PostDetail/hooks/use-comment-tabs';
import {TabsComponent} from 'components/atoms/Tabs';
import ShowIf from 'components/common/show-if.component';
import {SectionType} from 'src/interfaces/interaction';

export const PostDetailContainer: React.FC<PostDetailContainerProps> = props => {
  const {post, onToggleDownvote} = props;

  const ref = useRef<HTMLDivElement>(null);

  const {
    selected: selectedCommentTab,
    setSelected: setSelectedCommentTab,
    tabs,
  } = useCommentTabs(post, ref);

  const [showComment, setShowComment] = useState(false);

  const toggleDownvotePost = useCallback(() => {
    onToggleDownvote(post);

    setShowComment(true);
  }, []);

  const handleShowComment = useCallback(() => {
    setShowComment(true);
  }, []);

  const handleChangeTab = useCallback((tab: SectionType) => {
    setSelectedCommentTab(tab);

    onToggleDownvote(null);
  }, []);

  return (
    <div ref={ref}>
      <PostDetail
        {...props}
        onToggleDownvote={toggleDownvotePost}
        onShowComment={handleShowComment}
      />

      <ShowIf condition={showComment}>
        <TabsComponent<SectionType>
          tabs={tabs}
          position="space-evenly"
          selected={selectedCommentTab as SectionType}
          onChangeTab={handleChangeTab}
        />
      </ShowIf>
    </div>
  );
};
