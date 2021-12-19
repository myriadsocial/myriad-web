import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useDispatch, useSelector} from 'react-redux';

import {List, ListItem, ListItemText, Link, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import {Loading} from '../atoms/Loading';
import {Modal} from '../atoms/Modal';
import {useStyles} from './PostImporter.styles';

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

  const {
    importers,
    meta: {totalItemCount: totalImporter, currentPage},
  } = useSelector<RootState, ImporterState>(state => state.importersState);
  const [importer, setImporter] = useState<string | undefined>(undefined);
  const hasMore = importers.length < totalImporter;

  const onHover = (userId: string | undefined) => () => setImporter(userId);
  const onLoadNextPage = () => {
    if (post) {
      dispatch(fetchImporter(post.originPostId, post.platform, post.createdBy));
    }
  };

  useEffect(() => {
    if (post) {
      dispatch(fetchImporter(post.originPostId, post.platform, post.createdBy, currentPage + 1));
    }
  }, [dispatch, post]);

  return (
    <Modal
      title="Who else imported this post?"
      align="left"
      open={open}
      onClose={onClose}
      subtitle={`${!post ? 0 : post.totalImporter - 1} users imported this post`}
      className={styles.root}
      gutter="custom">
      {importers.length === 0 ? (
        <Loading />
      ) : (
        <List style={{padding: 0}}>
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            dataLength={importers.length}
            hasMore={hasMore}
            next={onLoadNextPage}
            loader={<Loading />}>
            {importers.map(e => {
              return (
                <Link
                  key={e.id}
                  href={`/profile/${e.id}`}
                  style={{cursor: 'pointer', textDecoration: 'none'}}>
                  <ListItem
                    style={{
                      background: importer === e.id ? 'rgba(255, 200, 87, 0.2)' : '#FFF',
                      padding: '8px 30px',
                    }}
                    onMouseEnter={onHover(e.id)}
                    onMouseLeave={onHover(undefined)}>
                    <ListItemAvatar>
                      <Avatar alt={'name'} className={styles.avatar} src={e.profilePictureURL}>
                        {acronym(e.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography className={styles.name} component="span" color="textPrimary">
                        {e.name}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </Link>
              );
            })}
          </InfiniteScroll>
        </List>
      )}
    </Modal>
  );
};
