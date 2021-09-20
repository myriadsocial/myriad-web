import {XCircleIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';

import {Button, IconButton, List, ListItem, ListItemText, SvgIcon} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {TagOptions} from '.';
import {useStyles} from './PostTags.styles';

type PostTagsProps = {
  selected: string[];
  options: TagOptions[];
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
};

export const PostTags: React.FC<PostTagsProps> = props => {
  const {selected, options, onClose, onConfirm} = props;
  const styles = useStyles();

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTags(selected);
  }, [selected]);

  const handleSelectItem = (value: string) => () => {
    if (tags.includes(value)) {
      setTags(tags.filter(tag => tag !== value));
    } else {
      setTags(prevTags => [...prevTags, value]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tags);
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography color="textPrimary">NSFW tags</Typography>
        <IconButton
          color="secondary"
          aria-label="close"
          size="small"
          className={styles.close}
          onClick={onClose}>
          <SvgIcon component={XCircleIcon} color="primary" fontSize="medium" />
        </IconButton>
      </div>
      <List dense={false} className={styles.list}>
        {options.map(option => (
          <ListItem
            key={option.id}
            button
            onClick={handleSelectItem(option.id)}
            selected={tags.includes(option.id)}>
            <ListItemText primary={option.title} />
          </ListItem>
        ))}
      </List>
      <Button fullWidth variant="contained" color="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  );
};
