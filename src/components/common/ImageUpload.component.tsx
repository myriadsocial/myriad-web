import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: 50
    }
  })
);

type Props = {
  value: string;
  onSelected: (file: File) => void;
};

export const FileUpliad = ({ onSelected, value }: Props) => {
  const styles = useStyles();

  const [filePreview, setFilePreview] = useState<string>(value);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      const imageUrl = URL.createObjectURL(image);

      setFilePreview(imageUrl);

      onSelected(image);
    }
  };

  return (
    <div className={styles.root}>
      <input type="file" onChange={handleFileChange} />

      <img style={{ width: '100%' }} src={filePreview} />
    </div>
  );
};
