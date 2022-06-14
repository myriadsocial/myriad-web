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
import ShowIf from '../common/show-if.component';
import {useStyles} from './Report.styles';
import {usePostReportList} from './use-post-report-list.hook';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import i18n from 'src/locale';

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
  const [isErrorValidation, setIsErrorValidation] = useState(false);
  const CHARACTER_LIMIT = 200;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSelectItem = (value: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setType(value);
    } else {
      setType(null);
    }
  };

  React.useEffect(() => {
    if (isErrorValidation) {
      if (description.length > 3) {
        setIsErrorValidation(false);
      }
    }
  }, [isErrorValidation, description]);

  const submitReport = () => {
    if (type) {
      if (description.length <= 3) {
        setIsErrorValidation(true);
      } else {
        onConfirm(type, description);
      }
    }
  };

  return (
    <Modal
      title={i18n.t('Post_Comment.Modal_Report.Title')}
      open={open}
      onClose={onClose}
      className={styles.root}>
      <Typography variant="h5">{i18n.t('Post_Comment.Modal_Report.Subtitle_1')}</Typography>
      <Typography variant="subtitle1">{i18n.t('Post_Comment.Modal_Report.Subtitle_2')}</Typography>

      <List dense={false} className={styles.list}>
        {list.map(option => (
          <ListItem
            key={option.id}
            button
            selected={type === option.id}
            onClick={() => setType(option.id)}>
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
        error={isErrorValidation}
        id="report-description"
        label={i18n.t('Post_Comment.Modal_Report.Description_Placeholder')}
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
      <ShowIf condition={isErrorValidation}>
        <Typography gutterBottom variant="caption" component="h2" color="error">
          {i18n.t('Post_Comment.Modal_Report.Description_Validation')}
        </Typography>
      </ShowIf>

      <Card className={styles.info}>
        <CardMedia>
          <SvgIcon component={InformationCircleIcon} />
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="caption" component="h2">
            {i18n.t('Post_Comment.Modal_Report.Footer')}
          </Typography>
          <Link href="/term-of-use" target="_blank">
            <Typography variant="caption" color="primary" component="a">
              {i18n.t('Post_Comment.Modal_Report.Review_Content_Policy')}
            </Typography>
          </Link>
        </CardContent>
      </Card>

      <div className={styles.action}>
        <Button variant="outlined" color="secondary" size="small" onClick={onClose}>
          {i18n.t('General.Cancel')}
        </Button>

        <Button
          disabled={!type || description.length === 0}
          variant="contained"
          size="small"
          color="primary"
          onClick={submitReport}>
          {i18n.t('Post_Comment.Modal_Report.Btn_Confirm')}
        </Button>
      </div>
    </Modal>
  );
};
