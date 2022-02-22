import React from 'react';

import {SvgIcon, SvgIconProps} from '@material-ui/core';

import ArrowUp from 'src/images/Icons/ArrowUp.svg';
import DragIndicator from 'src/images/Icons/DragIndicator.svg';
import Sort from 'src/images/Icons/Sort.svg';
import Upload from 'src/images/Icons/Upload.svg';
import Magnifier from 'src/images/Icons/magnifierIcon.svg';
import MyriadCircle from 'src/images/Icons/myriad-circle.svg';
import MyriadFullBlack from 'src/images/Icons/myriad-full-black.svg';
import MyriadGrey from 'src/images/Icons/myriad-grey.svg';
import MyriadFull from 'src/images/Icons/myriad-logo-full.svg';
import Notification from 'src/images/Icons/notif-default.svg';
import OfficialBadge from 'src/images/Icons/official-badge.svg';

type IconProps = Omit<SvgIconProps, 'component'>;

export const MyriadCircleIcon: React.FC<IconProps> = props => (
  <SvgIcon component={MyriadCircle} viewBox="0 0 30 30" style={{fill: 'none'}} {...props} />
);

export const MyriadFullIcon: React.FC<IconProps> = props => {
  const {width = 221, height = 48} = props;
  return (
    <SvgIcon
      component={MyriadFull}
      viewBox="0 14 221 58"
      style={{width: width, height: height, fill: 'none'}}
      {...props}
    />
  );
};

export const MyriadFullBlackIcon: React.FC<IconProps> = props => (
  <SvgIcon
    component={MyriadFullBlack}
    viewBox="inherit"
    style={{width: 'auto', height: 'auto'}}
    {...props}
  />
);

export const MyriadGreyIcon: React.FC<IconProps> = props => (
  <SvgIcon
    component={MyriadGrey}
    viewBox="0 0 50 50"
    style={{width: 50, height: 50, visibility: 'visible'}}
    {...props}
  />
);

export const NotificationIcon: React.FC<IconProps> = props => (
  <SvgIcon component={Notification} viewBox="inherit" {...props} />
);

export const OfficialBadgeIcon: React.FC<IconProps> = props => (
  <SvgIcon component={OfficialBadge} viewBox="0 0 24 24" {...props} />
);

export const UploadIcon: React.FC<IconProps> = props => (
  <SvgIcon
    component={Upload}
    viewBox="inherit"
    style={{fill: 'none', width: 'auto', height: 'auto'}}
    {...props}
  />
);

export const ArrowUpIcon: React.FC<IconProps> = props => (
  <SvgIcon viewBox="0 0 20 20" {...props}>
    <ArrowUp style={{width: 20, height: 20}} />
  </SvgIcon>
);

export const DragIndicatorIcon: React.FC<IconProps> = props => (
  <SvgIcon viewBox="0 0 20 20" {...props}>
    <DragIndicator style={{width: 20, height: 20}} />
  </SvgIcon>
);

export const SearchIcon: React.FC<IconProps> = props => (
  <SvgIcon component={Magnifier} viewBox="0 0 24 24" {...props} />
);

export const SortIcon: React.FC<IconProps> = props => (
  <SvgIcon component={Sort} viewBox="0 0 24 24" {...props} />
);
