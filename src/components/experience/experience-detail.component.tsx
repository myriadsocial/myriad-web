import React from 'react';
import uniqid from 'uniqid';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import PhotoLayoutIcon from '../../images/photo-layout-light.svg';
import TimelineLayoutIcon from '../../images/timeline-layout-light.svg';
import { Topic, Experience, LayoutType } from '../../interfaces/experience';
import { User } from '../../interfaces/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    details: {
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: '1 0 auto'
    },
    cover: {
      width: 151
    },
    layout: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    check: {
      margin: 0
    },
    avatar: {
      '& > *': {
        margin: theme.spacing(1)
      },
      marginBottom: theme.spacing(2)
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& >*': {
        marginBottom: theme.spacing(1.5)
      }
    },
    active: {
      backgroundColor: '#E849BD'
    }
  })
);

type Props = {
  topics: Topic[];
  people: User[];
  onSave?: (experience: Experience) => void;
};
export default function ExperienceDetail({ topics, people, onSave }: Props) {
  const classes = useStyles();
  const [experience, setExperience] = React.useState<Experience>({
    id: uniqid(),
    title: '',
    description: '',
    selected: false,
    setting: {
      layout: 'timeline',
      topics,
      people
    }
  });

  const setLayout = (layout: LayoutType) => {
    setExperience({
      ...experience,
      setting: {
        ...experience.setting,
        layout
      }
    });
  };

  const setTitle = e => {
    setExperience({
      ...experience,
      title: e.target.value
    });
  };

  const setDescription = e => {
    setExperience({
      ...experience,
      description: e.target.value
    });
  };

  const saveExperience = () => {
    onSave && onSave(experience);
  };

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <Typography>Topics</Typography>
              <Box className={classes.avatar}>
                {experience.setting.topics.map(topic => (
                  <Chip key={topic.id} size="small" label={topic.name} color="primary" />
                ))}
              </Box>
            </Grid>
            <Grid item md={4}>
              <Typography>People</Typography>
              <Box className={classes.avatar}>
                {experience.setting.people.map(item => (
                  <Avatar key={item.id} alt={item.name} src={item.avatar} />
                ))}
              </Box>
            </Grid>

            <Grid item md={5}>
              <form className={classes.form} noValidate autoComplete="off">
                <TextField id="standard-basic" onChange={setTitle} value={experience.title} variant="filled" label="Experience Name" />
                <TextField id="filled-basic" onChange={setDescription} multiline rows={6} label="Description" variant="filled" />
                <Typography>Choose Layout</Typography>
                <div className={classes.layout}>
                  <FormControlLabel
                    className={classes.check}
                    checked={experience.setting.layout === 'timeline'}
                    onChange={() => setLayout('timeline')}
                    control={
                      <Checkbox
                        icon={<TimelineLayoutIcon />}
                        checkedIcon={<TimelineLayoutIcon className={classes.active} />}
                        name="checkedH"
                      />
                    }
                    label=""
                  />

                  <FormControlLabel
                    className={classes.check}
                    checked={experience.setting.layout === 'photo'}
                    onChange={() => setLayout('photo')}
                    control={
                      <Checkbox icon={<PhotoLayoutIcon />} checkedIcon={<PhotoLayoutIcon className={classes.active} />} name="checkedH" />
                    }
                    label=""
                  />
                </div>
                <Button variant="contained" color="primary" onClick={saveExperience}>
                  Save
                </Button>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  );
}
