import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';

import { PostSortMethod } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0, 4, 0)
    },
    button: {
      margin: theme.spacing(1)
    }
  })
);

type Props = {
  selected: PostSortMethod;
  onChange: (sort: PostSortMethod) => void;
};

export default function FilterTimelineComponent({ selected, onChange }: Props) {
  const styles = useStyles();

  const handleSort = (sort: PostSortMethod) => {
    onChange(sort);
  };

  return (
    <div className={styles.root}>
      <div style={{ padding: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          {'Timeline'}
        </Typography>
      </div>

      <div>
        <Button variant="contained" color="primary" className={styles.button} endIcon={<SortIcon />}>
          Sort By
        </Button>
        <Button variant="contained" color="default" className={styles.button} onClick={() => handleSort('created')}>
          Date Posted
        </Button>
        <Button variant="contained" color="default" className={styles.button} onClick={() => handleSort('like')}>
          Most Like
        </Button>
        <Button variant="contained" color="default" className={styles.button} onClick={() => handleSort('comment')}>
          Most Commented
        </Button>
      </div>
    </div>
  );
}
