import {CheckCircleIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

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

type PostVisibilityProps = {
  open: boolean;
  reference: Post;
  onVisibilityChanged: (type: string) => void;
  onClose: () => void;
};

export const PostVisibility: React.FC<PostVisibilityProps> = props => {
  const {open, onClose, onVisibilityChanged, reference} = props;
  const styles = useStyles();

  const list = usePostVisibilityList();
  const [visibility, setVisibility] = useState<Visibility>(reference.visibility);

  const handleSelectItem =
    (value: Visibility | string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const type = value as Visibility;
        setVisibility(type);
      } else {
        setVisibility(null);
      }
    };

  const handlePostVisibility = () => {
    onVisibilityChanged(visibility);
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
          <ListItem key={option.id} button selected={visibility === option.id}>
            <ListItemText primary={option.title} />
            <ListItemSecondaryAction>
              <Radio
                edge="end"
                color="primary"
                onChange={handleSelectItem(option.id)}
                checked={visibility === option.id}
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
          disabled={reference.visibility === visibility}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm')}
        </Button>
      </div>
    </Modal>
  );
};
