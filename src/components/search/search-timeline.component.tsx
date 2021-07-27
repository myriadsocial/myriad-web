import React, {useState, useEffect} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import clsx from 'clsx';
import {TabPanel} from 'src/components/common/tab-panel.component';
import {useMyriadUser} from 'src/hooks/use-myriad-users.hooks';

const TopicSearchResult = dynamic(() => import('src/components/search/search-topic.component'));
const SearchResultComponent = dynamic(
  () => import('src/components/search/search-result.component'),
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginBottom: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    button: {
      borderRadius: 8,
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
    },
    loading: {
      left: 'calc(50% - 20px)',
      position: 'absolute',
      top: 100,
    },
    selectedBar: {
      background: '#E0C4FF',
      border: 0,
    },
    mr: {
      marginRight: theme.spacing(2),
    },
    span: {
      color: '#8629E9',
    },
  }),
);

type SearchTimelineProps = {
  isAnonymous: boolean;
};

const SearchTimeline: React.FC<SearchTimelineProps> = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(2);

  const theme = useTheme();
  const style = useStyles();
  const router = useRouter();
  const {searching, users: options, search} = useMyriadUser();
  const delayLoading = 2000;

  useEffect(() => {
    if (searching) {
      loadingSequence();
    }
  }, [searching]);

  useEffect(() => {
    search(`${router.query.q}`);
  }, [router.query.q]);

  const loadingSequence = () => {
    setLoading(true);
    const timeoutID = setTimeout(() => {
      setLoading(false);
    }, delayLoading);

    return () => {
      clearTimeout(timeoutID);
    };
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );
  };

  if (loading) return <LoadingComponent />;

  return (
    <>
      <div id="search-result">
        <Typography className={style.content} variant="h4">
          Search result for <span className={style.span}>{router.query.q}</span>:
        </Typography>
        <div className={style.content}>
          <Button
            disabled
            className={clsx(style.mr, style.button, {
              [style.selectedBar]: value === 0,
            })}
            variant="outlined"
            color="primary"
            onClick={() => setValue(0)}>
            Everything
          </Button>
          <Button
            disabled
            className={clsx(style.mr, style.button, {
              [style.selectedBar]: value === 1,
            })}
            variant="outlined"
            color="primary"
            onClick={() => setValue(1)}>
            Posts
          </Button>
          <Button
            className={clsx(style.mr, style.button, {
              [style.selectedBar]: value === 2,
            })}
            variant="outlined"
            color="primary"
            onClick={() => setValue(2)}>
            People
          </Button>
          <Button
            className={clsx(style.button, {
              [style.selectedBar]: value === 3,
            })}
            variant="outlined"
            color="primary"
            onClick={() => setValue(3)}>
            Topic
          </Button>
        </div>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <h1 style={{background: 'white'}}>Everything bar</h1>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <h1 style={{background: 'white'}}>Posts bar</h1>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <SearchResultComponent options={options} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <TopicSearchResult />
        </TabPanel>
      </div>
    </>
  );
};

export default SearchTimeline;
