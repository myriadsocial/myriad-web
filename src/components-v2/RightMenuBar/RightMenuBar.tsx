import {ChatAlt2Icon, HashtagIcon, VariableIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {RightMenuBarProps} from '.';
import {useStyles} from '.';
import {ExperienceTabMenu} from '../ExperienceTabMenu/ExperienceTabMenu';
import {TrendingTabPanelContainer} from '../Trending/TrendingTabPanelContainer';
import {TabsComponent} from '../atoms/Tabs/';

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
      component: <TrendingTabPanelContainer />,
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
