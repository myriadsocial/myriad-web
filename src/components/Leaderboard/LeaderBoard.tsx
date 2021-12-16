import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Link from 'next/link';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  Grid,
  TableRow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './leaderboard.styles';
import {useLeaderboard} from './use-leaderboard-hook';

import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import MyriadIcon from 'src/images/web/myriad.svg';

export const LeaderBoardComponent: React.FC = () => {
  const {leaderboard, fetchLeaderboard, loading, meta} = useLeaderboard();
  const style = useStyles();

  const hasMore = leaderboard.length < meta.totalItemCount;

  React.useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onLoadNextPage = () => {
    if (meta.currentPage < meta.totalPageCount) {
      fetchLeaderboard(meta.currentPage + 1);
    }
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.header}>
            <Link href="https://myriad.social">
              <a href={'https://myriad.social'} rel="noreferrer">
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
              Try Myriad
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
                <Typography className={style.th}>Points</Typography>
              </Grid>
            </Grid>
            <InfiniteScroll
              scrollableTarget="scrollable-timeline"
              dataLength={leaderboard.length}
              hasMore={hasMore}
              next={onLoadNextPage}
              loader={<Loading />}>
              <TableContainer>
                <Table aria-label="leader-board">
                  <TableBody>
                    {leaderboard.map((user, i) => (
                      <TableRow key={user.id}>
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
                            {user.metric?.totalActivity}
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
