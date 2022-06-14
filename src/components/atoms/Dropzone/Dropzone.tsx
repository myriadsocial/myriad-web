import React, {useState} from 'react';
import {ErrorCode, FileError, useDropzone} from 'react-dropzone';

import {Button, capitalize, Typography} from '@material-ui/core';

import {UploadIcon} from '../Icons';
import {useStyles} from './Dropzone.styles';
import MultipleImagePreview from './Render/PreviewImage/Multiple';
import SingleImagePreview from './Render/PreviewImage/Single';
import VideoPreview from './Render/PreviewVideo';

import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import i18n from 'src/locale';

type DropzoneProps = {
  value?: string;
  type?: 'image' | 'video';
  width?: number;
  height?: number;
  border?: 'solid' | 'dashed';
  placeholder?: string;
  label?: string;
  loading?: boolean;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  usage?: string;
  error?: boolean;
  onImageSelected: (files: File[]) => void;
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
    placeholder = i18n.t('Dropzone.Placeholder'),
    label = i18n.t('Dropzone.Btn_Upload'),
    usage = '',
    width,
    height,
  } = props;

  const styles = useStyles(props);
  const {openToasterSnack} = useToasterSnackHook();

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>(value ? [value] : []);

  const {getRootProps, getInputProps, open} = useDropzone({
    accept,
    maxSize: maxSize * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    multiple,
    onDrop: files => {
      if (multiple) {
        setFiles(prevFiles => [...prevFiles, ...files]);
        setPreview(prevPreview => [...prevPreview, ...files.map(URL.createObjectURL)]);
      } else {
        setFiles(files);
        setPreview(files.map(URL.createObjectURL));
      }

      if (files.length > 0) {
        onImageSelected(files);
      }
    },
    onDropRejected: rejection => {
      openToasterSnack({
        message: getErrorMessage(rejection[0].errors[0]),
        variant: 'error',
      });
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

  // TODO: replace this by parsing label as prop
  const formatButtonLable = () => {
    if (usage == 'post') {
      if (type == 'video') {
        if (files.length > 0) return i18n.t('Dropzone.Btn_Replace_Video', {type: capitalize(type)});
        return i18n.t('Dropzone.Btn_Upload_Video', {type: capitalize(type)});
      } else return i18n.t('Dropzone.Btn_Add_Image');
    }
    if (!multiple && preview.length === 1) {
      return i18n.t('Dropzone.Btn_Reupload');
    }
    return label;
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

        <ShowIf condition={type === 'image' && !multiple && preview.length > 0}>
          <SingleImagePreview src={preview[0]} width={width} height={height} />
        </ShowIf>

        <ShowIf condition={type === 'image' && multiple && preview.length > 0}>
          <MultipleImagePreview files={preview} onRemoveFile={removeFile} disableRemove={loading} />
        </ShowIf>

        <ShowIf condition={type === 'video'}>
          <VideoPreview files={files} />
        </ShowIf>

        <ShowIf condition={preview.length === 0}>
          <UploadIcon />
          <Typography>{placeholder}</Typography>
        </ShowIf>

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
