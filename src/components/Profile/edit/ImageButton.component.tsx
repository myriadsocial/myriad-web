import {CameraIcon} from '@heroicons/react/outline';

import React, {useRef} from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {User} from '../../../interfaces/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'absolute',
      justifyContent: 'flex-end',
      right: 0,
      bottom: 0,
    },
    wrapper: {
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    action: {
      background: theme.palette.primary.main,
      color: '#FFF',
      '&:hover': {
        color: theme.palette.primary.main,
        background: 'rgba(255, 255, 255, 0.8)',
      },
      padding: '4px',
    },
    menu: {
      borderRadius: '10px',
      marginTop: '8px',
    },
    delete: {
      color: '#FE3636',
    },
  }),
);

type ButtonUploadProps = {
  title: string;
  accept: 'image' | 'video' | 'file';
  loading?: boolean;
  onImageSelected: (file: File) => void;
  removePicture: (image: Partial<User>) => void;
};

export const ImageButton: React.FC<ButtonUploadProps> = ({
  onImageSelected,
  accept,
  loading,
  removePicture,
}) => {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageSelected(event.target.files[0]);

      if (uploadFieldRef && uploadFieldRef.current) {
        uploadFieldRef.current.value = '';
      }
    }
  };

  const handleRemovePicture = () => {
    removePicture({profilePictureURL: ''});
    handleClose();
  };

  return (
    <div className={styles.root}>
      <input
        type="file"
        ref={uploadFieldRef}
        onChange={handleFileChange}
        style={{display: 'none'}}
        accept="image/*"
      />
      <div className={styles.wrapper}>
        <IconButton
          onClick={handleClick}
          disabled={loading}
          classes={{root: styles.action}}
          aria-label="upload-background">
          <SvgIcon component={CameraIcon} viewBox="0 0 24 24" />
        </IconButton>
        {loading && (
          <CircularProgress size={24} color="primary" className={styles.buttonProgress} />
        )}
      </div>
      <Menu
        classes={{
          paper: styles.menu,
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={selectFile}>Change picture</MenuItem>
        <MenuItem onClick={handleRemovePicture} className={styles.delete}>
          Remove picture
        </MenuItem>
      </Menu>
    </div>
  );
};
