import React from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

interface PreviewImageProps {
  files: {
    file: File;
    preview: string;
  }[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    subtitle: {
      paddingLeft: 0,
      fontSize: 14
    }
  })
);

export const PreviewImageComponent: React.FC<PreviewImageProps> = ({ files }) => {
  const styles = useStyles();

  return (
    <div>
      <GridList cellHeight={200}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader className={styles.subtitle} component="span">
            Added to your post:{' '}
          </ListSubheader>
        </GridListTile>

        {files.map(file => (
          <GridListTile key={file.file.name}>
            <img src={file.preview} alt={file.file.name} />
            <GridListTileBar
              title={file.file.name}
              actionIcon={
                <IconButton aria-label={`info about ${file.file.name}`}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};
