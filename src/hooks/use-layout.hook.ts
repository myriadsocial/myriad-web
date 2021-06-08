import { useLayoutSetting, LayoutSettingActionType } from 'src/context/layout.context';
import { SocialsEnum } from 'src/interfaces/index';
import { LayoutFilterType } from 'src/interfaces/setting';
import { SidebarTab } from 'src/interfaces/sidebar';

export const useLayout = () => {
  const { state: setting, dispatch } = useLayoutSetting();

  const changeSetting = (key: LayoutFilterType | SocialsEnum, value: boolean) => {
    dispatch({
      type: LayoutSettingActionType.CHANGE_SETTING,
      key,
      value
    });
  };

  const changeSelectedSidebar = (selected: SidebarTab) => {
    dispatch({
      type: LayoutSettingActionType.CHANGE_SELECTED_SIDEBAR,
      value: selected
    });
  };

  return {
    setting,
    changeSetting,
    changeSelectedSidebar
  };
};
