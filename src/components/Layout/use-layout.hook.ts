import { useLayoutSetting } from './layout.context';

import { LayoutFilterType } from 'src/interfaces/setting';

export const useLayout = () => {
  const { state: setting, dispatch } = useLayoutSetting();

  const changeSetting = (key: LayoutFilterType, value: boolean) => {
    dispatch({
      type: 'CHANGE_SETTING',
      key,
      value
    });
  };

  return {
    setting,
    changeSetting
  };
};
