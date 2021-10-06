import {DotsVerticalIcon} from '@heroicons/react/outline';

import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles, NonSelectableSimpleCardProps} from '.';

const NonSelectableSimpleCard: React.FC<NonSelectableSimpleCardProps> = ({
  user,
  creator,
  title,
  imgUrl,
  ...props
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
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
    <Card className={classes.root} {...props}>
      <div className={classes.indicator} />
      <CardActionArea
        disableRipple
        classes={{
          root: classes.actionArea,
        }}>
        <div className={classes.details}>
          <div className={classes.details}>
            <CardMedia
              component={'img'}
              className={classes.cover}
              image={imgUrl}
              title={`${parseImageFilename(imgUrl)} Experience image`}
            />
            <CardContent classes={{root: classes.cardContent}}>
              <Typography variant="body1">{title}</Typography>
              <Typography variant="caption" color="primary">
                {creator}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {checkCreator(creator) ? `(you)` : ''}
              </Typography>
            </CardContent>
          </div>
          <IconButton aria-label="settings" onClick={handleClickSettings}>
            <SvgIcon component={DotsVerticalIcon} viewBox="0 0 24 24" />
          </IconButton>
        </div>
      </CardActionArea>
      <Menu
        classes={{
          paper: classes.menu,
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem>View details</MenuItem>
        <MenuItem>Clone</MenuItem>
        <MenuItem>Subscribe</MenuItem>
      </Menu>
    </Card>
  );
};

export default NonSelectableSimpleCard;
