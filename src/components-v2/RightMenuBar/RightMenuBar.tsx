import React, {useState} from 'react';

import {RightMenuBarProps} from '.';
import ChatIcon from '../../images/Icons/ChatTabIcon.svg';
import ExperienceIcon from '../../images/Icons/ExperienceTabIcon.svg';
import TrendingIcon from '../../images/Icons/TrendingTabIcon.svg';
import {ExperienceTabMenu} from '../ExperienceTabMenu/ExperienceTabMenu';
import {TabsComponent} from '../atoms/Tabs/';

export const RightMenuBar: React.FC<RightMenuBarProps> = props => {
  const {experiences} = props;
  const [iconTabs] = useState([
    {
      id: 'first',
      icon: <ExperienceIcon />,
      component: <ExperienceTabMenu experiences={experiences} />,
    },
    {
      id: 'second',
      icon: <TrendingIcon />,
      component: 'Second Tab Content',
    },
    {
      id: 'third',
      icon: <ChatIcon />,
      component: 'Third Tab Content',
    },
  ]);

  const handleChangeTab = () => {
    console.log('changed tab!');
  };

  return (
    <div>
      <TabsComponent
        active={iconTabs[0].id}
        tabs={iconTabs}
        position={'left'}
        onChangeTab={handleChangeTab}
      />
    </div>
  );
};
