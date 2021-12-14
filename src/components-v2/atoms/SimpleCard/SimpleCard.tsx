import {DotsVerticalIcon} from '@heroicons/react/outline';

import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles, SimpleCardProps} from '.';
import {TimelineType} from '../../../interfaces/timeline';
import {PromptComponent} from '../Prompt/prompt.component';

const SimpleCard: React.FC<SimpleCardProps> = ({
  user,
  creator,
  title,
  imgUrl,
  isSelectable,
  filterTimeline,
  onDelete,
  experienceId,
  userExperienceId,
  selected,
  onSelect,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    if (isSelectable) {
      onSelect && experienceId && onSelect(experienceId);
      filterTimeline(TimelineType.EXPERIENCE);
    }
  };

  const handleRemove = () => {
    if (userExperienceId && onDelete) onDelete(userExperienceId);
    handleCancel();
    handleClose();
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
    if (name === user?.name) {
      return true;
    }
    return false;
  };

  const activated = () => {
    if (selected && experienceId) {
      if (selected == experienceId) return true;
    }
    return false;
  };

  return (
    <Card className={`${classes.root} ${activated() && classes.activated}`}>
      <CardActionArea
        onClick={handleClick}
        disableRipple
        component="div"
        classes={{
          root: classes.actionArea,
        }}>
        {activated() && <div className={classes.activatedRibbon} />}
        <div className={`${classes.indicator} ${activated() && classes.indicatorActivated}`} />
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
                {checkCreator(creator) ? ` (you)` : ''}
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
        <Link href={`/experience/${experienceId}/preview`}>
          <MenuItem>See details</MenuItem>
        </Link>
        <Link href={`/experience/${experienceId}/edit`}>
          <MenuItem>Edit experience</MenuItem>
        </Link>
        <MenuItem onClick={handleOpen} className={classes.delete}>
          Delete
        </MenuItem>
      </Menu>
      <PromptComponent
        onCancel={handleCancel}
        open={isOpen}
        icon="danger"
        title="Delete Experience?"
        subtitle="You will not able to get post update
based on this experience">
        <div className={`${classes['flex-center']}`}>
          <Button
            onClick={handleCancel}
            className={classes.m1}
            size="small"
            variant="outlined"
            color="secondary">
            Not now
          </Button>
          <Button onClick={handleRemove} className={classes.error} size="small" variant="contained">
            Delete
          </Button>
        </div>
      </PromptComponent>
    </Card>
  );
};

export default SimpleCard;
