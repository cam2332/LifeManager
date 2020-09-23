import {DarkMode, PrimaryColor, SecondaryColor} from './AppConfig';
import {Navigation} from 'react-native-navigation';

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
