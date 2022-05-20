import {XIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';
import {ErrorCode, FileError, useDropzone} from 'react-dropzone';

import {
  Button,
  capitalize,
  IconButton,
  ImageList,
  ImageListItem,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import {UploadIcon} from '../Icons';
import {useStyles} from './Dropzone.styles';
import {Skeleton as FileSkeleton} from './File.skeleton';

import {detect} from 'detect-browser';
import muxjs from 'mux.js';
import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import i18n from 'src/locale';

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
  isEdit?: boolean;
  editorType?: string;
  onImageSelected: (files: File[]) => void;
};

type FileUploaded = File & {
  preview: string;
  loading: boolean;
  width?: number;
  height?: number;
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
    placeholder = i18n.t('Dropzone.Placeholder'),
    usage = '',
    isEdit = false,
    editorType = '',
  } = props;
  const styles = useStyles({border, multiple});

  const {openToasterSnack} = useToasterSnackHook();

  const [files, setFiles] = useState<FileUploaded[]>([]);
  const [videoCodecSupported, setVideoCodecSupported] = useState(true);
  const [preview, setPreview] = useState<string[]>([]);
  const [isFileRemoved, setIsFileRemoved] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setPreview([value]);
    }
  }, [value]);

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
          ...acceptedFiles.map((file, index) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.src = url;

            img.onload = function () {
              // @ts-expect-error
              const width = this.width as number;
              // @ts-expect-error
              const height = this.height as number;

              setFiles(prevFiles =>
                prevFiles.map((file, i) => {
                  if (i === index) {
                    file.width = width;
                    file.height = height;
                  }

                  return file;
                }),
              );
            };

            return Object.assign(file, {
              preview: url,
              loading: type === 'image',
            });
          }),
        ];

        setFiles(newFiles);

        setPreview(prevPreview => [
          ...prevPreview,
          ...acceptedFiles.map(file => URL.createObjectURL(file)),
        ]);
      } else {
        newFiles = acceptedFiles.map((file, index) => {
          const url = URL.createObjectURL(file);
          const img = new Image();

          img.src = url;

          img.onload = function () {
            // @ts-expect-error
            const width = this.width;
            // @ts-expect-error
            const height = this.height;

            setFiles(prevFiles =>
              prevFiles.map((file, i) => {
                if (i === index) {
                  file.width = width;
                  file.height = height;
                }

                return file;
              }),
            );
          };

          return Object.assign(file, {
            preview: url,
            loading: type === 'image',
          });
        });

        setFiles(newFiles);

        setPreview(acceptedFiles.map(file => URL.createObjectURL(file)));

        if (acceptedFiles.length && type === 'video') {
          checkCodec(acceptedFiles[0]);
        }
      }

      if (newFiles.length > 0) {
        onImageSelected(newFiles);
      }
    },
    onDropRejected: rejection => {
      openToasterSnack({
        message: getErrorMessage(rejection[0].errors[0]),
        variant: 'error',
      });
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

  const removeFile = (index?: number) => {
    if (isEdit && !isFileRemoved && editorType !== '') {
      setPreview([]);
      const currentFiles = files.filter((file, i) => index !== -1);
      onImageSelected(currentFiles);
      setIsFileRemoved(true);
    } else {
      const currentFiles = files.filter((file, i) => index !== i);
      const currentPreview = preview.filter((url, i) => index !== i);

      setFiles(currentFiles);
      setPreview(currentPreview);

      onImageSelected(currentFiles);
    }
  };

  const handleReuploadImage = () => {
    open();
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
      return i18n.t('Dropzone.Btn_Upload_Video', {type: capitalize(type)});
    }
    if (!multiple && preview.length === 1) {
      return i18n.t('Dropzone.Btn_Reupload', {type: capitalize(type)});
    }
    return i18n.t('Dropzone.Btn_Upload', {type: capitalize(type)});
  };

  const getErrorMessage = (error: FileError): string => {
    if (error.code === ErrorCode.FileTooLarge) {
      return i18n.t('Dropzone.Error_File_Large', {maxSize});
    }

    return error.message;
  };

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />
        {preview.length ? (
          <>
            <ShowIf condition={isEdit && !isFileRemoved && editorType !== ''}>
              <img
                style={{visibility: 'visible'}}
                src={preview[0]}
                alt=""
                className={styles.imageSingle}
              />
            </ShowIf>
            <ShowIf condition={type === 'image' && !isEdit}>
              <ShowIf condition={!multiple}>
                <img
                  style={{visibility: 'visible'}}
                  src={preview[0]}
                  alt=""
                  className={styles.image}
                />
              </ShowIf>
              <ShowIf condition={multiple}>
                <ShowIf condition={files.length === 1}>
                  <img
                    style={{visibility: 'visible'}}
                    src={preview[0]}
                    alt=""
                    className={styles.imageSingle}
                  />
                  <IconButton
                    size="small"
                    aria-label={`remove image`}
                    className={styles.iconSingle}
                    onClick={() => removeFile(0)}>
                    <SvgIcon component={XIcon} style={{fontSize: '1rem'}} />
                  </IconButton>
                </ShowIf>
                <ShowIf condition={files.length > 1}>
                  <ImageList rowHeight={128} cols={6} className={styles.preview}>
                    {files.map((item, i) => (
                      <ImageListItem
                        key={i}
                        cols={getCols()}
                        rows={getRows()}
                        classes={{item: styles.item}}>
                        {item.loading && (
                          <FileSkeleton width={115 * getCols()} height={128 * getRows()} />
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
              </ShowIf>
            </ShowIf>

            <ShowIf condition={type === 'video'}>
              <ShowIf condition={!videoCodecSupported}>
                <Typography>{i18n.t('Dropzone.Video.Not_Preview')}</Typography>
              </ShowIf>
              <ShowIf condition={videoCodecSupported}>
                {files.map((item, i) => (
                  <video key={item.name} controls style={{width: '100%'}}>
                    <track kind="captions" />
                    <source src={item.preview} type="video/mp4" />
                    <div>{i18n.t('Dropzone.Video.Not_Support')}</div>
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
    </div>
  );
};
