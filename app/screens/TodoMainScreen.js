import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  DarkMode,
  PrimaryColor,
  PrimaryDarkColor,
  SecondaryColor,
  SecondaryNegativeColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import Icon from 'react-native-vector-icons/Ionicons';
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

  const AddTodo = () => {};

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
      <TouchableOpacity style={styles.floatingButton} onPress={() => AddTodo()}>
        <Icon
          name={'add-sharp'}
          size={30}
          color={DarkMode ? SecondaryNegativeColor : SecondaryColor}
        />
      </TouchableOpacity>
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
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 17,
    right: 17,
    backgroundColor: DarkMode ? PrimaryDarkColor : PrimaryColor,
    borderColor: DarkMode ? SecondaryNegativeColor : SecondaryColor,
    borderWidth: 2,
    borderRadius: 10,
  },
});

export default TodoMainScreen;
