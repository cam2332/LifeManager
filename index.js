import {Navigation} from 'react-native-navigation';
import {SetLoginRoot} from './app/NavigationHelperFunctions';
import {SecondaryColor} from './app/AppConfig';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import LoginScreen from './app/screens/LoginScreen';

Navigation.registerComponent('LoginScreen', () =>
  gestureHandlerRootHOC(LoginScreen),
);

Navigation.events().registerAppLaunchedListener(() => {
  SetLoginRoot();
});
