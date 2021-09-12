import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

import {Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import UploadIcon from '../../../images/Icons/Upload.svg';
import {useStyles} from './Dropzone.styles';

type DropzoneProps = {
  value?: string;
  loading?: boolean;
  accept?: string[];
  onImageSelected: (files: File[]) => void;
};

type FileUploaded = File & {
  preview: string;
};

export const Dropzone: React.FC<DropzoneProps> = props => {
  const {onImageSelected, loading, accept = ['image/*']} = props;
  const styles = useStyles();

  const [, setFiles] = useState<FileUploaded[]>([]);

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    maxFiles: 2000000,
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
  });

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />

        <UploadIcon />

        <Typography>File must be .jpeg or .png</Typography>
      </div>

      {loading && <CircularProgress color="primary" className={styles.loading} />}
    </div>
  );
};
