import { IconButton, Grid, ImageList, ImageListItem } from '@material-ui/core';

import { BiVideoPlus } from 'react-icons/bi';
import { CiCircleRemove } from 'react-icons/ci';
import { LuImagePlus } from 'react-icons/lu';

type MobileEmbedProps = {
  uploadVideoFieldRef: any;
  uploadImageFieldRef: any;
  imageUrl: string[];
  videoUrl: string[];
  onImage: (urls: string[]) => void;
  onRemove: (url: string) => void;
  onVideo: (url: string[]) => void;
};

export const MobileEmbed: React.FC<MobileEmbedProps> = props => {
  const {
    imageUrl,
    videoUrl,
    onImage,
    uploadImageFieldRef,
    uploadVideoFieldRef,
    onRemove,
    onVideo,
  } = props;

  const handleRemove: (url: string) => () => void = (url: string) => {
    return () => onRemove(url);
  };

  const handleRemoveVideo = () => {
    onVideo([]);
  };
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const { files } = await UploadAPI.image(event.target.files[0], {
        onUploadProgress: (event: ProgressEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const fileProgress = Math.round((100 * event.loaded) / event.total);
        },
      });
      const urls = files.map(file => file.url);
      onImage([...imageUrl, ...urls]);

      if (uploadImageFieldRef && uploadImageFieldRef.current) {
        uploadImageFieldRef.current.value = '';
      }
    }
  };
  const handleVideoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const { files } = await UploadAPI.image(event.target.files[0], {
        onUploadProgress: (event: ProgressEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const fileProgress = Math.round((100 * event.loaded) / event.total);
        },
      });
      const urls = files.map(file => file.url);
      onVideo(urls);

      if (uploadVideoFieldRef && uploadVideoFieldRef.current) {
        uploadVideoFieldRef.current.value = '';
      }
    }
  };

  const selectImage = (): void => {
    const uploadField: any = uploadImageFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };
  const selectVideo = (): void => {
    const uploadField: any = uploadVideoFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  if (imageUrl.length > 0)
    return (
      <>
        <input
          type="file"
          ref={uploadImageFieldRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <ImageList cols={3}>
          {imageUrl.map(url => (
            <ImageListItem key={url}>
              <img src={url} />
              <IconButton
                size={'medium'}
                color={'secondary'}
                onClick={handleRemove(url)}
                style={{ position: 'absolute', zIndex: 2, right: '-6%' }}>
                <CiCircleRemove size={30} />
              </IconButton>
            </ImageListItem>
          ))}
          {imageUrl.length < 4 && (
            <ImageListItem>
              <IconButton
                color={'primary'}
                style={{ margin: 'auto', width: '100%', height: '100%' }}>
                <LuImagePlus size={60} onClick={selectImage} />
              </IconButton>
            </ImageListItem>
          )}
        </ImageList>
      </>
    );

  if (videoUrl.length > 0)
    return (
      <>
        <Grid container>
          <Grid item xs>
            <IconButton
              size={'medium'}
              color={'secondary'}
              onClick={handleRemoveVideo}
              style={{ position: 'absolute', zIndex: 2, right: '-1%' }}>
              <CiCircleRemove size={30} />
            </IconButton>
            <video width="100%" src={videoUrl[0]}>
              Browser does not support video
            </video>
          </Grid>
        </Grid>
      </>
    );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <input
            type="file"
            ref={uploadImageFieldRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <IconButton color={'primary'} onClick={selectImage} size={'medium'}>
            <LuImagePlus size={33} />
          </IconButton>
        </Grid>
        <Grid item>
          <input
            type="file"
            ref={uploadVideoFieldRef}
            onChange={handleVideoChange}
            style={{ display: 'none' }}
            accept="video/*"
          />
          <IconButton color={'primary'} onClick={selectVideo} size={'medium'}>
            <BiVideoPlus size={33} />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};
