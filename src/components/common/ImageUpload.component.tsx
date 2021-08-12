import React, {useEffect, useRef, useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import {createStyles, makeStyles, Theme, fade} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';

import {useImageUpload} from 'src/hooks/use-image-upload.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      position: 'absolute',
      left: 70,
      top: 70,
      zIndex: 10,
    },
    label: {
      backgroundColor: fade(theme.palette.primary.main, 0.7),
    },
    preview: {
      height: 72,
      width: 72,
      position: 'absolute',
      top: 46,
      left: 16,
    },
    loading: {
      position: 'absolute',
      top: 62,
      left: 32,
    },
    icon: {
      color: '#FFF',
    },
  }),
);

type Props = {
  value: string;
  loading?: boolean;
  title?: string;
  onImageSelected: (preview: string) => void;
};

export const ImageUpload = ({onImageSelected, value, loading, title}: Props) => {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);
  const {image, uploadImage} = useImageUpload();
  const [isUploading, setUploading] = useState(false);

  // upload image to storage
  useEffect(() => {
    if (image) {
      onImageSelected(image);
      setUploading(false);
    }
  }, [image]);

  // reset the form & upload state
  useEffect(() => {
    if (!isUploading && uploadFieldRef && uploadFieldRef.current) {
      uploadFieldRef.current.value = '';
    }
  }, [isUploading, uploadFieldRef]);

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      setUploading(true);

      await uploadImage(image);

      setUploading(false);
    }
  };

  const getPreviewImage = (): string => {
    return image ?? value;
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
      <InputLabel className={styles.button}>
        <IconButton onClick={selectFile} className={styles.label} disableRipple disableFocusRipple>
          <Edit className={styles.icon} />
        </IconButton>
      </InputLabel>

      <Avatar src={getPreviewImage()} className={styles.preview} alt={title}>
        {title}
      </Avatar>

      {(loading || isUploading) && <CircularProgress color="primary" className={styles.loading} />}
    </div>
  );
};
