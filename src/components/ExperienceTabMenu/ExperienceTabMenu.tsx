import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import {Experience, UserExperience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';
import {ExperienceList} from '../ExperienceList';
import {HeaderWithAction} from '../HeaderWithAction';

import ShowIf from 'src/components/common/show-if.component';

const useStyles = makeStyles(() =>
  createStyles({
    empty: {
      background: '#FFF',
      height: '491px',
      width: '100%',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '12px',
    },
    subtitle: {
      marginBottom: '40px',
      fontSize: '14px',
    },
  }),
);

interface ExperienceTabMenuProps {
  experiences: UserExperience[];
  user?: User;
  viewPostList: (type: TimelineType, experience: Experience) => void;
  onDelete: (experienceId: string) => void;
  onUnsubscribe: (experienceId: string) => void;
  onCloneExperience: (experienceId: string) => void;
  onCreateExperience: () => void;
}

export const ExperienceTabMenu: React.FC<ExperienceTabMenuProps> = props => {
  const {
    experiences,
    user,
    viewPostList,
    onDelete,
    onUnsubscribe,
    onCreateExperience,
    onCloneExperience,
  } = props;
  const style = useStyles();

  return (
    <>
      <Typography variant={'h4'}>Experience</Typography>
      <HeaderWithAction actionText={'+ Create experience'} onClick={onCreateExperience} />
      <ExperienceList
        onDelete={onDelete}
        onUnsubscribe={onUnsubscribe}
        onFollow={onCloneExperience}
        viewPostList={viewPostList}
        experiences={experiences}
        user={user}
      />
      <ShowIf condition={!experiences.length}>
        <div className={style.empty}>
          <Typography className={style.title} component="p">
            Uh-oh!
          </Typography>
          <div style={{paddingLeft: 8, paddingRight: 8}}>
            <Typography
              className={style.subtitle}
              align="center"
              color="textSecondary"
              component="p">
              You haven't created any experience yet. Experience allows you to customize various
              tags and people to be shown in your timeline.
            </Typography>
          </div>
          <Link href={'/experience/create'}>
            <Button color="primary" variant="contained" size="small">
              Create Experience
            </Button>
          </Link>
        </div>
      </ShowIf>
    </>
  );
};
