import {darkMode, PRIMARY_COLOR, SECONDARY_COLOR} from './AppConfig';
import {Navigation} from 'react-native-navigation';

export const LEFT_SIDE_MENU_ID = 'LeftSideMenu';
export const LOGIN_SCREEN_ID = 'LoginScreen';
export const REGISTER_SCREEN_ID = 'RegisterScreen';
export const NOTE_STACK_ID = 'NoteStack';
export const NOTE_MAIN_SCREEN_ID = 'NoteMainScreen';
export const NOTE_EDIT_SCREEN_ID = 'NoteEditScreen';
export const TASK_STACK_ID = 'TaskStack';
export const TASK_MAIN_SCREEN_ID = 'TaskMainScreen';
export const TASK_EDIT_SCREEN_ID = 'TaskEditScreen';
export const SETTINGS_STACK_ID = 'SettingsStack';
export const SETTINGS_SCREEN_ID = 'SettingsScreen';

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
      id: LOGIN_SCREEN_ID,
      name: LOGIN_SCREEN_ID,
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
      id: REGISTER_SCREEN_ID,
      name: REGISTER_SCREEN_ID,
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

export const SetTaskRoot = () => {
  if (currentScreenId !== TASK_MAIN_SCREEN_ID) {
    Navigation.setRoot(taskStack);
  }
};

const taskStack = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: LEFT_SIDE_MENU_ID,
          name: LEFT_SIDE_MENU_ID,
        },
      },
      center: {
        stack: {
          id: TASK_STACK_ID,
          children: [
            {
              component: {
                id: TASK_MAIN_SCREEN_ID,
                name: TASK_MAIN_SCREEN_ID,
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
              backgroundColor: SECONDARY_COLOR,
              style: darkMode ? 'light' : 'dark',
            },
          },
        },
      },
      options: {
        sideMenu: {
          left: {
            width: '320',
          },
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
  if (currentScreenId !== NOTE_MAIN_SCREEN_ID) {
    Navigation.setRoot(noteStack);
  }
};

const noteStack = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: LEFT_SIDE_MENU_ID,
          name: LEFT_SIDE_MENU_ID,
        },
      },
      center: {
        stack: {
          id: NOTE_STACK_ID,
          children: [
            {
              component: {
                id: NOTE_MAIN_SCREEN_ID,
                name: NOTE_MAIN_SCREEN_ID,
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
  Navigation.mergeOptions(LEFT_SIDE_MENU_ID, {
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
  Navigation.push(NOTE_STACK_ID, {
    component: {
      id: NOTE_EDIT_SCREEN_ID,
      name: NOTE_EDIT_SCREEN_ID,
      passProps: props,
      options: {
        topBar: {
          visible: false,
        },
      },
    },
  });
};

export const NavigateToTaskEditScreen = (props) => {
  Navigation.push(TASK_STACK_ID, {
    component: {
      id: TASK_EDIT_SCREEN_ID,
      name: TASK_EDIT_SCREEN_ID,
      passProps: props,
      options: {
        topBar: {
          visible: false,
        },
      },
    },
  });
};

export const SetSettingsRoot = () => {
  if (currentScreenId !== SETTINGS_SCREEN_ID) {
    Navigation.setRoot(settingsStack);
  }
};

const settingsStack = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: LEFT_SIDE_MENU_ID,
          name: LEFT_SIDE_MENU_ID,
        },
      },
      center: {
        stack: {
          id: SETTINGS_STACK_ID,
          children: [
            {
              component: {
                id: SETTINGS_SCREEN_ID,
                name: SETTINGS_SCREEN_ID,
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
              backgroundColor: SECONDARY_COLOR,
              style: darkMode ? 'light' : 'dark',
            },
          },
        },
      },
      options: {
        sideMenu: {
          left: {
            width: '320',
          },
        },
        statusBar: {
          backgroundColor: SECONDARY_COLOR,
          style: darkMode ? 'light' : 'dark',
        },
      },
    },
  },
};
