import React, {useEffect, useState} from 'react';

import {Card, CardActionArea, CardContent, CardMedia, Typography} from '@material-ui/core';

import {useStyles} from './LinkPreview.styles';

import {getLinkPreview} from 'link-preview-js';

type LinkPreviewProps = {
  url: string;
  proxy?: string;
};

type PreviewProps = {
  url: string;
  title: string;
  siteName: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: {
    url: string | undefined;
    secureUrl: string | null | undefined;
    type: string | null | undefined;
    width: string | undefined;
    height: string | undefined;
  }[];
  favicons: string[];
};

export const LinkPreview: React.FC<LinkPreviewProps> = props => {
  const {url, proxy = 'https://cors.bridged.cc/'} = props;
  const styles = useStyles();

  const [resource, setResource] = useState<PreviewProps | null>(null);

  useEffect(() => {
    getUrlMeta();
  }, []);

  const getUrlMeta = async () => {
    const resource = await getLinkPreview(url, {
      headers: {
        'user-agent': 'googlebot',
        'Accept-Language': 'en-US',
      },
      proxyUrl: proxy,
    });

    setResource(resource as PreviewProps);
  };

  const handleClick = () => {
    window.open(url, '_blank');
  };

  if (!resource) return null;

  console.log('resource', resource);

  return (
    <Card className={styles.root} onClick={handleClick}>
      <CardActionArea>
        <CardMedia className={styles.media} image={resource.images[0]} title={resource.title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {resource.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {resource.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
