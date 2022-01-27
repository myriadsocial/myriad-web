import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {SearchedExperienceListProps, useStyles} from '.';

import {EmptyResult} from 'src/components/Search/EmptyResult';
import {EmptyContentEnum} from 'src/components/Search/EmptyResult.interfaces';
import {Loading} from 'src/components/atoms/Loading';
import {NonSelectableSimpleCard} from 'src/components/atoms/SimpleCard';

const SearchedExperienceList: React.FC<SearchedExperienceListProps> = ({
  loadNextPage,
  hasMore,
  experiences,
  userExperience,
  onPreview,
  onFollow,
  onSubscribe,
  onUnsubscribe,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <InfiniteScroll
        scrollableTarget="scrollable-searched-experiences"
        dataLength={experiences.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {experiences.length === 0 ? (
          <EmptyResult emptyContent={EmptyContentEnum.EXPERIENCE} />
        ) : (
          experiences.map(experience => (
            <div key={experience.id}>
              <NonSelectableSimpleCard
                ownerId={experience.user.id}
                experienceId={experience.id}
                userExperience={userExperience}
                title={experience.name ?? 'Unnamed Experience'}
                creator={experience.user.name ?? 'Unnamed Myrian'}
                imgUrl={
                  experience.experienceImageURL ??
                  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg'
                }
                onSubscribe={onSubscribe}
                onUnsubscribe={onUnsubscribe}
                onFollow={onFollow}
                onPreview={onPreview}
              />
            </div>
          ))
        )}
      </InfiniteScroll>
    </div>
  );
};

export default SearchedExperienceList;
