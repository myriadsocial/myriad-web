import React, {useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperiencePreview} from './ExperiencePreview';
import {useStyles} from './experience.style';

import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

export const ExperiencePreviewContainer: React.FC = () => {
  const {
    experience,
    userExperiences,
    getExperienceDetail,
    subscribeExperience,
    unsubscribeExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const style = useStyles();
  const router = useRouter();
  const {experienceId} = router.query;

  useEffect(() => {
    if (experienceId) getExperienceDetail(experienceId);
  }, [experienceId]);

  const handleSubscribeExperience = (experienceId: string) => {
    if (userExperiences.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
    }
  };

  const handleUnsubscribeExperience = (userExperienceId: string) => {
    unsubscribeExperience(userExperienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    if (userExperiences.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleEditExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/edit`);
  };

  return (
    <>
      {experience && (
        <>
          <TopNavbarComponent
            description={experience.name || 'Experience'}
            sectionTitle={SectionTitle.EXPERIENCE}
          />
          <div className={style.box}>
            <ExperiencePreview
              experience={experience}
              userExperiences={userExperiences}
              userId={experience.id}
              onSubscribe={handleSubscribeExperience}
              onUnsubscribe={handleUnsubscribeExperience}
              onFollow={handleCloneExperience}
              onUpdate={handleEditExperience}
            />
          </div>
        </>
      )}
    </>
  );
};
