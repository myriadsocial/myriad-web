import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useTopic } from '../use-topic.hooks';
import { useStyles } from './topic.style';

import SearchComponent from 'src/components/common/autocomplete.component';

type Props = {
  topics: string[];
  people: string[];
  createExperience?: (topics: string[], user: string[]) => void;
  deleteExperience?: () => void;
};

export default function TopicComponent({ topics, people, createExperience, deleteExperience }: Props) {
  const style = useStyles();

  const { topics: options, search } = useTopic();
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = React.useState<string[]>([]);
  const [experienceChanged, setExperienceChanged] = React.useState(false);

  React.useEffect(() => {
    setSelectedTopics(topics);
    setSelectedPeople(people);
  }, [topics, people]);

  const handleDelete = () => {
    console.info('You clicked the delete icon.');

    deleteExperience && deleteExperience();
  };

  const searchExperience = (text: string) => {
    search(text);
  };

  const addTopic = (tag: string) => {
    setSelectedTopics([...selectedTopics, tag]);

    setExperienceChanged(true);
  };

  const saveExperience = () => {
    createExperience && createExperience(selectedTopics, selectedPeople);
  };

  return (
    <Card className={style.root}>
      <CardHeader disableTypography className={style.header} title={<Typography variant="h5">Topic and People</Typography>} />
      <CardContent>
        <SearchComponent title="Search Topics" data={options} search={searchExperience} onSelected={addTopic} />

        <div className={style.chip}>
          {selectedTopics.map((topic, i) => (
            <Chip key={i} size="small" label={topic} onDelete={handleDelete} color="primary" />
          ))}
        </div>

        <Box className={style.avatar}>
          {selectedPeople.map((item, i) => (
            <Avatar key={i} alt={item} src={item} />
          ))}
        </Box>

        <Box className={style.more}>
          <Button color="primary" className={style.show}>
            Show All
            <ExpandMoreIcon />
          </Button>
        </Box>

        <Button
          onClick={saveExperience}
          disabled={!experienceChanged}
          className={style.action}
          color="primary"
          size="large"
          variant="contained">
          Make It An Experience
        </Button>
      </CardContent>
    </Card>
  );
}
