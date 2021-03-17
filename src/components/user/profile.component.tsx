import React from 'react';
import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  info: {
    marginRight: 4,
    marginLeft: 4
  },
  name: {
    fontSize: 14,
    lineHeight: '12px',
    fontWeight: 400,
    color: '#FFF',
    textTransform: 'capitalize',
    marginBottom: 8
  },
  avatar: {
    height: 52,
    width: 52,
    marginRight: 4
  },
  button: {
    margin: 0,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5
  }
});

type Props = {
  loggedIn?: boolean;
  toggleLogin: (open) => void;
};

const Profile = ({ loggedIn = true, toggleLogin }: Props) => {
  const styles = useStyles();
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
      separator: ' '
    });

    setUserName(randomName);
  }, []);

  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src="/images/avatar/3.jpg">
        Anonimous
      </Avatar>
      <div className={styles.info}>
        <Typography className={styles.name}>{userName}</Typography>

        <ShowIf condition={loggedIn}>
          <Button className={styles.button} size="small" variant="contained" color="primary">
            Edit Your Profile
          </Button>
        </ShowIf>

        <ShowIf condition={!loggedIn}>
          <Button
            className={styles.button}
            fullWidth={true}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => toggleLogin(true)}>
            Get a name, Login or Register
          </Button>
        </ShowIf>
      </div>
    </div>
  );
};

export default Profile;
