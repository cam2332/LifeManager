import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  darkMode,
  dialogBackgroundColor,
  primaryColor,
  primaryDarkColor,
  secondaryColor,
  secondaryNegativeColor,
  secondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import * as TaskApi from '../services/TaskApi';
import * as CategoryApi from '../services/CategoryApi';
import Icon from 'react-native-vector-icons/Ionicons';
import TaskCard from '../components/TaskCard';
import AddCategoryDialog from '../components/dialogs/AddCategoryDialog';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import SnackBar from '../components/SnackBar';

const SortTaskList = (taskList) => {
  return taskList.sort(
    (a, b) =>
      (a.done && b.done && 0) ||
      (a.done && !b.done && 1) ||
      (!a.done && b.done && -1) ||
      (a.startDate &&
        b.startDate &&
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
  );
};

const TaskMainScreen = (props) => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTaskList, setSelectedTaskList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(undefined);
  const [addCategoryDialogVisible, setInputDialogVisible] = useState(false);
  const [
    deleteCategoryDialogVisible,
    setDeleteCategoryDialogVisible,
  ] = useState(false);

  const snackBarVisibilityDuration = 4000;
  const snackBarRef = useRef();

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      addCategoryDialogVisible || deleteCategoryDialogVisible
        ? darkMode
          ? secondaryColor
          : dialogBackgroundColor
        : secondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  useEffect(() => {
    UpdateTaskList();
    UpdateCategoryList();
  }, []);

  const UpdateCategoryList = () => {
    CategoryApi.GetCategories()
      .then((newCategories) => {
        setCategories(newCategories);
        setCategory(undefined);
        setIsFetching(false);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas ładowania kategorii.',
          snackBarVisibilityDuration,
          'Ponów',
          true,
          () => UpdateCategoryList,
        );
      });
  };

  const UpdateTaskList = () => {
    TaskApi.GetAllTasks()
      .then((tasks) => {
        if (tasks.length > 0) {
          setTaskList(SortTaskList(tasks));
        } else {
          setTaskList([]);
        }
        setIsFetching(false);
      })
      .catch((error) => {
        setTaskList([]);
        setIsFetching(false);
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas ładowania zadań.',
          snackBarVisibilityDuration,
          'Ponów',
          true,
          () => UpdateTaskList,
        );
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    UpdateTaskList();
    UpdateCategoryList();
    setSelectMode(false);
    setSelectedTaskList([]);
  };

  const UpdateListFromSearch = (text) => {
    if (category === undefined) {
      TaskApi.GetTasksByTitle(text)
        .then((tasks) => {
          setTaskList(tasks);
          setIsFetching(false);
        })
        .catch((error) => {
          setTaskList([]);
          setIsFetching(false);
          snackBarRef.current.ShowSnackBar(
            'Wystąpił błąd podczas ładowania zadań.',
            snackBarVisibilityDuration,
            'Ponów',
            true,
            () => UpdateTaskList,
          );
        });
    } else {
      TaskApi.GetTasksByTitleAndCategoryId(
        text,
        typeof category === 'string' ? category : category.id,
      )
        .then((tasks) => {
          setTaskList(tasks);
          setIsFetching(false);
        })
        .catch((error) => {
          setTaskList([]);
          setIsFetching(false);
          snackBarRef.current.ShowSnackBar(
            'Wystąpił błąd podczas ładowania zadań.',
            snackBarVisibilityDuration,
            'Ponów',
            true,
            () => UpdateTaskList,
          );
        });
    }
  };

  const OnChangeSearchText = (newValue) => {
    UpdateListFromSearch(newValue);
  };

  const UpdateListFromCategory = (newCategory) => {
    TaskApi.GetTasksByCategoryId(
      typeof newCategory === 'string' || newCategory instanceof String
        ? newCategory
        : newCategory.id,
    )
      .then((tasks) => {
        setTaskList(SortTaskList(tasks));
        setIsFetching(false);
      })
      .catch((error) => {
        setTaskList([]);
        setIsFetching(false);
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas ładowania zadań.',
          snackBarVisibilityDuration,
          'Ponów',
          true,
          () => UpdateTaskList,
        );
      });
  };

  const AddCategory = (newCategory) => {
    CategoryApi.AddCategory(newCategory)
      .then(() => {
        categories.push(newCategory);
        setCategories([...categories]);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas dodawania kategorii.',
          snackBarVisibilityDuration,
          '',
          false,
        );
      });
  };

  const DeleteCategory = (categoryId) => {
    CategoryApi.DeleteCategory(categoryId)
      .then(() => {
        setCategories(
          categories.filter((category1) => category1.id !== categoryId),
        );
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas usuwania kategorii.',
          snackBarVisibilityDuration,
          '',
          false,
        );
      });
  };

  const ChangeCategory = (newCategory) => {
    if (category === undefined) {
      setCategory(newCategory);
      UpdateListFromCategory(newCategory);
    } else if (newCategory === category) {
      setCategory(undefined);
      UpdateTaskList();
    } else if (newCategory) {
      setCategory(newCategory);
      UpdateListFromCategory(newCategory);
    } else {
      setCategory(undefined);
      UpdateTaskList();
    }
  };

  const ChangeIsDone = (taskId, isDone) => {
    TaskApi.ChangeTaskIsDone(taskId, !isDone)
      .then(() => {
        const foundTask = taskList.find((task) => task.id === taskId);
        foundTask.done = !isDone;
        setTaskList(SortTaskList([...taskList]));
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas zmiany statusu zadania.',
          snackBarVisibilityDuration,
          '',
          false,
        );
      });
  };

  const ChangeIsFavorite = (taskId, isFavorite) => {
    TaskApi.ChangeTaskIsFavorite(taskId, !isFavorite)
      .then(() => {
        const foundTask = taskList.find((task) => task.id === taskId);
        foundTask.favorite = !isFavorite;
        setTaskList([...taskList]);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas dodawania zadania do ulubionych.',
          snackBarVisibilityDuration,
          '',
          false,
        );
      });
  };

  const ToggleSelectTask = (taskId, select) => {
    if (select) {
      selectedTaskList.push(taskId);
      setSelectedTaskList([...selectedTaskList]);
    } else {
      if (selectedTaskList.length === 1) {
        setSelectMode(false);
      }
      setSelectedTaskList(
        selectedTaskList.filter((taskId1) => taskId1 !== taskId),
      );
    }
  };

  const EndSelectMode = () => {
    setSelectMode(false);
    setSelectedTaskList([]);
  };

  const AddTask = () => {
    OpenEditTaskScreen({});
  };

  const DeleteSelectedTasks = () => {
    setIsDeleting(true);
    TaskApi.DeleteTasks(selectedTaskList)
      .then(() => {
        setTaskList(
          taskList.filter((task) => !selectedTaskList.includes(task.id)),
        );
        setSelectMode(false);
        setSelectedTaskList([]);
        setIsDeleting(false);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas usuwania zadań.',
          snackBarVisibilityDuration,
          'Ponów',
          true,
          () => DeleteSelectedTasks,
        );
      });
  };

  const OnDeleteTask = (taskId) => {
    setTaskList(taskList.filter((task) => task.id !== taskId));
  };

  const OpenEditTaskScreen = (task) => {
    NavigationHelperFunctions.NavigateToTaskEditScreen({
      task,
      OnDeleteTask: (taskId) => OnDeleteTask(taskId),
      OnPressBack: (updatedTask) => {
        if (Object.keys(task).length === 0) {
          if (Object.keys(updatedTask).length > 0 && updatedTask.id) {
            setTaskList(SortTaskList([...taskList, updatedTask]));
          }
        } else {
          const index = taskList.findIndex(
            (task1) => task1.id === updatedTask.id,
          );
          if (index > -1) {
            taskList[index] = {...taskList[index], ...updatedTask};
            setTaskList(SortTaskList([...taskList]));
          }
        }
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        title={selectMode ? selectedTaskList.length.toString() : 'Lista zadań'}
        textColor={darkMode ? secondaryNegativeColor : secondaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : secondaryColor}
        backgroundColor={darkMode ? secondaryThreeFourthColor : primaryColor}
        borderColor={darkMode ? secondaryThreeFourthColor : primaryColor}
        sideMenuButtonVisible={true}
        searchButtonVisible={!selectMode}
        rightCustomButton={{
          iconName: 'close-sharp',
          onPress: () => EndSelectMode(),
        }}
        rightCustomButtonVisible={selectMode}
        searchBarTextPlaceholder={'Wpisz nazwę zadania'}
        OnChangeSearchText={(text) => OnChangeSearchText(text)}
        OnEndTypingSearch={(text) => UpdateListFromSearch(text)}
        OnCancelTypingSearch={UpdateTaskList}
      />
      <View style={styles.categoriesContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  {borderColor: '#F2A30F'},
                  category === 'favorite' && {backgroundColor: '#F2A30F'},
                ]}
                onPress={() => {
                  ChangeCategory('favorite');
                }}>
                <Icon
                  style={styles.categoryButtonIcon}
                  name={'star-sharp'}
                  color={
                    category === 'favorite'
                      ? darkMode
                        ? secondaryNegativeColor
                        : secondaryColor
                      : '#F2A30F'
                  }
                  size={21}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        category === 'favorite'
                          ? darkMode
                            ? secondaryNegativeColor
                            : secondaryColor
                          : '#F2A30F',
                    },
                  ]}>
                  {'Ulubione'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  {borderColor: '#603e9e'},
                  category === 'planned' && {backgroundColor: '#603e9e'},
                ]}
                onPress={() => {
                  ChangeCategory('planned');
                }}>
                <Icon
                  style={styles.categoryButtonIcon}
                  name={'time-sharp'}
                  color={
                    category === 'planned'
                      ? darkMode
                        ? secondaryNegativeColor
                        : secondaryColor
                      : '#603e9e'
                  }
                  size={21}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        category === 'planned'
                          ? darkMode
                            ? secondaryNegativeColor
                            : secondaryColor
                          : '#603e9e',
                    },
                  ]}>
                  {'Zaplanowane'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  {borderColor: '#ffcf00'},
                  category === 'notification' && {backgroundColor: '#ffcf00'},
                ]}
                onPress={() => {
                  ChangeCategory('notification');
                }}>
                <Icon
                  style={styles.categoryButtonIcon}
                  name={'notifications-sharp'}
                  color={
                    category === 'notification'
                      ? darkMode
                        ? secondaryNegativeColor
                        : secondaryColor
                      : '#ffcf00'
                  }
                  size={21}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        category === 'notification'
                          ? darkMode
                            ? secondaryNegativeColor
                            : secondaryColor
                          : '#ffcf00',
                    },
                  ]}>
                  {'Powiadomienia'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                ChangeCategory(item);
              }}
              onLongPress={() => {
                if (
                  category
                    ? typeof category === 'string'
                      ? item.id !== category
                      : item.id !== category.id
                    : true
                ) {
                  setCategoryToDelete(item.id);
                  setDeleteCategoryDialogVisible(true);
                }
              }}
              style={[
                styles.categoryButton,
                {borderColor: item.color},
                category === item && {backgroundColor: item.color},
              ]}>
              {item.icon && (
                <Icon
                  style={styles.categoryButtonIcon}
                  name={item.icon}
                  color={
                    category === item
                      ? darkMode
                        ? secondaryNegativeColor
                        : secondaryColor
                      : item.color
                  }
                  size={21}
                />
              )}
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      category === item
                        ? darkMode
                          ? secondaryNegativeColor
                          : secondaryColor
                        : item.color,
                  },
                ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              style={[
                styles.addCategoryButton,
                {backgroundColor: primaryColor},
              ]}
              onPress={() => setInputDialogVisible(true)}>
              <Icon
                style={styles.addCategoryButtonIcon}
                name={'add-sharp'}
                color={darkMode ? secondaryNegativeColor : secondaryColor}
                size={28}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={taskList}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TaskCard
              task={item}
              backgroundColor={darkMode ? primaryDarkColor : primaryColor}
              titleColor={darkMode ? secondaryNegativeColor : secondaryColor}
              textColor={darkMode ? secondaryNegativeColor : secondaryColor}
              OnLongPressCard={() => {
                !isDeleting && !selectMode && setSelectMode(true);
                !isDeleting && !selectMode && ToggleSelectTask(item.id, true);
              }}
              OnPressCard={() => {
                !isDeleting &&
                  selectMode &&
                  ToggleSelectTask(
                    item.id,
                    !selectedTaskList.includes(item.id),
                  );
                !isDeleting && !selectMode && OpenEditTaskScreen(item);
              }}
              selected={selectedTaskList.includes(item.id)}
              selectMode={selectMode}
              OnChangeIsDone={() => {
                ChangeIsDone(item.id, item.done);
              }}
              OnChangeIsFavorite={() => {
                ChangeIsFavorite(item.id, item.favorite);
              }}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={[styles.floatingButton, {backgroundColor: primaryColor}]}
        onPress={() => (selectMode ? DeleteSelectedTasks() : AddTask())}>
        <Icon
          name={selectMode ? 'trash-sharp' : 'add-sharp'}
          size={30}
          color={darkMode ? secondaryNegativeColor : secondaryColor}
        />
      </TouchableOpacity>
      <AddCategoryDialog
        title={'Nowa kategoria'}
        visible={addCategoryDialogVisible}
        placeholder={'Nowa kategoria'}
        OnPressConfirm={(text, error) => {
          AddCategory(text);
          setInputDialogVisible(false);
        }}
        OnPressCancel={() => setInputDialogVisible(false)}
        ValidateTextInput={(newText) =>
          categories.map((category) => category.text).indexOf(newText) !== -1
        }
      />
      <ConfirmDialog
        visible={deleteCategoryDialogVisible}
        title={'Usuń'}
        description={'Czy na pweno chcesz usunąć tą kategorię'}
        OnPressConfirm={() => {
          DeleteCategory(categoryToDelete);
          setDeleteCategoryDialogVisible(false);
        }}
        OnPressCancel={() => setDeleteCategoryDialogVisible(false)}
      />
      <SnackBar ref={snackBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 16,
    marginHorizontal: 17,
  },
  categoryButton: {
    flexDirection: 'row',
    marginHorizontal: 6,
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 15,
  },
  addCategoryButton: {
    flexDirection: 'row',
    marginHorizontal: 7,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addCategoryButtonIcon: {
    alignSelf: 'center',
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
    borderRadius: 30,
    elevation: 7,
  },
});

export default TaskMainScreen;
