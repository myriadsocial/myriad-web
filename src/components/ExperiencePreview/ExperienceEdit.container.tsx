import React, {useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceEditor} from '../ExperienceEditor/ExperienceEditor';
import {useStyles} from './experience.style';

import debounce from 'lodash/debounce';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useUpload} from 'src/hooks/use-upload.hook';
import {ExperienceProps} from 'src/interfaces/experience';
import i18n from 'src/locale';

export const ExperienceEditContainer: React.FC = () => {
  // TODO: separate hook for tag, people and experience
  const style = useStyles();
  const {
    experience,
    people,
    tags,
    searchTags,
    searchPeople,
    getExperienceDetail,
    updateExperience,
  } = useExperienceHook();
  const {uploadImage} = useUpload();
  const router = useRouter();

  useEffect(() => {
    const {experienceId} = router.query;

    if (experienceId) getExperienceDetail(experienceId);
  }, [router.query]);

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };

  const onSave = (attributes: ExperienceProps) => {
    if (!experience) return;

    updateExperience(experience.id, attributes, () => {
      router.push(`/experience/${experience.id}`);
    });
  };

  const handleSearchTags = debounce((query: string) => {
    searchTags(query);
  }, 300);

  const handleSearchPeople = debounce((query: string) => {
    searchPeople(query);
  }, 300);

  return (
    <>
      <TopNavbarComponent
        description={i18n.t('TopNavbar.Subtitle.Experience_Edit')}
        sectionTitle={i18n.t('TopNavbar.Title.Experience')}
        reverse
      />
      <div className={style.box}>
        {experience && (
          <ExperienceEditor
            type="Edit"
            experience={experience}
            tags={tags}
            people={people}
            onSearchTags={handleSearchTags}
            onImageUpload={onImageUpload}
            onSearchPeople={handleSearchPeople}
            onSave={onSave}
          />
        )}
      </div>
    </>
  );
};
