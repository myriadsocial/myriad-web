import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {LanguageSettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';
import {updateLanguageSetting} from 'src/reducers/config/actions';

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageSettingType | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const langStorage = localStorage.getItem('i18nextLng');

    if (langStorage) {
      setLanguage(langStorage as LanguageSettingType);

      dispatch(updateLanguageSetting(undefined, langStorage));
    } else {
      setLanguage('en');
    }
  }, []);

  const changeLanguage = (select: LanguageSettingType) => {
    setLanguage(select);
    localStorage.setItem('i18nextLng', select);
    i18n.changeLanguage(select);

    dispatch(updateLanguageSetting(undefined, select));
  };

  return {
    language,
    changeLanguage,
  };
};
