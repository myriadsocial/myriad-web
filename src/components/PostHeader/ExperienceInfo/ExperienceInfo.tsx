import React, {useState} from 'react';

import Link from 'next/link';

import Typography from '@material-ui/core/Typography';

import {useStyles} from './experience-info.style';

import {Avatar} from 'src/components/atoms/Avatar';
import {Modal} from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {Experience} from 'src/interfaces/experience';

// import i18n from 'src/locale';

export type ExperienceInfo = {
  postId: string;
  totalExperience: number;
  experiences?: Experience[];
};

export const ExperienceInfo: React.FC<ExperienceInfo> = props => {
  const {postId, totalExperience, experiences} = props;

  const style = useStyles();
  const {loadExperienceAdded} = useExperienceHook();
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    loadExperienceAdded(postId, experienceList => {
      setExperienceList(experienceList);
    });
  };

  return (
    <>
      &nbsp;• added to&nbsp;
      {!!experiences && !!experiences.length && (
        <>
          <Link href={`/experience/${experiences[0].id}`} shallow passHref>
            <span className={style.link}>{experiences[0].name}</span>
          </Link>
          <ShowIf condition={totalExperience > 1}>
            &nbsp;and&nbsp;
            <span className={style.link} onClick={handleOpen}>
              {totalExperience - 1} other experiences
            </span>
          </ShowIf>
          <Modal
            title={'Post in Experience'}
            subtitle={<Typography>{'This post is already added to this experience'}</Typography>}
            open={open}
            onClose={handleClose}>
            <div className={style.list}>
              {experienceList.map(experience => (
                <div className={style.card} key={experience.id}>
                  <Avatar
                    name={experience.name}
                    src={experience.experienceImageURL}
                    variant="rounded"
                    className={style.avatar}
                  />
                  <div>
                    <Typography variant="body1">{experience.name}</Typography>
                    <Typography variant="subtitle2" color="primary">
                      {experience.user.name}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
