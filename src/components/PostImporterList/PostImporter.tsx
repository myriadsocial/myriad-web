import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {List, ListItem, ListItemText, Link, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import {Loading} from '../atoms/Loading';
import {Modal} from '../atoms/Modal';
import {useStyles} from './PostImporter.styles';

import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {fetchImporter} from 'src/reducers/importers/actions';
import {ImporterState} from 'src/reducers/importers/reducer';

type Props = {
  open: boolean;
  post: Post | null;
  onClose: () => void;
};

export const PostImporter: React.FC<Props> = props => {
  const {post, open, onClose} = props;
  const styles = useStyles();
  const dispatch = useDispatch();

  const {importers, loading} = useSelector<RootState, ImporterState>(state => state.importersState);

  useEffect(() => {
    if (post) {
      dispatch(fetchImporter(post.originPostId, post.platform));
    }
  }, [dispatch, post]);

  console.log(post);

  return (
    <Modal
      title="Who else imported this post?"
      align="left"
      open={open}
      onClose={onClose}
      subtitle={`${!post ? 0 : post.totalImporter - 1} users imported this post`}
      className={styles.root}>
      {loading ? (
        <Loading />
      ) : (
        importers.map(importer => {
          return (
            <ShowIf key={importer.id} condition={Boolean(post) && importer.id !== post?.createdBy}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={'name'} className={styles.avatar} src={importer.profilePictureURL}>
                      {acronym(importer.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    <Link href={`/profile/${importer.id}`}>
                      <a href={`/profile/${importer.id}`} className={styles.link}>
                        <Typography className={styles.name} component="span" color="textPrimary">
                          {importer.name}
                        </Typography>
                      </a>
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </ShowIf>
          );
        })
      )}
    </Modal>
  );
};
