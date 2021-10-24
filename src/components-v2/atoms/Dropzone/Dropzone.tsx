import React, {useState, useEffect} from 'react';
import {FileRejection, useDropzone} from 'react-dropzone';

import {Button, ImageList, ImageListItem, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import UploadIcon from '../../../images/Icons/Upload.svg';
import {Status, Toaster} from '../Toaster';
import {useStyles} from './Dropzone.styles';

import ShowIf from 'src/components/common/show-if.component';

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
    loading = false,
    value,
    accept = ['image/*'],
    maxSize = 20,
    placeholder = 'File must be .jpeg or .png',
  } = props;
  const styles = useStyles();

  const [, setFiles] = useState<FileUploaded[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [error, setError] = useState<FileRejection[] | null>(null);

  useEffect(() => {
    if (value) {
      setPreview(prevPreview => [...prevPreview, value]);
    }
  }, []);

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

      setPreview(acceptedFiles.map(file => URL.createObjectURL(file)));

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

        {preview.length ? (
          <ImageList rowHeight={180} cols={3} className={styles.preview}>
            {preview.map((item, i) => (
              <ImageListItem key={i} cols={2}>
                <img src={item} alt={item} />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <>
            <UploadIcon />

            <Typography>{placeholder}</Typography>

            <Button
              className={styles.button}
              size="small"
              variant={value ? 'outlined' : 'contained'}
              color={value ? 'secondary' : 'primary'}
              onClick={handleReuploadImage}>
              <ShowIf condition={loading}>
                <CircularProgress size="24" color="secondary" style={{marginRight: 12}} />
              </ShowIf>
              {value ? 'Reupload' : 'Upload'} File
            </Button>
          </>
        )}
      </div>

      <Toaster
        open={Boolean(error)}
        toasterStatus={Status.DANGER}
        message={error ? error[0].errors[0].message : ''}
        onClose={closeError}
      />
    </div>
  );
};
