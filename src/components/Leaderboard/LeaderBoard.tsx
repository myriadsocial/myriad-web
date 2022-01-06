import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import getConfig from 'next/config';
import Link from 'next/link';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  Button,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  Grid,
  TableRow,
} from '@material-ui/core';

import {useStyles} from './leaderboard.styles';
import {useLeaderboard} from './use-leaderboard-hook';

import {LoadMore} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import MyriadIcon from 'src/images/web/myriad.svg';

export const LeaderBoardComponent: React.FC = () => {
  const {leaderboard, fetchLeaderboard, loading, meta, limit} = useLeaderboard();
  const style = useStyles();
  const {publicRuntimeConfig} = getConfig();

  const hasMore = leaderboard.length < meta.totalItemCount && meta.currentPage < limit;

  React.useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onLoadNextPage = () => {
    if (meta.currentPage < meta.totalPageCount && meta.currentPage < limit) {
      fetchLeaderboard(meta.currentPage + 1, () => {
        handleScroll();
      });
    }
  };

  const handleScroll = () => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  const noAction = () => {
    // handle no action when scroll down
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.header}>
            <Link href={publicRuntimeConfig.myriadWebsiteURL}>
              <a href={publicRuntimeConfig.myriadWebsiteURL} rel="noreferrer">
                <MyriadIcon />
              </a>
            </Link>
            <div className={style.divider} />
            <Typography className={style.text} color="primary">
              Airdrop Leaderboard
            </Typography>
          </div>
          <Link href={`/`}>
            <Button color="primary" variant="contained" size="small">
              Go to App
            </Button>
          </Link>
        </div>
        <ShowIf condition={loading}>
          <div className={`${style.content} ${style.flexcenter}`}>
            <CircularProgress size={40} />
          </div>
        </ShowIf>
        <ShowIf condition={!loading}>
          <div className={style.content}>
            <Grid container spacing={0} className={style.tableHeader}>
              <Grid item xs={1} style={{textAlign: 'center'}}>
                <Typography className={style.th}>Rank</Typography>
              </Grid>
              <Grid item xs={9} style={{textAlign: 'left', paddingLeft: '20px'}}>
                <Typography className={style.th}>Name</Typography>
              </Grid>
              <Grid item xs={2} style={{textAlign: 'right', paddingRight: '5px'}}>
                <Typography className={style.th}>Kudos</Typography>
              </Grid>
            </Grid>
            <InfiniteScroll
              scrollableTarget="scrollable-timeline"
              dataLength={leaderboard.length}
              hasMore={hasMore}
              next={noAction}
              loader={<LoadMore handleAction={onLoadNextPage} />}>
              <TableContainer>
                <Table aria-label="leader-board">
                  <TableBody>
                    {leaderboard.map((user, i) => (
                      <TableRow key={user.id + i}>
                        <TableCell align="center" style={{width: '10%'}} className={style.number}>
                          {i + 1}
                        </TableCell>
                        <TableCell classes={{root: style.p}} style={{width: '80%'}}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar src={user.profilePictureURL}>{acronym(user.name)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography className={style.number}>{user.name}</Typography>
                              }
                              secondary={
                                <Typography className={style.secondary}>
                                  @{user.username}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </TableCell>
                        <TableCell align="center" style={{width: '10%'}}>
                          <Typography color="primary" className={style.number}>
                            {user.metric?.totalKudos}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </InfiniteScroll>
          </div>
        </ShowIf>
      </div>
    </div>
  );
};
