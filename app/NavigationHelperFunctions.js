import {DarkMode, PrimaryColor, SecondaryColor} from './AppConfig';
import {Navigation} from 'react-native-navigation';

export const SetLoginRoot = () => {
  Navigation.setRoot(loginStack);
};

const loginStack = {
  root: {
    component: {
      id: 'LoginScreen',
      name: 'LoginScreen',
      options: {
        topBar: {
          visible: false,
        },
        statusBar: {
          backgroundColor: SecondaryColor,
          style: DarkMode ? 'light' : 'dark',
        },
      },
    },
  },
};

export const SetRegisterRoot = () => {
  Navigation.setRoot(registerStack);
};

const registerStack = {
  root: {
    component: {
      id: 'RegisterScreen',
      name: 'RegisterScreen',
      options: {
        topBar: {
          visible: false,
        },
        statusBar: {
          backgroundColor: SecondaryColor,
          style: DarkMode ? 'light' : 'dark',
        },
      },
    },
  },
};

export const UpdateStatusBarColor = (
  screenId,
  backgroundColor,
  style = DarkMode ? 'light' : 'dark',
) => {
  Navigation.mergeOptions(screenId, {
    statusBar: {
      backgroundColor: backgroundColor,
      style: style,
    },
  });
};
