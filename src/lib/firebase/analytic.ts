import * as Sentry from '@sentry/nextjs';

import FirebaseApp from './app';

import 'firebase/analytics';
import firebase from 'firebase/app';

export const init = async () => {
  FirebaseApp.init();

  firebase.analytics();
};

export const logScreenView = async (screenName: string): Promise<void | boolean> => {
  try {
    const analytics = firebase.analytics();

    analytics.setCurrentScreen(screenName);
    analytics.logEvent('screen_view');
  } catch (error) {
    Sentry.captureException(error);
  }
};
