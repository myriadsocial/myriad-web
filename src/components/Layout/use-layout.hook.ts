import { useLayoutSetting, LayoutSettingActionType } from './layout.context';

import { SocialsEnum } from 'src/interfaces/index';
import { LayoutFilterType } from 'src/interfaces/setting';

export const useLayout = () => {
  const { state: setting, dispatch } = useLayoutSetting();

  const changeSetting = (key: LayoutFilterType | SocialsEnum, value: boolean) => {
    dispatch({
      type: LayoutSettingActionType.CHANGE_SETTING,
      key,
      value
    });
  };

  return {
    setting,
    changeSetting
  };
};
