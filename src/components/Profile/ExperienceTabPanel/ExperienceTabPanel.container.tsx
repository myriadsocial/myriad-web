import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {useExperienceHook} from '../../../hooks/use-experience-hook';
import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components/Timeline/default';
import {Empty} from 'src/components/atoms/Empty';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {UserExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {fetchProfileExperience} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
  user?: User;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {user} = props;
  const {
    subscribeExperience,
    unsubscribeExperience,
    experiences: userExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const router = useRouter();

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );
  const {detail, friendStatus} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);

  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);
  const isFriend = friendStatus?.status == 'approved';
  const isOwner = detail?.id == userLogin?.id;
  const isPrivate = settings.privacy.accountPrivacy == 'private';

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences]);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleSubsibeExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
    }
  };

  const handleUnsubscribeExperience = (experienceId: string) => {
    unsubscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handlePreviewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/preview`);
  };

  if (isPrivate && !isFriend && !isOwner) {
    return (
      <div style={{marginTop: '27px'}}>
        <Empty
          title="Nothing to see here!"
          subtitle="This account is private. Send them a friend request to see their full profile."
        />
      </div>
    );
  }

  return (
    <ExperienceTabPanel
      experiences={myExperience}
      userExperience={userExperience}
      onFilter={handleFilterType}
      onSubscribe={handleSubsibeExperience}
      onUnsubscribe={handleUnsubscribeExperience}
      onFollow={handleCloneExperience}
      onPreview={handlePreviewExperience}
    />
  );
};
