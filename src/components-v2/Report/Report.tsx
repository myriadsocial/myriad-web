import {InformationCircleIcon} from '@heroicons/react/outline';
import {CheckCircleIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';

import {Modal} from '../atoms/Modal';
import {useStyles} from './Report.styles';
import {usePostReportList} from './use-post-report-list.hook';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';

type ReportProps = {
  open: boolean;
  reference: Post | Comment;
  onConfirm: (type: string, description: string) => void;
  onClose: () => void;
};

export const Report: React.FC<ReportProps> = props => {
  const {open, onClose, onConfirm} = props;
  const styles = useStyles();

  const list = usePostReportList();
  const [type, setType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const CHARACTER_LIMIT = 200;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSelectItem = (value: string) => () => {
    setType(value);
  };

  const submitReport = () => {
    if (type) {
      onConfirm(type, description);
    }
  };

  return (
    <Modal title="Report Post" open={open} onClose={onClose} className={styles.root}>
      <Typography variant="h5">Why are you reporting this post?</Typography>
      <Typography variant="subtitle1">Help us understand the problem</Typography>

      <List dense={false} className={styles.list}>
        {list.map(option => (
          <ListItem key={option.id} button selected={type === option.id}>
            <ListItemText primary={option.title} />
            <ListItemSecondaryAction>
              <Radio
                edge="end"
                color="primary"
                onChange={handleSelectItem(option.id)}
                checked={type === option.id}
                checkedIcon={<SvgIcon component={CheckCircleIcon} viewBox="0 0 20 20" />}
                inputProps={{'aria-labelledby': option.id}}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <TextField
        id="report-description"
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        margin="none"
        inputProps={{
          maxlength: CHARACTER_LIMIT,
        }}
        className={styles.description}
        helperText={`${description.length}/${CHARACTER_LIMIT}`}
        onChange={handleChange}
      />

      <Card className={styles.info}>
        <CardMedia>
          <SvgIcon component={InformationCircleIcon} />
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="caption" component="h2">
            Not sure if something breaking the rules?
          </Typography>
          <Link href="#">
            <Typography variant="caption" color="primary" component="a">
              Review Myriad’s content policy
            </Typography>
          </Link>
        </CardContent>
      </Card>

      <div className={styles.action}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={!type || description.length === 0}
          variant="contained"
          color="primary"
          onClick={submitReport}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
