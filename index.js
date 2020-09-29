import {Navigation} from 'react-native-navigation';
import * as NavigationHelperFunctions from './app/NavigationHelperFunctions';
import {SecondaryColor} from './app/AppConfig';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import LeftSideMenu from './app/screens/LeftSideMenu';
import NoteMainScreen from './app/screens/NoteMainScreen';
import NoteEditScreen from './app/screens/NoteEditScreen';

Navigation.registerComponent('LoginScreen', () =>
  gestureHandlerRootHOC(LoginScreen),
);

Navigation.registerComponent('RegisterScreen', () =>
  gestureHandlerRootHOC(RegisterScreen),
);

Navigation.registerComponent('LeftSideMenu', () =>
  gestureHandlerRootHOC(LeftSideMenu),
);

Navigation.registerComponent('NoteMainScreen', () =>
  gestureHandlerRootHOC(NoteMainScreen),
);

Navigation.registerComponent('NoteEditScreen', () =>
  gestureHandlerRootHOC(NoteEditScreen),
);

Navigation.setDefaultOptions({
  layout: {
    backgroundColor: SecondaryColor,
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  NavigationHelperFunctions.SetNoteRoot();
});
