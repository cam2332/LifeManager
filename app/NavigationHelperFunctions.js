import {DarkMode, PrimaryColor, SecondaryColor} from './AppConfig';
import {Navigation} from 'react-native-navigation';

const noteScreenId = 'NoteMainScreen';
export let currentScreenId = '';
export function SetCurrentScreenId(id) {
  currentScreenId = id;
}

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

export const SetNoteRoot = () => {
  if (currentScreenId !== noteScreenId) {
    Navigation.setRoot(noteStack);
  }
};

const noteStack = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: 'LeftSideMenu',
          name: 'LeftSideMenu',
        },
      },
      center: {
        stack: {
          id: 'NoteStack',
          children: [
            {
              component: {
                id: 'NoteMainScreen',
                name: 'NoteMainScreen',
                options: {
                  topBar: {
                    visible: false,
                  },
                },
              },
            },
          ],
          options: {
            statusBar: {
              backgroundColor: PrimaryColor,
              style: DarkMode ? 'light' : 'dark',
            },
          },
        },
      },
      right: {
        component: {
          id: 'LeftSideMenu',
          name: 'LeftSideMenu',
        },
      },
      options: {
        sideMenu: {
          left: {
            width: '320',
          },
        },
        statusBar: {
          backgroundColor: PrimaryColor,
          style: DarkMode ? 'light' : 'dark',
        },
      },
    },
  },
};

export const OpenLeftSideMenu = () => {
  Navigation.mergeOptions('LeftSideMenu', {
    sideMenu: {
      left: {
        visible: true,
      },
    },
  });
};

export const MoveBackOneScreen = (stackId) => {
  Navigation.pop(stackId).catch((reason) => console.log(reason));
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
