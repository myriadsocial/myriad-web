import React, {useState} from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {useStyles, SimpleCardProps} from './';

import classNames from 'classnames';

const SimpleCard = ({creator, title, imgUrl, ...props}: SimpleCardProps): JSX.Element => {
  const classes = useStyles();

  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  const handleClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    console.log('clicked!');
    //TODO: open drop down component
  };

  const parseImageFilename = (url: string) => {
    const filename = url
      .split('/')
      .filter(e => e)
      .slice(-1);

    if (filename.length === 0) {
      return 'cover image';
    }
    return filename[0];
  };

  const checkCreator = (name: string) => {
    if (name === 'Lara Schoffield') {
      return true;
    }
    return false;
  };

  return (
    <Card
      className={classNames(classes.root, {
        [classes.activated]: selected === true,
      })}
      {...props}>
      <div
        className={classNames(classes.indicator, {
          [classes.indicatorActivated]: selected === true,
        })}></div>
      <div className={classes.details}>
        <CardActionArea className={classes.cardClickable} onClick={handleClick}>
          <CardMedia
            component={'img'}
            className={classes.cover}
            image={imgUrl}
            title={`${parseImageFilename(imgUrl)} Experience image`}
          />
          <CardContent className={classes.content}>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="caption" color="primary">
              {creator}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {checkCreator(creator) ? `(you)` : ''}
            </Typography>
          </CardContent>
        </CardActionArea>
        <IconButton aria-label="settings" onClick={handleClickSettings}>
          <MoreVertIcon />
        </IconButton>
      </div>
    </Card>
  );
};

export default SimpleCard;
