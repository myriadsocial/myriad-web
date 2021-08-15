import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';

import {TopicListComponent} from './topic-list.component';

import ExpandablePanel from 'src/components/common/panel-expandable.component';
import {RootState} from 'src/reducers';
import {fetchPopularTopic} from 'src/reducers/tag/actions';
import {TagState} from 'src/reducers/tag/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      marginTop: theme.spacing(1),
      background: 'transparent',
    },
    content: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
    },
  }),
);

const TopicComponent: React.FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const {trending} = useSelector<RootState, TagState>(state => state.tagState);

  useEffect(() => {
    dispatch(fetchPopularTopic());
  }, []);

  return (
    <div className={styles.root} id="worldwide">
      <ExpandablePanel expanded={true} title="Worldwide" startIcon={<LanguageIcon />}>
        <div className={styles.content}>
          <div style={{paddingTop: 24, paddingBottom: 8}}>
            <Typography variant="h4" style={{marginBottom: 8}}>
              {'Trending Now'}
            </Typography>
          </div>

          <TopicListComponent topics={trending} />
        </div>
      </ExpandablePanel>
    </div>
  );
};

export default TopicComponent;
