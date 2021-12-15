import {ToolbarImage} from '@udecode/plate-image-ui';

import React, {useState} from 'react';

import {IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Image, VideoLibrary} from '@material-ui/icons';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      color: 'rgb(68,68,68)',

      '& .MuiSvgIcon-root': {
        width: '1.25rem',
      },
    },
    menu: {
      '& .slate-ToolbarButton': {
        width: 'auto',
      },
    },
  }),
);

type ToolbarMediaProps = {
  openImageUpload: (type: 'upload' | 'link') => void;
  openVideoUpload: () => void;
};
export const ToolbarMedia: React.FC<ToolbarMediaProps> = props => {
  const styles = useStyles();
  const {openImageUpload, openVideoUpload} = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openImage = () => {
    handleClose();

    return openImageUpload('upload');
  };

  const openImageLink = () => {
    handleClose();

    return openImageUpload('link');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick} className={styles.media}>
        <Image />
      </IconButton>
      <Menu
        id="image-upload"
        className={styles.menu}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem>
          <ToolbarImage icon={<Typography>Upload Image</Typography>} onMouseDown={openImage} />
        </MenuItem>
        <MenuItem>
          <ToolbarImage icon={<Typography>Image Link</Typography>} onMouseDown={openImageLink} />
        </MenuItem>
      </Menu>

      <ToolbarImage icon={<VideoLibrary />} onMouseDown={openVideoUpload} />
    </>
  );
};
