import React from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import Typography from '@material-ui/core/Typography';

import {useStyles} from './Tab.style';

import {ExperienceListContainer, EmptyExperience} from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {ExperienceOwner} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ExperienceTab: React.FC = () => {
  const router = useRouter();
  const styles = useStyles();

  const {user, experiences} = useSelector<RootState, UserState>(state => state.userState);

  const {openToasterSnack} = useToasterSnackHook();

  const handleCreateExperience = () => {
    if (experiences.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push('/experience/create');
    }
  };

  return (
    <div className={styles.box}>
      <Typography variant={'h4'} className={styles.title}>
        Experience
      </Typography>

      <ShowIf condition={Boolean(user)}>
        <Typography
          variant={'caption'}
          color={'primary'}
          component="div"
          className={styles.action}
          onClick={handleCreateExperience}>
          + Create experience
        </Typography>
      </ShowIf>

      <ExperienceListContainer selectable owner={ExperienceOwner.CURRENT_USER} />

      <ShowIf condition={experiences.length === 0}>
        <EmptyExperience />
      </ShowIf>
    </div>
  );
};

export default ExperienceTab;
