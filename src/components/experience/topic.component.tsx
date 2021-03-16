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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchComponent from '../common/search.component';
import { Topic } from '../../interfaces/experience';
import { User } from '../../interfaces/user';

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
    },
    show: {
      color: '#E849BD'
    }
  })
);

type Props = {
  topics: Topic[];
  people: User[];
  createExperience?: (topics: Topic[], user: User[]) => void;
};

export default function TopicComponent({ topics, people, createExperience }: Props) {
  const classes = useStyles();

  const [selectedTopics, setSelectedTopics] = React.useState(topics);
  const [selectedPeople] = React.useState(people);
  const [experienceChanged, setExperienceChanged] = React.useState(false);

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const searchExprerience = (name: string) => {
    setSelectedTopics([
      ...selectedTopics,
      {
        id: 'string',
        name,
        active: false
      }
    ]);
    setExperienceChanged(true);
  };

  const saveExperience = () => {
    createExperience && createExperience(selectedTopics, selectedPeople);
  };

  return (
    <Card className={classes.root}>
      <CardHeader disableTypography className={classes.header} title={<Typography variant="h5">Topic and People</Typography>} />
      <CardContent>
        <SearchComponent onSubmit={searchExprerience} />

        <div className={classes.chip}>
          {selectedTopics.map(topic => (
            <Chip key={topic.id} size="small" label={topic.name} onDelete={handleDelete} color="primary" />
          ))}
        </div>

        <Box className={classes.avatar}>
          {selectedPeople.map(item => (
            <Avatar key={item.id} alt={item.name} src={item.avatar} />
          ))}
        </Box>

        <Box className={classes.more}>
          <Button color="primary" className={classes.show}>
            Show All
            <ExpandMoreIcon />
          </Button>
        </Box>

        <Button
          onClick={saveExperience}
          disabled={!experienceChanged}
          className={classes.action}
          color="primary"
          size="large"
          variant="contained">
          Make It An Experience
        </Button>
      </CardContent>
    </Card>
  );
}
