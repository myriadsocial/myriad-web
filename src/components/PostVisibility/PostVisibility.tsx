import {CheckCircleIcon} from '@heroicons/react/solid';

import React, {useState, useEffect} from 'react';

import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import {Modal} from '../atoms/Modal';
import {useStyles} from './postVisibility.styles';
import {usePostVisibilityList} from './use-post-visibility-list.hook';

import {Post, PostVisibility as Visibility} from 'src/interfaces/post';
import i18n from 'src/locale';

type ReportProps = {
  open: boolean;
  reference: Post;
  onVisibility: (type: string) => void;
  onClose: () => void;
};

export const PostVisibility: React.FC<ReportProps> = props => {
  const {open, onClose, onVisibility, reference} = props;
  const styles = useStyles();

  const list = usePostVisibilityList();
  const [type, setType] = useState<Visibility | null>(null);

  useEffect(() => {
    reference.visibility && setType(reference.visibility);
  }, []);

  const handleSelectItem =
    (value: Visibility | string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const type = value as Visibility;
        setType(type);
      } else {
        setType(null);
      }
    };

  const handlePostVisibility = () => {
    if (type) {
      onVisibility(type);
    }
  };

  return (
    <Modal
      title={i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Header')}
      open={open}
      onClose={onClose}
      className={styles.root}>
      <Typography variant="h5">
        {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Title')}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" className={styles.fontSize}>
        {reference.visibility === Visibility.FRIEND
          ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Friend')
          : reference.visibility === Visibility.PRIVATE
          ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Private')
          : i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Everyone')}
      </Typography>

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

      <div className={styles.info}>
        <Typography variant="subtitle1" color="textSecondary" className={styles.fontSize}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Tipping_Warning')}
        </Typography>
      </div>

      <div className={styles.action}>
        <Button variant="outlined" color="secondary" size="small" onClick={onClose}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Cancel')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handlePostVisibility}
          disabled={reference.visibility === type}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm')}
        </Button>
      </div>
    </Modal>
  );
};
