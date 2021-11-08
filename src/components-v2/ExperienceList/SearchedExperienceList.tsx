import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {SearchedExperienceListProps, useStyles} from '.';
import {NonSelectableSimpleCard} from '../atoms/SimpleCard';

const SearchedExperienceList: React.FC<SearchedExperienceListProps> = ({
  experiences,
  user,
  onPreview,
  onFollow,
  onSubscribe,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {experiences.length === 0 && (
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
      {experiences.length > 0 &&
        experiences.map(experience => (
          <div key={experience.id}>
            <NonSelectableSimpleCard
              user={user}
              experienceId={experience.id}
              title={experience.name ?? 'Unnamed Experience'}
              creator={experience.user.name ?? 'Unnamed Myrian'}
              imgUrl={
                experience.experienceImageURL ??
                'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg'
              }
              onSubscribe={onSubscribe}
              onFollow={onFollow}
              onPreview={onPreview}
            />
          </div>
        ))}
    </div>
  );
};

export default SearchedExperienceList;
