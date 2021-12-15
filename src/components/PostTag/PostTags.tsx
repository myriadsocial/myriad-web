import React, {useEffect, useState} from 'react';

import {Button, List, ListItem, ListItemText} from '@material-ui/core';

import {TagOptions} from '.';
import {useStyles} from './PostTags.styles';

type PostTagsProps = {
  selected: string[];
  options: TagOptions[];
  onConfirm: (selected: string[]) => void;
};

export const PostTags: React.FC<PostTagsProps> = props => {
  const {selected, options, onConfirm} = props;
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
