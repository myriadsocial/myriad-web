import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      position: 'absolute',
      left: 40,
      top: 160,
      zIndex: 10
    },
    label: {
      backgroundColor: fade(theme.palette.primary.main, 0.7)
    },
    icon: {
      color: '#FFF'
    }
  })
);

type Props = {
  value: string;
  children: React.ReactNode;
  onSelected: (previewUrl: string) => void;
};

export const ImageUpload = ({ onSelected, value, children }: Props) => {
  const styles = useStyles();

  const uploadFieldRef = React.useRef<HTMLInputElement | null>(null);

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;
    if (!uploadField) {
      return;
    }
    uploadField.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      const imageUrl = URL.createObjectURL(image);

      onSelected(imageUrl);
    }
  };

  return (
    <div className={styles.root}>
      <input type="file" ref={uploadFieldRef} onChange={handleFileChange} style={{ display: 'none' }} />
      <InputLabel className={styles.button}>
        <IconButton onClick={selectFile} className={styles.label} disableRipple disableFocusRipple>
          <Edit className={styles.icon} />
        </IconButton>
      </InputLabel>

      {children}
    </div>
  );
};
