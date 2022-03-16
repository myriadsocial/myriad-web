import {isUrl} from '@udecode/plate-common';

import React, {useState} from 'react';

import {Button, FormControl, Input, InputLabel} from '@material-ui/core';

import {useStyles} from './EmbedURL.styles';

type EmbedURLProps = {
  prefix?: string;
  onConfirm: (result: string | null) => void;
};

export const EmbedURL: React.FC<EmbedURLProps> = props => {
  const {prefix, onConfirm} = props;
  const styles = useStyles();

  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleUrlChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;

    if (isUrl(url)) {
      setUrl(url);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleConfirm = () => {
    onConfirm(url);
  };

  return (
    <div className={styles.root}>
      <FormControl fullWidth className={styles.input}>
        <InputLabel htmlFor="link-to-file">{prefix} Link URL</InputLabel>
        <Input id="link-to-file" onChange={handleUrlChanged} error={error} />
      </FormControl>
      <Button
        className={styles.confirm}
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConfirm}
        disabled={error || url === null}>
        Confirm
      </Button>
    </div>
  );
};
