import React from 'react';
import {useSelector} from 'react-redux';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {NonSelectableExperienceListProps, useStyles} from '.';
import {NonSelectableSimpleCard} from '../atoms/SimpleCard';

import {Empty} from 'src/components/atoms/Empty';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

const NonSelectableExperienceList: React.FC<NonSelectableExperienceListProps> = ({
  isFilterTriggered,
  experiences,
  userExperience,
  user,
  onPreview,
  onFollow,
  onSubscribe,
  onUnsubscribe,
}) => {
  const classes = useStyles();

  const {query} = useQueryParams();

  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);

  if (!experiences.length && isFilterTriggered) {
    return <></>;
  }

  if (!experiences.length && userLogin?.id === (query.id as string)) {
    return (
      <div className={classes.empty}>
        <Typography className={classes.title} component="p">
          Nothing to see here!
        </Typography>
        <div style={{paddingLeft: 8, paddingRight: 8}}>
          <Typography
            className={classes.subtitle}
            align="center"
            color="textSecondary"
            component="p">
            You haven't created any experience yet. Experience allows you to customize various tags
            and people to be shown in your timeline.
          </Typography>
        </div>
      </div>
    );
  }

  if (!experiences.length) {
    return (
      <Empty title="Nothing to see here!" subtitle="This user hasn't created any Experience yet." />
    );
  }

  return (
    <div className={classes.root}>
      {experiences.length > 0 ? (
        experiences.map(item => (
          <div key={item.experience.id}>
            <NonSelectableSimpleCard
              user={user}
              experienceId={item.experience.id}
              userExperience={userExperience}
              title={item.experience.name ?? 'Unnamed Experience'}
              creator={item.experience.user.name ?? 'Unnamed Myrian'}
              ownerId={item.experience.user.id}
              imgUrl={
                item.experience.experienceImageURL ??
                'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg'
              }
              onSubscribe={onSubscribe}
              onUnsubscribe={onUnsubscribe}
              onFollow={onFollow}
              onPreview={onPreview}
            />
          </div>
        ))
      ) : (
        <div className={classes.empty}>
          <Typography className={classes.title} component="p">
            Uh-oh!
          </Typography>
          <Typography className={classes.subtitle} color="textSecondary" component="p">
            No experience found.
          </Typography>
          <Link href={'/experience'}>
            <Button color="primary" variant="contained" size="small">
              Create Experience
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NonSelectableExperienceList;
