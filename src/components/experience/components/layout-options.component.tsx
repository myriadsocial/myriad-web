import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './layout-options.style';

import PhotoLayoutIcon from 'src/images/photo-layout-light.svg';
import TimelineLayoutIcon from 'src/images/timeline-layout-light.svg';
import { LayoutType } from 'src/interfaces/experience';

type Props = {
  value?: LayoutType;
  onChanged: (value: LayoutType) => void;
};

export default function Layouts({ value, onChanged }: Props) {
  const style = useStyles();

  const changeLayoutType = (type: LayoutType) => {
    onChanged(type);
  };

  return (
    <Card className={style.root}>
      <CardHeader disableTypography className={style.header} title={<Typography variant="h5">Look And Feel</Typography>} />
      <CardContent>
        <List component="nav" className={style.root}>
          <ListItem
            button
            alignItems="flex-start"
            className={style.item}
            selected={value === 'timeline'}
            onClick={() => changeLayoutType('timeline')}>
            <ListItemIcon>
              <TimelineLayoutIcon className={style.icon} />
            </ListItemIcon>
            <ListItemText
              primary="Timeline Layout"
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className={style.inline}>
                    Better if you enjoy conversations and are looking for discussions
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem
            button
            alignItems="flex-start"
            className={style.item}
            selected={value === 'photo'}
            onClick={() => changeLayoutType('photo')}>
            <ListItemIcon>
              <PhotoLayoutIcon className={style.icon} />
            </ListItemIcon>

            <ListItemText
              primary="Photo Layout"
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className={style.inline}>
                    Better if you enjoy visuals and are looking for multimedia content
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
