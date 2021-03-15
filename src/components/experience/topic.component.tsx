import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchComponent from '../common/search.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      color: '#E0E0E0'
    },
    inline: {
      display: 'inline'
    },
    chip: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(2),
      '& > *': {
        margin: theme.spacing(0.5)
      }
    },
    avatar: {
      display: 'flex',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(1)
      },
      marginBottom: theme.spacing(2)
    },
    header: {
      // padding: '0 16px'
    },
    action: {
      width: 265,
      marginBottom: 10,
      textAlign: 'left',
      borderRadius: 20
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
);

export default function TopicComponent() {
  const classes = useStyles();

  const [topics, addTopic] = React.useState<string[]>([]);
  const [experienceChanged, setExperienceChanged] = React.useState(false);

  React.useEffect(() => {
    addTopic(['fun', 'funny', 'lol', 'comedy', 'blockchain', 'cursed']);
  }, []);

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const searchExprerience = value => {
    setExperienceChanged(true);
    addTopic([...topics, value]);
  };

  return (
    <Card className={classes.root}>
      <CardHeader disableTypography className={classes.header} title={<Typography variant="h5">Topic and People</Typography>} />
      <CardContent>
        <SearchComponent onSubmit={searchExprerience} />

        <div className={classes.chip}>
          {topics.map(topic => (
            <Chip key={topic} size="small" label={topic} onDelete={handleDelete} color="primary" />
          ))}
        </div>

        <Box className={classes.avatar}>
          <Avatar alt="Remy Sharp" src="/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="" />
          <Avatar alt="Lauren Philip" src="" />
        </Box>

        <Box className={classes.more}>
          <Button color="secondary">More...</Button>
        </Box>

        <Button disabled={!experienceChanged} className={classes.action} color="primary" size="large" variant="contained">
          Make It An Experience
        </Button>
      </CardContent>
    </Card>
  );
}
