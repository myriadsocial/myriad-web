import React, {useEffect, useState} from 'react';

import {List, ListItem, ListItemText} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {TagOptions} from '.';
import {useStyles} from './PostTags.styles';

type PostTagsProps = {
  selected: string[];
  options: TagOptions[];
};

export const PostTags: React.FC<PostTagsProps> = props => {
  const {selected, options} = props;
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

  return (
    <div className={styles.root}>
      <Typography component="div" className={styles.title}>
        Add Tags
      </Typography>
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
    </div>
  );
};
