import React, {useState} from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import classNames from 'classnames';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      width: 'fit-content',

      /* Drop shadow */
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,
    },
    activated: {
      border: `1px solid #6E3FC3`,
      boxSizing: `border-box`,
    },
    details: {
      display: 'flex',
      flexDirection: 'row',
    },
    content: {
      flex: '1 0 auto',
      alignSelf: 'center',
      paddingLeft: 0,
    },
    cover: {
      width: 68,
      height: 68,
      margin: 20,
      opacity: 0.9,
      borderRadius: 5,
    },
  }),
);

interface SimpleCardProps {
  activated: boolean;
  /*
   * imgUrl can be a local path or an external url
   */
  imgUrl: string;

  /*
   * check if user owned this experience card
   */
  isOwner: boolean;

  onClick: () => void;
}

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
