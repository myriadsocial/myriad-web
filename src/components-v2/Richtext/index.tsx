import {action} from '@storybook/addon-actions';

import React, {useState} from 'react';

import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import {acronym} from '../../helpers/string';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      boxSizing: 'border-box',
      padding: '20px 30px',
      width: '643px',
      height: '90px',
      borderRadius: '10px',
      background: theme.palette.background.paper,
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    postTextArea: {
      background: theme.palette.background.paper,
      fontFamily: theme.typography.fontFamily,
      padding: theme.spacing(1),
      lineHeight: '17.57px',
      marginLeft: '10px',
      resize: 'none',
      width: '100%',
      fontSize: 14,
      height: 48,
      border: 0,
      '&:focus-visible': {
        outline: 'none',
      },
    },
    action: {
      padding: 0,
    },
    screen: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 8,
      cursor: 'pointer',
    },
  }),
);
const pictURL =
  'https://res.cloudinary.com/dsget80gs/image/upload/v1626794503/znraavovkot3qbjxqbvv.jpg';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
export const RichTextComponent: React.FC<Props> = () => {
  const style = useStyles();
  const [post, setPost] = useState<string>('');

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setPost(text);
  };

  return (
    <div className={style.root}>
      <div className={style.flex}>
        <div className={style.flex}>
          <Avatar
            aria-label={`avatar`}
            src={pictURL}
            variant="circular"
            sizes="lg"
            style={{width: 50, height: 50}}>
            {acronym('User Name')}
          </Avatar>
          <TextareaAutosize
            rowsMin={1}
            value={post}
            placeholder={`Whats on your mind?`}
            className={style.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </div>
        <IconButton color="primary" size="medium" className={style.action}>
          <AddCircleOutlineIcon fontSize="large" color="primary" />
        </IconButton>
      </div>
      <div
        onClick={action('open modal')}
        role="button"
        tabIndex={0}
        aria-hidden="true"
        className={style.screen}
      />
    </div>
  );
};
