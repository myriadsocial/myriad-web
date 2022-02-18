import React, {useState} from 'react';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {Modal} from '../Modal';
import {useStyles} from './report.style';

import ShowIf from 'src/components/common/show-if.component';
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
  const [isErrorValidation, setIsErrorValidation] = useState(false);

  React.useEffect(() => {
    if (isErrorValidation) {
      if (description.length > 3) {
        setIsErrorValidation(false);
      }
    }
  }, [isErrorValidation, description]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    const payload = {
      referenceType: ReferenceType.USER,
      referenceId: user.id,
      description: description,
    };

    if (description.length <= 3) {
      setIsErrorValidation(true);
    } else {
      onSubmit(payload);
      onClose();
    }
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
          <TextField
            error={isErrorValidation}
            id="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            margin="none"
            inputProps={{
              maxlength: 200,
            }}
            className={style.description}
            helperText={`${description.length}/200`}
            onChange={handleChange}
          />
          <ShowIf condition={isErrorValidation}>
            <Typography gutterBottom variant="caption" component="h2" color="error">
              Must be between 3 to 200 characters
            </Typography>
          </ShowIf>
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
