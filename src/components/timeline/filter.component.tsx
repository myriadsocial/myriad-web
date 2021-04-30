import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { usePost } from './use-post.hook';

import { PostSortMethod } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
    },
    group: {
      flexDirection: 'row'
    }
  })
);

export default function FilterTimelineComponent() {
  const styles = useStyles();

  const { sort, sortBy } = usePost();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sort = event.target.value as PostSortMethod;

    sortBy(sort);
  };

  return (
    <FormControl component="fieldset" className={styles.root}>
      <FormLabel component="legend">Sort My Timeline By</FormLabel>
      <RadioGroup className={styles.group} aria-label="sort" name="sort" value={sort} onChange={handleChange}>
        <FormControlLabel value="created" control={<Radio />} label="Chronological Order" />
        <FormControlLabel value="like" control={<Radio />} label="Most Like" />
        <FormControlLabel value="comment" control={<Radio />} label="Most Commented" />
        <FormControlLabel value="trending" disabled control={<Radio />} label="Trending" />
      </RadioGroup>
    </FormControl>
  );
}
