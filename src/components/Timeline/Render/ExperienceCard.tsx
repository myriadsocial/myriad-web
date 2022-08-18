import React from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Paper, Typography, Avatar, Button} from '@material-ui/core';

import {useStyles} from './experience-card.style';

import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

const ExperienceSignInDialog = dynamic(
  () => import('src/components/ExperiencePreview/ExperienceSignIn'),
  {ssr: false},
);

type ExperienceCardProps = {
  experience?: Experience;
  userExperiences: WrappedExperience[];
  user?: User;
  onSubscribe: (experienceId: string) => void;
  onUnsubscribe: (userExperienceId: string) => void;
};

export const ExperienceCard: React.FC<ExperienceCardProps> = props => {
  const {experience, userExperiences, user, onSubscribe, onUnsubscribe} = props;
  const style = useStyles();
  const router = useRouter();
  const confirm = useConfirm();

  const [promptSignin, setPromptSignin] = React.useState(false);

  const isSubscribed = () => {
    return (
      userExperiences.filter(ar => ar.experience.id === experience.id && ar.subscribed === true)
        .length > 0
    );
  };

  const handleEditExperience = () => {
    router.push(`/experience/${experience.id}/edit`);
  };

  const handleSubscribeExperience = () => {
    if (!user) {
      setPromptSignin(true);
    } else {
      onSubscribe(experience.id);
    }
  };

  const openUnsubscribeConfirmation = () => {
    confirm({
      title: i18n.t('Experience.Alert.Confirmation_Unsub.Title'),
      description: `${i18n.t('Experience.Alert.Confirmation_Unsub.Desc_1')}\n ${i18n.t(
        'Experience.Alert.Confirmation_Unsub.Desc_2',
      )}`,
      confirmationText: i18n.t('Experience.Alert.Confirmation_Unsub.Btn'),
      onConfirm: () => {
        const subscribedExperience = userExperiences.find(
          ar => ar.experience.id === experience.id && ar.subscribed === true,
        );

        if (subscribedExperience && subscribedExperience.id && onUnsubscribe) {
          onUnsubscribe(subscribedExperience.id);
        }
      },
    });
  };

  return (
    <Paper className={style.paper}>
      <Avatar
        alt={experience.name}
        src={experience.experienceImageURL}
        variant="rounded"
        style={{width: 48, height: 48}}
      />
      <div className={style.content}>
        <div>
          <Typography variant="h6">{experience.name}</Typography>
          <Typography color="primary" variant="subtitle2">
            {experience.user.name}
          </Typography>
          <Typography color="textSecondary">{experience.description}</Typography>
          <Typography>
            {experience.subscribedCount}{' '}
            <Typography color="textSecondary" component="span">
              subscribers{' '}
            </Typography>
            {experience.clonedCount}{' '}
            <Typography color="textSecondary" component="span">
              cloners
            </Typography>
          </Typography>
        </div>
        {experience?.createdBy === user?.id ? (
          <Button size="small" variant="contained" color="primary" onClick={handleEditExperience}>
            {i18n.t('Experience.Preview.Button.Edit')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={isSubscribed() ? openUnsubscribeConfirmation : handleSubscribeExperience}>
            {isSubscribed()
              ? i18n.t('Experience.Preview.Button.Unsubscribe')
              : i18n.t('Experience.Preview.Button.Subscribe')}
          </Button>
        )}
      </div>
      <ExperienceSignInDialog open={promptSignin} onClose={() => setPromptSignin(false)} />
    </Paper>
  );
};
