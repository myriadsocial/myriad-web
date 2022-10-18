import React from 'react';

import {Grid, IconButton, Link, Tooltip, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import {useStyles} from './ProfileBanned.style';

import {OfficialBadgeIcon} from 'components/atoms/Icons';
import {Text} from 'components/atoms/Text';
import ShowIf from 'components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {User, FriendStatusProps} from 'src/interfaces/user';
import i18n from 'src/locale';

type ProfileBannedProps = {
  person: User & FriendStatusProps;
};

export const ProfileBanned: React.FC<ProfileBannedProps> = ({person}) => {
  const style = useStyles({});

  return (
    <div className={style.root}>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="space-between"
        wrap="nowrap"
        classes={{root: style.header}}>
        <Grid container alignItems="center">
          <Avatar
            alt={person.name}
            src={person.profilePictureURL}
            variant="circular"
            className={style.avatar}>
            {acronym(person.name)}
          </Avatar>
          <div>
            <Typography variant="body1" className={style.name} component="div" gutterBottom>
              {person.name}
              <ShowIf condition={Boolean(person.verified)}>
                <Tooltip
                  title={<Typography>{i18n.t('Profile.Header.Tooltip.Official')}</Typography>}
                  aria-label="official-account">
                  <IconButton
                    aria-label="official-badge"
                    style={{backgroundColor: 'transparent', paddingLeft: 4}}>
                    <OfficialBadgeIcon viewBox="0 0 24 24" color="primary" />
                  </IconButton>
                </Tooltip>
              </ShowIf>
            </Typography>
            <Typography variant="body1" component="p" className={style.username}>
              @{person.username || 'username'}
            </Typography>
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        classes={{root: style.content}}>
        <Text locale="Profile.Banned.Title" variant="h3" weight="bold" gutterBottom />
        <Text
          locale="Profile.Banned.Description"
          components={{
            policy: <Link href="/privacy-policy" />,
          }}
        />
      </Grid>
    </div>
  );
};
