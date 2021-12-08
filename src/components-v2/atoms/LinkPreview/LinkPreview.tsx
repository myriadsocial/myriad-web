import React from 'react';

import {Card, CardActionArea, CardContent, CardMedia, Typography} from '@material-ui/core';

import {useStyles} from './LinkPreview.styles';

import {PostEmbedProps} from 'src/interfaces/post';

type LinkPreviewProps = {
  embed: PostEmbedProps;
};

export const LinkPreview: React.FC<LinkPreviewProps> = props => {
  const {embed} = props;
  const styles = useStyles();

  const handleClick = () => {
    window.open(embed.url, '_blank');
  };

  if (!embed || embed.url.length === 0) return null;

  return (
    <Card className={styles.root} onClick={handleClick}>
      <CardActionArea>
        <CardMedia className={styles.media} image={embed.image?.url} title={embed.title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {embed.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {embed.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
