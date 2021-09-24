import {ChatAlt2Icon, HashtagIcon, VariableIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

import {RightMenuBarProps} from '.';
import {ExperienceTabMenu} from '../ExperienceTabMenu/ExperienceTabMenu';
import {TabsComponent} from '../atoms/Tabs/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiBox-root': {
        paddingLeft: 0,
      },
    },
  }),
);

export const RightMenuBar: React.FC<RightMenuBarProps> = props => {
  const {experiences} = props;
  const [iconTabs] = useState([
    {
      id: 'first',
      icon: <VariableIcon />,
      component: <ExperienceTabMenu experiences={experiences} />,
    },
    {
      id: 'second',
      icon: <HashtagIcon />,
      component: 'Trending Tab Content',
    },
    {
      id: 'third',
      icon: <ChatAlt2Icon />,
      component: 'Chat Tab Content',
    },
  ]);

  const classes = useStyles();

  const handleChangeTab = () => {
    console.log('changed tab!');
  };

  return (
    <div className={classes.root}>
      <TabsComponent
        active={iconTabs[0].id}
        tabs={iconTabs}
        position={'left'}
        mark="cover"
        size="small"
        onChangeTab={handleChangeTab}
      />
    </div>
  );
};
