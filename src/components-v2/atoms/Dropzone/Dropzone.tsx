import React, {useState} from 'react';
import {FileRejection, useDropzone} from 'react-dropzone';

import {Button, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import UploadIcon from '../../../images/Icons/Upload.svg';
import {Status, Toaster} from '../toaster';
import {useStyles} from './Dropzone.styles';

type DropzoneProps = {
  value?: string;
  placeholder?: string;
  loading?: boolean;
  accept?: string[];
  maxSize?: number;
  onImageSelected: (files: File[]) => void;
};

type FileUploaded = File & {
  preview: string;
};

export const Dropzone: React.FC<DropzoneProps> = props => {
  const {
    onImageSelected,
    loading,
    value,
    accept = ['image/*'],
    maxSize = 20,
    placeholder = 'File must be .jpeg or .png',
  } = props;
  const styles = useStyles();

  const [, setFiles] = useState<FileUploaded[]>([]);
  const [error, setError] = useState<FileRejection[] | null>(null);

  const {getRootProps, getInputProps, open} = useDropzone({
    accept,
    maxSize: maxSize * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );

      onImageSelected(acceptedFiles);
    },
    onDropRejected: rejection => {
      setError(rejection);
    },
  });

  const handleReuploadImage = () => {
    open();
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />

        {value ? (
          <div className={styles.preview}>
            <img src={value} alt="experience icon" />
          </div>
        ) : (
          <>
            <UploadIcon />

            <Typography>{placeholder}</Typography>
          </>
        )}

        <Button
          className={styles.button}
          size="small"
          variant={value ? 'outlined' : 'contained'}
          color={value ? 'secondary' : 'primary'}
          onClick={handleReuploadImage}>
          {value ? 'Reupload' : 'Upload'} File
        </Button>
      </div>
      <Toaster
        open={Boolean(error)}
        toasterStatus={Status.DANGER}
        message="File too large"
        onClose={closeError}
      />
      {loading && <CircularProgress color="primary" className={styles.loading} />}
    </div>
  );
};
