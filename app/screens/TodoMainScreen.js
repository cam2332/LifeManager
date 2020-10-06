import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  DarkMode,
  PrimaryColor,
  SecondaryColor,
  SecondaryNegativeColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import TodoCard from '../components/TodoCard';

const TodoMainScreen = (props) => {
  const [todoList, setTodoList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      'TodoMainScreen',
      SecondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  const UpdateListFromSearch = (text) => {
  };

  const OnChangeSearchText = (newValue) => {
    UpdateListFromSearch(newValue);
  };

  const onRefresh = () => {
    setIsFetching(true);
    UpdateTodoList();
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
      <View style={styles.listContainer}>
        <FlatList
          data={todoList}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TodoCard
              todo={item}
              backgroundColor={DarkMode ? PrimaryDarkColor : PrimaryColor}
              titleColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
              textColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
});

export default TodoMainScreen;
