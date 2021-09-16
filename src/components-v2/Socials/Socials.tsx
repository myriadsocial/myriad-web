import {XCircleIcon} from '@heroicons/react/solid';

import React, {useEffect, useState} from 'react';

import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
  SvgIcon,
} from '@material-ui/core';

import {capitalize} from '../../helpers/string';
import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {useSocialMediaList} from '../SocialMediaList/use-social-media-list.hook';
import {ListItemComponent} from '../atoms/ListItem';
import {PromptComponent} from '../atoms/prompt/prompt.component';
import {useStyles} from './Socials.styles';

type SocialsProps = {
  socials: SocialMedia[];
  anonymous?: boolean;
  onDisconnectSocial: (peopleId: string) => void;
};

export const Socials: React.FC<SocialsProps> = props => {
  const {socials, onDisconnectSocial} = props;
  const styles = useStyles();

  const socialList = useSocialMediaList(socials);

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum>(SocialsEnum.FACEBOOK);
  const [people, setPeople] = useState<SocialMedia[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [peopleToRemove, setPeopleToRemove] = useState<string | null>(null);

  useEffect(() => {
    getPeopleList();
  }, []);

  const getPeopleList = (): void => {
    const selected = socials.filter(social => social.platform === selectedSocial);

    setPeople(selected);
  };

  const getStyles = (social: SocialsEnum, connected: boolean): string[] => {
    const classname: string[] = [];

    if (social === selectedSocial) {
      classname.push(styles.selected);
    }

    if (connected) {
      classname.push(styles[social]);
    }

    return classname;
  };

  const handleDisconnectSocial = (peopleId: string) => {
    setRemoving(true);
    setPeopleToRemove(peopleId);
  };

  const handleClosePrompt = (): void => {
    setRemoving(false);
    setPeopleToRemove(null);
  };

  const confirmDisconnectSocial = (): void => {
    if (peopleToRemove) {
      onDisconnectSocial(peopleToRemove);
    }

    handleClosePrompt();
  };

  return (
    <Box className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h4" style={{fontWeight: 'bold'}}>
          Connected Accounts
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Connect social accounts to receive rewards!
        </Typography>
      </div>

      <div className={styles.list}>
        {socialList.map(social => (
          <IconButton
            key={social.id}
            size="small"
            className={[styles.icon, ...getStyles(social.id, social.connected)].join(' ')}
            onClick={() => setSelectedSocial(social.id)}>
            {social.icon}
          </IconButton>
        ))}
      </div>

      <div>
        <Typography variant="h5" color="textSecondary">
          {capitalize(selectedSocial)}
        </Typography>

        <List className={styles.preview}>
          {people.map((account, index) => {
            const labelId = `checkbox-list-label-${account}`;

            return (
              <ListItem
                key={account.peopleId}
                className={styles.listItem}
                role={undefined}
                disableGutters
                selected={selectedPeople === account.peopleId}>
                <ListItemIcon className={styles.itemIcon}>
                  <Radio
                    edge="start"
                    color="primary"
                    tabIndex={-1}
                    disableRipple
                    onChange={() => setSelectedPeople(account.peopleId)}
                    inputProps={{'aria-labelledby': labelId}}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} disableTypography>
                  <ListItemComponent
                    title={account.people?.name || ''}
                    subtitle={index === 0 ? '(Primary account)' : undefined}
                    avatar={account.people?.profilePictureURL}
                  />
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    className={styles.remove}
                    onClick={() => handleDisconnectSocial(account.peopleId)}>
                    <SvgIcon component={XCircleIcon} color="error" fontSize="medium" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
          <ListItem role={undefined} disableGutters>
            <ListItemText disableTypography className={styles.action}>
              <Button color="primary" disableRipple variant="text">
                + Add {capitalize(selectedSocial)} account
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </div>

      <PromptComponent
        open={removing}
        variant="careful"
        onCancel={handleClosePrompt}
        onConfirm={confirmDisconnectSocial}
      />
    </Box>
  );
};
