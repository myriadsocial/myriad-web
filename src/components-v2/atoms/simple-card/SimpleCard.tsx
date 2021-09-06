import React, {useState} from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {useStyles, SimpleCardProps} from './';

import classNames from 'classnames';

const SimpleCard = ({activated, imgUrl, isOwner, ...props}: SimpleCardProps): JSX.Element => {
  const classes = useStyles();
  const {palette} = useTheme();

  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  const defineBG = (selected: boolean) => {
    switch (selected) {
      case true: {
        return palette.primary.main;
      }

      default: {
        return 'inherit';
      }
    }
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

  return (
    <Card
      className={classNames(classes.root, {
        [classes.activated]: selected === true,
      })}
      {...props}>
      <div
        style={{
          width: 8,
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
          backgroundColor: defineBG(selected),
        }}></div>
      <CardActionArea onClick={handleClick}>
        <div className={classes.details}>
          <CardMedia
            component={'img'}
            className={classes.cover}
            image={imgUrl}
            title={`${parseImageFilename(imgUrl)} Experience image`}
          />
          <CardContent className={classes.content}>
            <Typography variant="body1">Cryptowatcher</Typography>
            <Typography variant="caption" color="primary">
              Lara Schoffield: {activated}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {isOwner ? `(you)` : ''}
            </Typography>
          </CardContent>
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default SimpleCard;
