import React, {useState} from 'react';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';

import {Modal} from '../Modal';
import {useStyles} from './report.style';

import {ReferenceType} from 'src/interfaces/interaction';
import {ReportProps} from 'src/interfaces/report';
import {User} from 'src/interfaces/user';

export type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ReportProps) => void;
};

export const ReportComponent: React.FC<Props> = props => {
  const {open, onClose, user, onSubmit} = props;
  const style = useStyles();
  const [description, setDescription] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    const payload = {
      referenceType: ReferenceType.USER,
      referenceId: user.id,
      description: description,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal title="Report User" onClose={onClose} open={open}>
      <div className={style.root}>
        <Typography variant="h5" gutterBottom={true} style={{fontWeight: 600}}>
          Why are you reporting&nbsp;
          <Typography variant="h5" component="span" color="primary" style={{fontWeight: 600}}>
            {user.name}
          </Typography>
          ?
        </Typography>

        <Typography variant="caption" color="textSecondary" gutterBottom={true} component="div">
          Help us understand the problem
        </Typography>

        <div className={style.box}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="description">Description</InputLabel>
            <OutlinedInput
              id="description"
              placeholder="this person post something bad about our president "
              onChange={handleChange}
              value={description}
              labelWidth={80}
              inputProps={{maxLength: 200}}
              multiline
              rows={4}
            />
          </FormControl>
          <Typography variant="caption" className={style.count} component="span">
            ({description.length}/200)
          </Typography>
        </div>
        <Grid container justifyContent="space-between">
          <Button onClick={onClose} size="small" variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="small" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </div>
    </Modal>
  );
};
