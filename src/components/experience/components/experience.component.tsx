import React, { useState, useEffect } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useStyles } from './experience.style';

import ShowIf from 'src/components/common/show-if.component';
import MyriadIcon from 'src/images/myriad-alternative.svg';
import { Experience } from 'src/interfaces/experience';

type Props = {
  title: string;
  selected: Experience | null;
  experiences: Experience[];
  selectExperience: (id: string) => void;
  removeExperience: (id: string) => void;
  loadMore: () => void;
};

export default function ExperienceComponent({ experiences, selected, selectExperience, removeExperience, title, loadMore }: Props) {
  const style = useStyles();

  const [showMore, setShowMore] = useState(false);
  const [remainingExist, setRemainingExist] = useState(false);
  const [showedExperience, setShowedExperience] = useState<Experience[]>([]);
  const [allExperience, setAllExperience] = useState<Experience[]>([]);

  useEffect(() => {
    setAllExperience(experiences);
    setShowedExperience(experiences.slice(0, 4));
    setRemainingExist(experiences.length > 4);
  }, [experiences]);

  const loadMoreExperiance = () => {
    if (showMore) {
      setShowedExperience(allExperience.slice(0, 4));
    } else {
      setShowedExperience(allExperience);
    }

    setShowMore(!showMore);
  };

  return (
    <Card className={style.root}>
      <CardHeader disableTypography className={style.header} title={<Typography variant="caption">{title}</Typography>} />
      <CardContent className={style.content}>
        <List>
          {showedExperience.map(experience => (
            <ListItem
              className={style.item}
              button
              key={experience.id}
              onClick={() => selectExperience(experience.id)}
              selected={experience.id === selected?.id}>
              <ListItemIcon>
                <MyriadIcon />
              </ListItemIcon>
              <ListItemText id={experience.id} primary={experience.name} />
              <ListItemSecondaryAction>
                <Typography className={style.action}>By {experience.user?.name}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <ShowIf condition={remainingExist}>
          <Box className={style.more}>
            <Button color="secondary" className={style.show} onClick={loadMoreExperiance}>
              {showMore ? 'Show Less' : 'Show All'}

              <ExpandMoreIcon className={showMore ? style.expand : style.normal} />
            </Button>
          </Box>
        </ShowIf>
      </CardContent>
    </Card>
  );
}
