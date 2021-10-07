import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {NonSelectableExperienceListProps, useStyles} from '.';
import {NonSelectableSimpleCard} from '../atoms/SimpleCard';

const NonSelectableExperienceList: React.FC<NonSelectableExperienceListProps> = ({
  experiences,
  user,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <NonSelectableSimpleCard
            user={user}
            title={item.experience.name}
            creator={item.experience.user.name}
            imgUrl={item.experience.experienceImageURL || ''}
          />
        </div>
      ))}
      {!experiences.length && (
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
