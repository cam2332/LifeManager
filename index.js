import {Navigation} from 'react-native-navigation';
import * as NavigationHelperFunctions from './app/NavigationHelperFunctions';
import {SECONDARY_COLOR} from './app/AppConfig';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import LeftSideMenu from './app/screens/LeftSideMenu';
import NoteMainScreen from './app/screens/NoteMainScreen';
import NoteEditScreen from './app/screens/NoteEditScreen';
import TaskMainScreen from './app/screens/TaskMainScreen';

Navigation.registerComponent(NavigationHelperFunctions.LOGIN_SCREEN_ID, () =>
  gestureHandlerRootHOC(LoginScreen),
);

Navigation.registerComponent(NavigationHelperFunctions.REGISTER_SCREEN_ID, () =>
  gestureHandlerRootHOC(RegisterScreen),
);

Navigation.registerComponent(NavigationHelperFunctions.LEFT_SIDE_MENU_ID, () =>
  gestureHandlerRootHOC(LeftSideMenu),
);

Navigation.registerComponent(
  NavigationHelperFunctions.NOTE_MAIN_SCREEN_ID,
  () => gestureHandlerRootHOC(NoteMainScreen),
);

Navigation.registerComponent(
  NavigationHelperFunctions.NOTE_EDIT_SCREEN_ID,
  () => gestureHandlerRootHOC(NoteEditScreen),
);

Navigation.registerComponent(
  NavigationHelperFunctions.TASK_MAIN_SCREEN_ID,
  () => gestureHandlerRootHOC(TaskMainScreen),
);
);

Navigation.setDefaultOptions({
  layout: {
    backgroundColor: SECONDARY_COLOR,
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  NavigationHelperFunctions.SetNoteRoot();
});
