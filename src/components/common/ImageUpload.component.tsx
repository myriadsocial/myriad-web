import { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';

import { useImageUpload } from 'src/hooks/use-image-upload.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      position: 'absolute',
      left: 70,
      top: 70,
      zIndex: 10
    },
    label: {
      backgroundColor: fade(theme.palette.primary.main, 0.7)
    },
    preview: {
      position: 'relative'
    },
    icon: {
      color: '#FFF'
    }
  })
);

type Props = {
  value: string;
  preview: React.ReactNode;
  onSelected: (preview: string) => void;
};

export const ImageUpload = ({ onSelected, value, preview }: Props) => {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);
  const { image, uploadImage } = useImageUpload();
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    if (image && isUploading) {
      onSelected(image);
      setUploading(false);
    }
  }, [image, isUploading]);

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      setUploading(true);

      uploadImage(image);
    }
  };

  return (
    <div className={styles.root}>
      <input type="file" ref={uploadFieldRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />

      <InputLabel className={styles.button}>
        <IconButton onClick={selectFile} className={styles.label} disableRipple disableFocusRipple>
          <Edit className={styles.icon} />
        </IconButton>
      </InputLabel>

      {preview}
    </div>
  );
};
