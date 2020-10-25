import {darkMode, PRIMARY_COLOR, SECONDARY_COLOR} from './AppConfig';
import {Navigation} from 'react-native-navigation';

export const noteStackId = 'NoteStack';
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
          backgroundColor: SECONDARY_COLOR,
          style: darkMode ? 'light' : 'dark',
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
          backgroundColor: SECONDARY_COLOR,
          style: darkMode ? 'light' : 'dark',
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
              backgroundColor: PRIMARY_COLOR,
              style: darkMode ? 'light' : 'dark',
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
          backgroundColor: PRIMARY_COLOR,
          style: darkMode ? 'light' : 'dark',
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
  style = darkMode ? 'light' : 'dark',
) => {
  Navigation.mergeOptions(screenId, {
    statusBar: {
      backgroundColor: backgroundColor,
      style: style,
    },
  });
};

export const NavigateToNoteEditScreen = (props) => {
  Navigation.push(noteStackId, {
    component: {
      id: 'NoteEditScreen',
      name: 'NoteEditScreen',
      passProps: props,
      options: {
        topBar: {
          visible: false,
        },
      },
    },
  });
};
