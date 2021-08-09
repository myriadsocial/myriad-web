import React, {useRef} from 'react';

import Button, {ButtonProps} from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
  }),
);

type ButtonUploadProps = {
  title: string;
  accept: 'image' | 'video' | 'file';
  loading?: boolean;
  onImageSelected: (file: File) => void;
};

export const ButtonUpload: React.FC<ButtonUploadProps & ButtonProps> = ({
  onImageSelected,
  title,
  accept,
  loading,
  ...props
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
        <Button {...props} onClick={selectFile} disabled={loading}>
          {title}
        </Button>
        {loading && (
          <CircularProgress size={24} color="primary" className={styles.buttonProgress} />
        )}
      </div>
    </div>
  );
};
