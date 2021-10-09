import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/SimpleCard';

import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  isOnHomePage = false,
  user,
  filterTimeline,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  //TODO: still unable to only select one experience card
  const handleClick = () => {
    setSelected(!selected);
  };

  const handleFilterTimeline = (experience: Experience) => (type: TimelineType) => {
    filterTimeline(type, experience);
  };

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <SimpleCard
            filterTimeline={handleFilterTimeline(item.experience)}
            user={user}
            onClick={handleClick}
            title={item.experience.name}
            creator={item.experience.user.name}
            imgUrl={item.experience.experienceImageURL || ''}
            isSelectable={isOnHomePage}
          />
        </div>
      ))}
      {!experiences.length && (
        <div className={classes.empty}>
          <Typography className={classes.title} component="p">
            Uh-oh!
          </Typography>
          <Typography className={classes.subtitle} color="textSecondary" component="p">
            It seems you don’t have an experience yet
          </Typography>
          <Link href={'/experience/create'}>
            <Button color="primary" variant="contained" size="small">
              Create Experience
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExperienceList;
