import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperiencePreview} from './ExperiencePreview';
import {useStyles} from './experience.style';

import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ExperiencePreviewContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {experience, getDetail, subscribeExperience} = useExperienceHook();
  const style = useStyles();
  const router = useRouter();
  const {experienceId} = router.query;

  useEffect(() => {
    if (experienceId) getDetail(experienceId);
  }, []);

  const handleSubsibeExperience = (experienceId: string) => {
    subscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/clone`);
  };

  const handleEditExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/edit`);
  };

  return (
    <>
      {experience && user && (
        <>
          <div className={style.mb}>
            <TopNavbarComponent
              description={experience.name || 'Experience'}
              sectionTitle={SectionTitle.EXPERIENCE}
            />
          </div>
          <ExperiencePreview
            experience={experience}
            userId={user.id}
            onSubscribe={handleSubsibeExperience}
            onFollow={handleCloneExperience}
            onUpdate={handleEditExperience}
          />
        </>
      )}
    </>
  );
};
