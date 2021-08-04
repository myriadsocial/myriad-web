import React from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import red from '@material-ui/core/colors/red';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import {UpoadedFile} from 'src/interfaces/post';

interface PreviewImageProps {
  files: UpoadedFile[];
  onRemoveItem: (index: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    subtitle: {
      paddingLeft: theme.spacing(0),
      fontSize: 14,
    },
    delete: {
      color: red[500],
    },
  }),
);

export const PreviewImageComponent: React.FC<PreviewImageProps> = ({files, onRemoveItem}) => {
  const styles = useStyles();

  return (
    <div>
      <GridList cellHeight={200}>
        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
          <ListSubheader className={styles.subtitle} component="span">
            Added to your post:{' '}
          </ListSubheader>
        </GridListTile>

        {files.map((file, index) => (
          <GridListTile key={file.file.name}>
            <img src={file.preview} alt={file.file.name} />
            <GridListTileBar
              title={file.file.name}
              titlePosition="top"
              actionIcon={
                <IconButton
                  className={styles.delete}
                  aria-label={`info about ${file.file.name}`}
                  onClick={() => onRemoveItem(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};
