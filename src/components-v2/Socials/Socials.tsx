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
  NoSsr,
} from '@material-ui/core';

import {capitalize} from '../../helpers/string';
import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {User} from '../../interfaces/user';
import {AddSocialMedia} from '../AddSocialMedia';
import {useSocialMediaList} from '../SocialMediaList/use-social-media-list.hook';
import {ListItemComponent} from '../atoms/ListItem';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './Socials.styles';

type SocialsProps = {
  user: User;
  socials: SocialMedia[];
  anonymous?: boolean;
  verifying?: boolean;
  onVerifySocialMedia: (social: SocialsEnum, profileUrl: string) => void;
  onDisconnectSocial: (people: SocialMedia) => void;
};

export const Socials: React.FC<SocialsProps> = props => {
  const {socials, user, verifying = false, onDisconnectSocial, onVerifySocialMedia} = props;
  const styles = useStyles();

  const socialList = useSocialMediaList(socials);

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum>(SocialsEnum.FACEBOOK);
  const [people, setPeople] = useState<SocialMedia[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [peopleToRemove, setPeopleToRemove] = useState<SocialMedia | null>(null);
  const [addSocial, setAddSocial] = useState(false);
  const enabledSocial = [SocialsEnum.FACEBOOK, SocialsEnum.TWITTER, SocialsEnum.REDDIT];

  useEffect(() => {
    getPeopleList();
  }, [selectedSocial, socials]);

  useEffect(() => {
    if (!verifying) {
      setAddSocial(false);
    }
  }, [verifying]);

  const getPeopleList = (): void => {
    const selected = socials.filter(social => social.platform === selectedSocial);

    setPeople(selected);
  };

  const getStyles = (social: SocialsEnum): string[] => {
    const classname: string[] = [];

    if (social === selectedSocial) {
      classname.push(styles.selected);
    }

    classname.push(styles[social]);

    return classname;
  };

  const handleDisconnectSocial = (social: SocialMedia) => {
    setRemoving(true);
    setPeopleToRemove(social);
  };

  const toggleAddSocialMedia = () => {
    setAddSocial(prevStatus => !prevStatus);
  };

  const verifySocialMedia = (social: SocialsEnum, profileUrl: string) => {
    onVerifySocialMedia(social, profileUrl);
    toggleAddSocialMedia();
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
            className={[styles.icon, ...getStyles(social.id)].join(' ')}
            disabled={!enabledSocial.includes(social.id)}
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
                    checked={selectedPeople === account.peopleId}
                    value={account.peopleId}
                    disableRipple
                    onChange={() => setSelectedPeople(account.peopleId)}
                    inputProps={{'aria-labelledby': labelId}}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} disableTypography>
                  <ListItemComponent
                    title={account.people?.name || ''}
                    subtitle={index === 0 ? '(Primary account)' : undefined}
                    size="medium"
                    avatar={account.people?.profilePictureURL}
                  />
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    className={styles.remove}
                    onClick={() => handleDisconnectSocial(account)}>
                    <SvgIcon component={XCircleIcon} color="error" fontSize="medium" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
          <ListItem role={undefined} disableGutters>
            <ListItemText disableTypography className={styles.action}>
              <Button color="primary" disableRipple variant="text" onClick={toggleAddSocialMedia}>
                + Add {capitalize(selectedSocial)} account
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </div>

      <NoSsr>
        <AddSocialMedia
          open={addSocial}
          social={selectedSocial}
          publicKey={user.id}
          onClose={toggleAddSocialMedia}
          verifying={verifying}
          verify={verifySocialMedia}
        />
      </NoSsr>

      <PromptComponent
        title={'Disconnect social account'}
        subtitle={`Are you sure to remove ${peopleToRemove?.people?.name}?`}
        open={removing}
        icon="danger"
        onCancel={handleClosePrompt}>
        <div>
          <Button size="small" variant="outlined" color="secondary" onClick={handleClosePrompt}>
            No, let me rethink
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={confirmDisconnectSocial}>
            Yes, proceed to delete
          </Button>
        </div>
      </PromptComponent>
    </Box>
  );
};
