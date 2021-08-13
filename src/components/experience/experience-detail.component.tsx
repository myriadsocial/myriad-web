import React from 'react';

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

import {useStyles} from './experience-detail.style';

import PhotoLayoutIcon from 'src/images/photo-layout-light.svg';
import TimelineLayoutIcon from 'src/images/timeline-layout-light.svg';
import {Experience, LayoutType} from 'src/interfaces/experience';

type Props = {
  data: Experience;
  onSave?: (experience: Experience) => void;
};

export default function ExperienceDetail({data, onSave}: Props) {
  const style = useStyles();

  const [experience, setExperience] = React.useState<Experience>(data);

  const setLayout = (layout: LayoutType) => {
    setExperience({
      ...experience,
      layout,
    });
  };

  const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperience({
      ...experience,
      name: e.target.value,
    });
  };

  const setDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperience({
      ...experience,
      description: e.target.value,
    });
  };

  const saveExperience = () => {
    onSave && onSave(experience);
  };

  return (
    <Card className={style.root}>
      <div className={style.details}>
        <CardContent className={style.content}>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <Typography>Topics</Typography>
              <Box className={style.avatar}>
                {experience.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    size="small"
                    label={tag.id}
                    color={tag.hide ? 'secondary' : 'primary'}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item md={3}>
              <Typography>People</Typography>
              <Box className={style.avatar}>
                {experience.people.map((people, i) => (
                  <Avatar
                    key={i}
                    alt={people.username}
                    src={`https://res.cloudinary.com/dsget80gs/image/${
                      people.platform || 'facebook'
                    }/${people.originUserId}.jpg`}
                    className={style.inline}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item md={6}>
              <form className={style.form} noValidate autoComplete="off">
                <TextField
                  onChange={setTitle}
                  value={experience.name}
                  variant="filled"
                  color="secondary"
                  label="Experience Name"
                />
                <TextField
                  onChange={setDescription}
                  value={experience.description}
                  multiline
                  rows={6}
                  variant="filled"
                  color="secondary"
                  label="Description"
                />
                <Typography>Choose Layout</Typography>
                <div className={style.layout}>
                  <FormControlLabel
                    className={style.check}
                    checked={experience.layout === 'timeline'}
                    onChange={() => setLayout('timeline')}
                    control={
                      <Checkbox
                        icon={<TimelineLayoutIcon />}
                        checkedIcon={<TimelineLayoutIcon className={style.active} />}
                        name="checkedH"
                      />
                    }
                    label=""
                  />

                  <FormControlLabel
                    className={style.check}
                    checked={experience.layout === 'photo'}
                    onChange={() => setLayout('photo')}
                    control={
                      <Checkbox
                        icon={<PhotoLayoutIcon />}
                        checkedIcon={<PhotoLayoutIcon className={style.active} />}
                        name="checkedH"
                      />
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
