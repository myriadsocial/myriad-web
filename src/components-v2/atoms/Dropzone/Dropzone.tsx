import {XIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';
import {FileRejection, useDropzone} from 'react-dropzone';

import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import UploadIcon from '../../../images/Icons/Upload.svg';
import {Status, Toaster} from '../Toaster';
import {useStyles} from './Dropzone.styles';

import ShowIf from 'src/components/common/show-if.component';

type DropzoneProps = {
  value?: string;
  type?: 'image' | 'video';
  placeholder?: string;
  loading?: boolean;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
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
    type = 'image',
    accept = ['image/jpeg', 'image/png'],
    maxSize = 20,
    multiple = false,
    placeholder = 'File must be .jpeg or .png',
  } = props;
  const styles = useStyles();

  const [files, setFiles] = useState<FileUploaded[]>([]);
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
    multiple,
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

  const removeFile = (index: number) => {
    const currentFiles = files.filter((file, i) => index !== i);
    const currentPreview = preview.filter((url, i) => index !== i);

    setFiles(currentFiles);
    setPreview(currentPreview);

    onImageSelected(currentFiles);
  };

  const handleReuploadImage = () => {
    open();
  };

  const closeError = () => {
    setError(null);
  };

  const getCols = (): number => {
    return preview.length === 1 ? 6 : 2;
  };

  const getRows = (): number => {
    const cols = getCols();

    return cols === 6 ? 2 : 1;
  };

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />
        {preview.length ? (
          <>
            <ShowIf condition={type === 'image'}>
              <ImageList rowHeight={112} cols={6} className={styles.preview} gap={10}>
                {files.map((item, i) => (
                  <ImageListItem key={i} cols={getCols()} rows={getRows()}>
                    <img src={item.preview} alt="" className={styles.image} />
                    <ImageListItemBar
                      position="top"
                      style={{background: 'none'}}
                      actionIcon={
                        <IconButton
                          size="small"
                          aria-label={`remove image`}
                          className={styles.icon}
                          onClick={() => removeFile(i)}>
                          <SvgIcon component={XIcon} style={{fontSize: '1rem'}} />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </ShowIf>

            <ShowIf condition={type === 'video'}>
              {files.map((item, i) => (
                <video key={i} controls width="500">
                  <track kind="captions" />
                  <source src={item.preview} type="video/mp4" />
                  <div>Video encoding not supported.</div>
                </video>
              ))}
            </ShowIf>
          </>
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
