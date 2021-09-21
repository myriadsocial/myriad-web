import {PhotographIcon} from '@heroicons/react/outline';
import {FilmIcon} from '@heroicons/react/outline';
import {PaperAirplaneIcon} from '@heroicons/react/outline';

import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Tooltip from '@material-ui/core/Tooltip';

import {acronym} from '../../../helpers/string';
import {useStyles} from './CommentEditor.style';

type Props = {
  onSubmit: (comment: string) => void;
  username: string;
  avatar: string;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
};

export const CommentEditor: React.FC<Props> = props => {
  const {onSubmit, username, avatar, placeholder, focus, expand} = props;
  const style = useStyles();
  const CHARACTER_LIMIT = 2000;
  const [toggle, setToggle] = React.useState<boolean>(false);

  const [comment, setValues] = React.useState({
    text: '',
  });
  const inputRef = React.useRef() as React.MutableRefObject<HTMLTextAreaElement>;

  React.useEffect(() => {
    if (expand) setToggle(true);
    if (focus) inputRef.current.focus();
  }, []);

  const openComment = () => setToggle(true);

  const handleChange = (text: string) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues({...comment, [text]: event.target.value.substring(0, CHARACTER_LIMIT)});
  };

  const discard = () => {
    setValues({...comment, text: ''});
  };

  const reply = () => {
    onSubmit(comment.text);
    discard();
  };

  return (
    <div className={style.flex}>
      <Avatar className={style.avatar} src={avatar || ''}>
        {acronym(username)}
      </Avatar>
      <div className={style.root}>
        <TextareaAutosize
          ref={inputRef}
          onClick={openComment}
          rowsMin={1}
          value={comment.text}
          placeholder={placeholder || 'Write a Comment...'}
          className={style.write}
          onChange={handleChange('text')}
          spellCheck={false}
          maxLength={CHARACTER_LIMIT}
        />
        {toggle && (
          <CardActions disableSpacing>
            <div className={style.container}>
              <div>
                <Tooltip classes={{tooltip: style.text}} title="Coming soon" arrow>
                  <IconButton className={style.action} aria-label="photo">
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={PhotographIcon}
                      color="primary"
                      viewBox="0 0 24 24"
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip classes={{tooltip: style.text}} title="Coming soon" arrow>
                  <IconButton className={style.action} aria-label="video">
                    <SvgIcon
                      classes={{root: style.fill}}
                      color="primary"
                      component={FilmIcon}
                      viewBox="0 0 24 24"
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <IconButton
                aria-label="reply"
                disabled={comment.text.length === 0}
                onClick={reply}
                className={style.action}>
                <SvgIcon
                  classes={{root: style.fill}}
                  className={style.replyIcon}
                  component={PaperAirplaneIcon}
                  viewBox="0 0 24 24"
                />
              </IconButton>
            </div>
          </CardActions>
        )}
      </div>
    </div>
  );
};
