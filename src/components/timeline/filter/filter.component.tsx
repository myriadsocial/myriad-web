import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';

import {TimelineSortMethod} from 'src/interfaces/timeline';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0, 4, 0),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

type Props = {
  selected: TimelineSortMethod;
  onChange: (sort: TimelineSortMethod) => void;
};

export default function FilterTimelineComponent({selected, onChange}: Props) {
  const styles = useStyles();

  const handleSort = (sort: TimelineSortMethod) => {
    onChange(sort);
  };

  return (
    <div className={styles.root} id="filter-timeline">
      <div style={{padding: 8}}>
        <Typography variant="h4" style={{marginBottom: 8}}>
          {'Timeline'}
        </Typography>
      </div>

      <div>
        <Button variant="contained" className={styles.button} endIcon={<SortIcon />}>
          Sort By
        </Button>
        <Button
          variant="contained"
          color={selected === 'created' ? 'primary' : 'default'}
          className={styles.button}
          onClick={() => handleSort('created')}>
          Date Posted
        </Button>
        <Button
          variant="contained"
          color={selected === 'like' ? 'primary' : 'default'}
          className={styles.button}
          onClick={() => handleSort('like')}>
          Most Liked
        </Button>
        <Button
          variant="contained"
          color={selected === 'comment' ? 'primary' : 'default'}
          className={styles.button}
          onClick={() => handleSort('comment')}>
          Most Commented
        </Button>
      </div>
    </div>
  );
}
