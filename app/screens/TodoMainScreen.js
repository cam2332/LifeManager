import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  DarkMode,
  PrimaryColor,
  SecondaryColor,
  SecondaryNegativeColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';

const TodoMainScreen = (props) => {

  const UpdateListFromSearch = (text) => {
  };

  const OnChangeSearchText = (newValue) => {
    UpdateListFromSearch(newValue);
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        title={'Lista zadań'}
        textColor={DarkMode ? SecondaryNegativeColor : PrimaryColor}
        iconsColor={DarkMode ? SecondaryNegativeColor : PrimaryColor}
        backgroundColor={DarkMode ? SecondaryThreeFourthColor : SecondaryColor}
        borderColor={DarkMode ? SecondaryThreeFourthColor : PrimaryColor}
        sideMenuButtonVisible={true}
        searchButtonVisible={true}
        searchBarTextPlaceholder={'Wpisz nazwę listy'}
        OnChangeSearchText={(text) => OnChangeSearchText(text)}
        OnEndTypingSearch={(text) => UpdateListFromSearch(text)}
        OnCancelTypingSearch={UpdateTodoList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default TodoMainScreen;
