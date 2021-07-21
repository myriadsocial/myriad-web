import {makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    marginRight: 4,
    marginLeft: 4,
  },
  name: {
    fontSize: 14,
    lineHeight: '12px',
    fontWeight: 400,
    color: '#FFF',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  avatar: {
    height: 52,
    width: 52,
    marginRight: 4,
  },
  button: {
    margin: 0,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 4,
    borderRadius: 5,
  },
  detail: {
    position: 'relative',
  },
  avatarBig: {
    height: 90,
    width: 90,
    position: 'absolute',
    top: 140,
  },
  profileContent: {
    width: 500,
    marginTop: 40,
  },
  media: {
    height: 0,
    paddingTop: '34.25%',
  },
  copy: {
    cursor: 'pointer',
    paddingTop: 4,
  },
  actions: {
    justifyContent: 'space-between',
  },
  logout: {
    textAlign: 'center',
  },
});
