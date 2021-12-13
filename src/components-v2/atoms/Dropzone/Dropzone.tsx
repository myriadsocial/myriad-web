import {XIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';
import {ErrorCode, FileError, FileRejection, useDropzone} from 'react-dropzone';

import {
  Button,
  capitalize,
  IconButton,
  ImageList,
  ImageListItem,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {Status, Toaster} from '../Toaster';
import {useStyles} from './Dropzone.styles';

import {detect} from 'detect-browser';
import muxjs from 'mux.js';
import ShowIf from 'src/components-v2/common/show-if.component';
import UploadIcon from 'src/images/Icons/Upload.svg';
import ImagePlaceholder from 'src/images/Icons/myriad-grey.svg';

type DropzoneProps = {
  value?: string;
  type?: 'image' | 'video';
  border?: boolean;
  placeholder?: string;
  loading?: boolean;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  usage?: string;
  onImageSelected: (files: File[]) => void;
};

type FileUploaded = File & {
  preview: string;
  loading: boolean;
};

export const Dropzone: React.FC<DropzoneProps> = props => {
  const {
    onImageSelected,
    value,
    type = 'image',
    accept = ['image/jpeg', 'image/png'],
    maxSize = 20,
    loading = false,
    multiple = false,
    border = true,
    placeholder = 'File must be .jpeg or .png',
    usage = '',
  } = props;
  const styles = useStyles({border});

  const [files, setFiles] = useState<FileUploaded[]>([]);
  const [videoCodecSupported, setVideoCodecSupported] = useState(true);
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
      let newFiles: FileUploaded[] = [];

      if (multiple) {
        newFiles = [
          ...files,
          ...acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              loading: type === 'image',
            }),
          ),
        ];

        setFiles(newFiles);

        setPreview(prevPreview => [
          ...prevPreview,
          ...acceptedFiles.map(file => URL.createObjectURL(file)),
        ]);
      } else {
        newFiles = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            loading: type === 'image',
          }),
        );

        setFiles(newFiles);

        setPreview(acceptedFiles.map(file => URL.createObjectURL(file)));

        if (acceptedFiles.length && type === 'video') {
          checkCodec(acceptedFiles[0]);
        }
      }

      onImageSelected(newFiles);
    },
    onDropRejected: rejection => {
      setError(rejection);
    },
  });

  const checkCodec = async (file: File) => {
    const raw = await readFile(file);

    if (raw !== null && typeof raw !== 'string') {
      const data = new Uint8Array(raw);
      const [video] = muxjs.mp4.probe.tracks(data);

      // browser codec name for HEVC (H.265)
      if (video?.codec === 'hvc1') {
        const browser = detect();
        setVideoCodecSupported(browser !== null && !['firefox', 'chrome'].includes(browser.name));
      } else {
        setVideoCodecSupported(true);
      }
    }
  };

  const readFile = (file: File): Promise<ArrayBuffer | string | null> => {
    return new Promise((resolve, reject) => {
      // Create file reader
      const reader = new FileReader();

      // Register event listeners
      reader.addEventListener('loadend', e => resolve(e.target?.result || null));
      reader.addEventListener('error', reject);

      // Read file
      reader.readAsArrayBuffer(file);
    });
  };

  const imageLoaded = (index: number) => () => {
    setFiles(prevFiles =>
      prevFiles.map((file, i) => {
        if (i === index) {
          file.loading = false;
        }

        return file;
      }),
    );
  };

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

    return cols === 6 ? 3 : 1;
  };

  const formatButtonLable = () => {
    if (usage == 'post') {
      if (type == 'video' && files.length > 0) return `Replace ${capitalize(type)}`;
      return `Add ${capitalize(type)}`;
    }
    return `Upload ${capitalize(type)}`;
  };

  const getErrorMessage = (error: FileError): string => {
    if (error.code === ErrorCode.FileTooLarge) {
      return `File is larger than ${maxSize}Mb`;
    }

    return error.message;
  };

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />
        {preview.length ? (
          <>
            <ShowIf condition={type === 'image'}>
              <ImageList rowHeight={128} cols={6} className={styles.preview}>
                {files.map((item, i) => (
                  <ImageListItem
                    key={i}
                    cols={getCols()}
                    rows={getRows()}
                    classes={{item: styles.item}}>
                    {item.loading && (
                      <Skeleton
                        variant="rect"
                        animation={false}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        width={115 * getCols()}
                        height={128 * getRows()}>
                        <SvgIcon
                          component={ImagePlaceholder}
                          viewBox="0 0 50 50"
                          style={{width: 50, height: 50, visibility: 'visible'}}
                        />
                      </Skeleton>
                    )}
                    <img
                      style={{visibility: item.loading ? 'hidden' : 'visible'}}
                      src={item.preview}
                      alt=""
                      className={styles.image}
                      onLoad={imageLoaded(i)}
                    />

                    <IconButton
                      size="small"
                      aria-label={`remove image`}
                      className={styles.icon}
                      onClick={() => removeFile(i)}>
                      <SvgIcon component={XIcon} style={{fontSize: '1rem'}} />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            </ShowIf>

            <ShowIf condition={type === 'video'}>
              <ShowIf condition={!videoCodecSupported}>
                <Typography>
                  We cannot preview your video, preview video can be done after you confirm it.
                </Typography>
              </ShowIf>
              <ShowIf condition={videoCodecSupported}>
                {files.map((item, i) => (
                  <video key={item.name} controls style={{width: '100%'}}>
                    <track kind="captions" />
                    <source src={item.preview} type="video/mp4" />
                    <div>Video encoding not supported.</div>
                  </video>
                ))}
              </ShowIf>
            </ShowIf>
          </>
        ) : (
          <>
            <UploadIcon />

            <Typography>{placeholder}</Typography>
          </>
        )}

        {!loading && (
          <Button
            className={styles.button}
            size="small"
            variant={preview.length ? 'outlined' : 'contained'}
            color={value ? 'secondary' : 'primary'}
            onClick={handleReuploadImage}>
            {formatButtonLable()}
          </Button>
        )}
      </div>

      <Toaster
        open={Boolean(error)}
        toasterStatus={Status.DANGER}
        message={error ? getErrorMessage(error[0].errors[0]) : ''}
        onClose={closeError}
      />
    </div>
  );
};
