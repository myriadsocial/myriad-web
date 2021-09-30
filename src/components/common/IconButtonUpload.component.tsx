import {CameraIcon} from '@heroicons/react/outline';

import React, {useRef} from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'absolute',
      justifyContent: 'flex-end',
    },
    wrapper: {
      margin: theme.spacing(1),
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
  }),
);

type ButtonUploadProps = {
  title: string;
  accept: 'image' | 'video' | 'file';
  loading?: boolean;
  onImageSelected: (file: File) => void;
};

export const IconButtonUpload: React.FC<ButtonUploadProps> = ({
  onImageSelected,
  accept,
  loading,
}) => {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageSelected(event.target.files[0]);

      if (uploadFieldRef && uploadFieldRef.current) {
        uploadFieldRef.current.value = '';
      }
    }
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
          onClick={selectFile}
          disabled={loading}
          classes={{root: styles.action}}
          aria-label="upload-background">
          <SvgIcon component={CameraIcon} viewBox="0 0 24 24" />
        </IconButton>
        {loading && (
          <CircularProgress size={24} color="primary" className={styles.buttonProgress} />
        )}
      </div>
    </div>
  );
};
