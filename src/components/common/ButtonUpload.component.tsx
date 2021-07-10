import { useRef } from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      paddingTop: theme.spacing(1),
      paddingRight: 24,
      paddingBottom: theme.spacing(1),
      paddingLeft: 24,
      borderRadius: theme.spacing(1)
    }
  })
);

type ButtonUploadProps = {
  title: string;
  accept: 'image' | 'video' | 'file';
  loading?: boolean;
  onImageSelected: (file: File) => void;
};

export const ButtonUpload: React.FC<ButtonUploadProps & ButtonProps> = ({ onImageSelected, title, accept, loading, ...props }) => {
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
      <input type="file" ref={uploadFieldRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
      <Button {...props} className={styles.button} onClick={selectFile}>
        {title}
      </Button>
    </div>
  );
};
