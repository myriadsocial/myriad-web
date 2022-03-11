import {RefreshIcon} from '@heroicons/react/outline';

import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {MenuOptions} from '../atoms/DropdownMenu';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './tip.style';

import {NearNetworkIcon24} from 'src/components/atoms/Icons';

export const sortOptions: MenuOptions<string>[] = [
  {
    id: 'highest',
    title: 'Highest',
  },
  {
    id: 'lowest',
    title: 'Lowest',
  },
];

export const Tip: React.FC = () => {
  const style = useStyles();
  const handleSortChanged = (sort: string) => {
    switch (sort) {
      case 'highest': {
        // PUT CODE HERE
        break;
      }

      case 'lowest': {
        // PUT CODE HERE
        break;
      }

      default: {
        // PUT CODE HERE
        break;
      }
    }
  };

  const handleRefresh = () => {
    // PUT CODE HERE
  };

  const handleClaim = () => {
    // PUT CODE HERE
  };

  return (
    <>
      <div className={style.headerActionWrapper}>
        <DropdownMenu title={'Sort'} options={sortOptions} onChange={handleSortChanged} />
        <IconButton
          classes={{
            root: style.refreshIcon,
          }}
          disableRipple
          aria-label="refresh"
          onClick={handleRefresh}>
          <SvgIcon component={RefreshIcon} color="primary" viewBox="0 0 24 24" />
        </IconButton>
      </div>
      <div>
        {/* MAPING ARRAY OF DATA CLAIM */}
        <ListItem alignItems="center">
          <ListItemAvatar>
            <NearNetworkIcon24 width={'40px'} height={'40px'} />
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="h5" component="span" color="textPrimary">
              NEAR
            </Typography>
          </ListItemText>
          <div className={style.secondaryAction}>
            <div className={style.text}>
              <Typography variant="h5" component="p" color="textPrimary">
                120.12345678
              </Typography>
              <Typography variant="subtitle2" component="p" color="textSecondary">
                USD 150.24
              </Typography>
            </div>
            <Button
              className={style.button}
              size="small"
              color="primary"
              variant="text"
              onClick={handleClaim}>
              Claim
            </Button>
          </div>
        </ListItem>
      </div>
    </>
  );
};
