import { IconButton, Grid, ImageList, ImageListItem } from '@material-ui/core';

import { BiVideoPlus } from 'react-icons/bi';
import { CiCircleRemove } from 'react-icons/ci';
import { LuImagePlus } from 'react-icons/lu';

type MobileEmbedProps = {
  imageUrl: string[];
  videoUrl: string;
  onChange: any;
  onClick: () => void;
  uploadFieldRef: any;
  onRemove: (url: string) => void;
};

export const MobileEmbed: React.FC<MobileEmbedProps> = props => {
  const { imageUrl, onChange, onClick, uploadFieldRef, onRemove } = props;
  const handleRemove: (url: string) => () => void = (url: string) => {
    return () => onRemove(url);
  };

  if (imageUrl.length > 0)
    return (
      <>
        <input
          type="file"
          ref={uploadFieldRef}
          onChange={onChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <ImageList cols={3}>
          {imageUrl.map(url => (
            <ImageListItem>
              <img src={url} />
              <IconButton
                size={'medium'}
                color={'secondary'}
                onClick={handleRemove(url)}
                key={url}
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
                <LuImagePlus size={60} onClick={onClick} />
              </IconButton>
            </ImageListItem>
          )}
        </ImageList>
      </>
    );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <input
            type="file"
            ref={uploadFieldRef}
            onChange={onChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <IconButton color={'primary'} onClick={onClick} size={'medium'}>
            <LuImagePlus size={33} />
          </IconButton>
        </Grid>
        <Grid item>
          <input
            type="file"
            ref={uploadFieldRef}
            onChange={onChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <IconButton color={'primary'} onClick={onClick} size={'medium'}>
            <BiVideoPlus size={33} />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};
