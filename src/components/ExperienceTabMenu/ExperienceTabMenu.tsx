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
  filterExperience: (sort: string) => void;
  onDelete: (experienceId: string) => void;
  onUnsubscribe: (experienceId: string) => void;
}

export const ExperienceTabMenu: React.FC<ExperienceTabMenuProps> = props => {
  const {experiences, user, viewPostList, filterExperience, onDelete, onUnsubscribe} = props;
  const style = useStyles();

  return (
    <>
      <Typography variant={'h4'}>Experience</Typography>
      <HeaderWithAction filter={filterExperience} actionText={'+ Create experience'} />
      <ExperienceList
        onDelete={onDelete}
        onUnsubscribe={onUnsubscribe}
        viewPostList={viewPostList}
        experiences={experiences}
        user={user}
      />
      <ShowIf condition={!experiences.length}>
        <div className={style.empty}>
          <Typography className={style.title} component="p">
            Uh-oh!
          </Typography>
          <Typography className={style.subtitle} color="textSecondary" component="p">
            It seems you don’t have an experience yet
          </Typography>
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
