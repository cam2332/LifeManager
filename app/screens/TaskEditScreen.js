import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  darkMode,
  dialogBackgroundColor,
  primaryColor,
  secondaryColor,
  secondaryThreeFourthColor,
  SECONDARY_HALF_COLOR,
  secondaryNegativeColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import * as LocalizationHelperFunctions from '../LocalizationHelperFunctions';
import DateTimePickerDialog from '../components/dialogs/DateTimePickerDialog';
import * as TaskApi from '../services/TaskApi';
import * as CategoryApi from '../services/CategoryApi';
import SnackBar from '../components/SnackBar';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import CategoryPickerDialog from '../components/dialogs/CategoryPickerDialog';
import * as NotificationApi from '../services/NotificationApi';
import * as CalendarApi from '../services/CalendarApi';

const TaskEditScreen = (props) => {
  const [id, setId] = useState(props.task.id);
  const [taskName, setTaskName] = useState(props.task.title || '');
  const [startDate, setStartDate] = useState(
    props.task.startDate && new Date(props.task.startDate),
  );
  const [
    startDatePickerDialogVisible,
    setStartDatePickerDialogVisible,
  ] = useState(false);
  const [endDate, setEndDate] = useState(
    props.task.endDate && new Date(props.task.endDate),
  );
  const [endDatePickerDialogVisible, setEndDatePickerDialogVisible] = useState(
    false,
  );
  const [category, setCategory] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [
    categoryPickerDialogVisible,
    setCategoryPickerDialogVisible,
  ] = useState(false);
  const [note, setNote] = useState(props.task.note || '');
  const [notificationDate, setNotificationDate] = useState(
    props.task.notificationDate && new Date(props.task.notificationDate),
  );
  const [notificationId, setNotificationId] = useState(
    props.task.notificationId || '',
  );
  const [
    notificationDatePickerDialogVisible,
    setNotificationDatePickerDialogVisible,
  ] = useState(false);
  const [saveToCalendar, setSaveToCalendar] = useState(
    props.task.saveToCalendar || false,
  );
  const [calendarEventId, setCalendarEventId] = useState(
    props.task.calendarEventId || '',
  );
  const [
    deleteTaskConfirmDialogVisible,
    setDeleteTaskConfirmDialogVisible,
  ] = useState(false);

  const snackBarRef = useRef();

  const clearButtonSize = 18;

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      endDatePickerDialogVisible ||
        notificationDatePickerDialogVisible ||
        deleteTaskConfirmDialogVisible ||
        categoryPickerDialogVisible
        ? darkMode
          ? secondaryColor
          : dialogBackgroundColor
        : secondaryColor,
    );
  }, [
    endDatePickerDialogVisible,
    notificationDatePickerDialogVisible,
    deleteTaskConfirmDialogVisible,
    categoryPickerDialogVisible,
  ]);

  useEffect(() => {
    CategoryApi.GetCategories()
      .then((newCategories) => {
        setCategories(newCategories);
        setCategory(
          newCategories.find(
            (category) => category.id === props.task.categoryId,
          ),
        );
        console.log(
          'cat find',
          newCategories.find(
            (category) => category.id === props.task.categoryId,
          ),
        );
      })
      .catch((error) => console.log(error));
    BackHandler.addEventListener('hardwareBackPress', OnPressBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', OnPressBack);
  }, []);

  const OnPressBack = () => {
    props.OnPressBack({
      id,
      title: taskName,
      startDate,
      endDate,
      ...(id && category && {categoryId: category.id || ''}),
      note,
      notificationDate,
      saveToCalendar,
    });
  };

  const TaskNameInputEndEditing = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskTitle(id, taskName).catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
    }
  };

  const OnClearTaskName = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskTitle(id, '')
        .then(() => {
          setTaskName('');
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setTaskName('');
    }
  };

  const OnChangeStartDate = (date) => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskStartDate(id, date.toString())
        .then(() => {
          setStartDate(date);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setStartDate(date);
    }
  };

  const OnClearStartDate = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskStartDate(id, undefined)
        .then(() => {
          setStartDate(undefined);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setStartDate(undefined);
    }
  };

  const OnChangeEndDate = (date) => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskEndDate(id, date.toString())
        .then(() => {
          setEndDate(date);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setEndDate(date);
    }
  };

  const OnClearEndDate = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskEndDate(id, undefined)
        .then(() => {
          setEndDate(undefined);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setEndDate(undefined);
    }
  };

  const OnChangeCategory = (newCategory) => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskCategoryId(id, newCategory.id)
        .then(() => {
          setCategory(newCategory);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setCategory(newCategory);
    }
  };

  const OnClearCategory = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskCategoryId(id, undefined)
        .then(() => {
          setCategory(undefined);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setCategory(undefined);
    }
  };

  const NoteInputEndEditing = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskNote(id, note).catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
    }
  };

  const OnClearNote = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      TaskApi.ChangeTaskNote(id, '').catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
    } else {
      setNote('');
    }
  };

  const CreateNotification = (newNotificationDate) => {
    return NotificationApi.CreateTaskNotification({
      id,
      title: taskName,
      startDate,
      endDate,
      category,
      note,
      notificationDate: newNotificationDate || notificationDate,
      saveToCalendar,
      calendarEventId,
    });
  };

  const SetNotification = (date) => {
    if (id !== null && id !== undefined && id.length > 0) {
      let notifId;
      if (notificationId && notificationDate) {
        NotificationApi.CancelNotification(notificationId);
      } else {
        notifId = CreateNotification(date);
        setNotificationDate(date);
        setNotificationId(notifId);
      }
      TaskApi.ChangeTaskNotification(id, notifId, date)
        .then(() => {
          setNotificationDate(date);
          setNotificationId(notifId);
        })
        .catch((error) => {
          NotificationApi.CancelNotification(notifId);
          setNotificationDate(undefined);
          setNotificationId(undefined);
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      setNotificationDate(date);
    }
  };

  const OnCancelNotification = () => {
    if (id !== null && id !== undefined && id.length > 0) {
      if (notificationId && notificationDate) {
        TaskApi.ChangeTaskNotification(id, undefined, undefined)
          .then(() => {
            NotificationApi.CancelNotification(notificationId);
            setNotificationDate(undefined);
            setNotificationId(undefined);
          })
          .catch((error) => {
            NotificationApi.CancelNotification(notificationId);
            setNotificationDate(undefined);
            setNotificationId(undefined);
            snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          });
      }
    } else {
      setNotificationDate(undefined);
      setNotificationId(undefined);
    }
  };

  const CreateCalendarEvent = async () => {
    return await CalendarApi.SaveEvent(taskName, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      notes: note,
      description: note,
    });
  };

  const ChangeSaveToCalendar = async (value) => {
    if (value) {
      if (id !== null && id !== undefined && id.length > 0) {
        const calendarEventId = await CreateCalendarEvent();
        TaskApi.ChangeTaskCalendarEvent(id, value, calendarEventId)
          .then(() => {
            setSaveToCalendar(value);
            setCalendarEventId(calendarEventId);
          })
          .catch((error) => {
            CalendarApi.DeleteEvent(calendarEventId);
            setSaveToCalendar(undefined);
            setCalendarEventId(undefined);
            snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          });
      } else {
        setSaveToCalendar(value);
      }
    } else {
      if (id !== null && id !== undefined && id.length > 0) {
        TaskApi.ChangeTaskCalendarEvent(id, false, undefined)
          .then(() => {
            CalendarApi.DeleteEvent(calendarEventId);
            setSaveToCalendar(false);
            setCalendarEventId(undefined);
          })
          .catch((error) => {
            CalendarApi.DeleteEvent(calendarEventId);
            setSaveToCalendar(false);
            setCalendarEventId(undefined);
            snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          });
      } else {
        setSaveToCalendar(false);
        setCalendarEventId(undefined);
      }
    }
  };

  const DeleteTask = () => {
    setDeleteTaskConfirmDialogVisible(true);
  };

  const ConfirmDeleteTask = () => {
    setDeleteTaskConfirmDialogVisible(false);
    TaskApi.DeleteTask(id)
      .then(() => {
        TaskApi.ChangeTaskNotification(undefined, undefined)
          .then(() => {
            NotificationApi.CancelNotification(notificationId);
            setNotificationDate(undefined);
            setNotificationId(undefined);
          })
          .catch((error) => {
            NotificationApi.CancelNotification(notificationId);
            setNotificationDate(undefined);
            setNotificationId(undefined);
            snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          });
        TaskApi.ChangeTaskCalendarEvent(id, false, undefined)
          .then(() => {
            CalendarApi.DeleteEvent(calendarEventId);
            setSaveToCalendar(false);
            setCalendarEventId(undefined);
          })
          .catch((error) => {
            CalendarApi.DeleteEvent(calendarEventId);
            setSaveToCalendar(false);
            setCalendarEventId(undefined);
            snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          });
        NavigationHelperFunctions.MoveBackOneScreen(
          NavigationHelperFunctions.TASK_STACK_ID,
        );
        props.OnDeleteTask(id);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
  };

  const CreateTask = () => {
    TaskApi.CreateTask({
      title: taskName,
      startDate,
      endDate,
      categoryId: category ? category.id : undefined,
      note,
      ...(notificationDate && {notificationId: CreateNotification()}),
      notificationDate,
      saveToCalendar,
    })
      .then((createdTask) => {
        setId(createdTask.id);
        OnPressBack(createdTask);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
  };

  const elementTitleStyle = StyleSheet.flatten([
    styles.elementTitle,
    {color: secondaryNegativeColor},
  ]);

  const dateButtonStyle = StyleSheet.flatten([
    styles.dateButton,
    {borderColor: primaryColor},
  ]);

  const dateButtonTextStyle = StyleSheet.flatten([
    styles.dateButtonText,
    {color: primaryColor},
  ]);

  const textInputStyle = StyleSheet.flatten([
    styles.textInput,
    {borderColor: primaryColor, color: secondaryNegativeColor},
  ]);

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        title={id ? 'Edytuj zadanie' : 'Nowe zadanie'}
        textColor={darkMode ? secondaryNegativeColor : primaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : primaryColor}
        backgroundColor={secondaryColor}
        OnPressBack={OnPressBack}
        backButtonVisible={true}
        rightCustomButton={{
          iconName: 'trash-sharp',
          onPress: DeleteTask,
        }}
        rightCustomButtonVisible={
          id !== null && id !== undefined && id.length > 0
        }
        stackId={NavigationHelperFunctions.TASK_STACK_ID}
      />

      <ScrollView
        style={styles.taskContainer}
        contentContainerStyle={{justifyContent: 'space-around'}}>
        <KeyboardAvoidingView style={[styles.taskInnerContainer]}>
          <Text style={elementTitleStyle}>Nazwa zadania</Text>
          <View
            style={[
              styles.taskNameInputContainer,
              {borderColor: primaryColor, color: secondaryNegativeColor},
            ]}>
            <TextInput
              style={textInputStyle}
              defaultValue={taskName}
              placeholder={'Nazwa zadania'}
              placeholderTextColor={SECONDARY_HALF_COLOR}
              onChangeText={(newText) => setTaskName(newText)}
              onEndEditing={TaskNameInputEndEditing}
            />
            <TouchableOpacity
              style={styles.inputCancelButton}
              onPress={() => OnClearTaskName()}>
              <Icon
                style={styles.inputCancelButtonIcon}
                name="close-sharp"
                color={darkMode ? secondaryNegativeColor : primaryColor}
                size={clearButtonSize}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
          <Text style={elementTitleStyle}>Data rozpoczęcia</Text>
          {startDate ? (
            <TouchableOpacity
              style={[
                styles.startEndDateContainer,
                {borderColor: primaryColor, color: secondaryNegativeColor},
              ]}
              onPress={() => {
                setStartDatePickerDialogVisible(true);
              }}>
              <View style={[styles.notificationDateButton]}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>
                  {(startDate &&
                    `${LocalizationHelperFunctions.datePL(
                      startDate,
                    )} ${LocalizationHelperFunctions.time(startDate)}`) ||
                    ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.inputCancelButton}
                onPress={() => OnClearStartDate()}>
                <Icon
                  style={styles.inputCancelButtonIcon}
                  name="close-sharp"
                  color={darkMode ? secondaryNegativeColor : primaryColor}
                  size={clearButtonSize}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.datesList}>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() => OnChangeStartDate(new Date())}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Dzisiaj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() =>
                  OnChangeStartDate(
                    new Date(new Date().setDate(new Date().getDate() + 1)),
                  )
                }>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Jutro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() => setStartDatePickerDialogVisible(true)}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Inny dzień</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.spacer} />
          <Text style={elementTitleStyle}>Data ukończenia</Text>
          {endDate ? (
            <TouchableOpacity
              style={[
                styles.startEndDateContainer,
                {borderColor: primaryColor, color: secondaryNegativeColor},
              ]}
              onPress={() => {
                setEndDatePickerDialogVisible(true);
              }}>
              <View style={[styles.notificationDateButton]}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>
                  {(endDate &&
                    `${LocalizationHelperFunctions.datePL(
                      endDate,
                    )} ${LocalizationHelperFunctions.time(endDate)}`) ||
                    ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.inputCancelButton}
                onPress={() => OnClearEndDate()}>
                <Icon
                  style={styles.inputCancelButtonIcon}
                  name="close-sharp"
                  color={darkMode ? secondaryNegativeColor : primaryColor}
                  size={clearButtonSize}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.datesList}>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() => OnChangeEndDate(new Date())}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Dzisiaj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() =>
                  OnChangeEndDate(
                    new Date(new Date().setDate(new Date().getDate() + 1)),
                  )
                }>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Jutro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dateButtonStyle}
                onPress={() => setEndDatePickerDialogVisible(true)}>
                <Icon
                  style={styles.calendarIcon}
                  name="calendar-sharp"
                  color={primaryColor}
                  size={22}
                />
                <Text style={dateButtonTextStyle}>Inny dzień</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.spacer} />
          <Text style={elementTitleStyle}>Kategoria</Text>
          <TouchableOpacity
            style={[
              styles.categoryContainer,
              {borderColor: primaryColor, color: secondaryNegativeColor},
            ]}
            onPress={() => {
              setCategoryPickerDialogVisible(true);
            }}>
            <View style={styles.optionContainer}>
              {category && category.icon && (
                <Icon
                  style={!category.icon && {width: 0}}
                  name={category.icon || 'add-sharp'}
                  color={category.icon ? category.color : secondaryColor}
                  size={24}
                />
              )}
              {category && category.color && category.text && (
                <Text style={[styles.optionText, {color: category.color}]}>
                  {category.text}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.inputCancelButton}
              onPress={() => OnClearCategory()}>
              <Icon
                style={styles.inputCancelButtonIcon}
                name="close-sharp"
                color={darkMode ? secondaryNegativeColor : primaryColor}
                size={clearButtonSize}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <Text style={elementTitleStyle}>Notatka</Text>
          <View
            style={[
              styles.noteInputContainer,
              {borderColor: primaryColor, color: secondaryNegativeColor},
            ]}>
            <TextInput
              style={textInputStyle}
              defaultValue={note}
              placeholder={'Notatka'}
              placeholderTextColor={SECONDARY_HALF_COLOR}
              onChangeText={setNote}
              onEndEditing={NoteInputEndEditing}
            />
            <TouchableOpacity
              style={styles.inputCancelButton}
              onPress={() => OnClearNote()}>
              <Icon
                style={styles.inputCancelButtonIcon}
                name="close-sharp"
                color={darkMode ? secondaryNegativeColor : primaryColor}
                size={clearButtonSize}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
          <Text style={elementTitleStyle}>Przypomnij</Text>
          <TouchableOpacity
            style={[
              styles.notificationDateContainer,
              {borderColor: primaryColor, color: secondaryNegativeColor},
            ]}
            onPress={() => {
              setNotificationDatePickerDialogVisible(true);
            }}>
            <View style={[styles.notificationDateButton]}>
              <Icon
                style={styles.calendarIcon}
                name="calendar-sharp"
                color={primaryColor}
                size={21}
              />
              <Text style={dateButtonTextStyle}>
                {(notificationDate &&
                  `${LocalizationHelperFunctions.datePL(
                    notificationDate,
                  )} ${LocalizationHelperFunctions.time(notificationDate)}`) ||
                  ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.inputCancelButton}
              onPress={() => OnCancelNotification()}>
              <Icon
                style={styles.inputCancelButtonIcon}
                name="close-sharp"
                color={darkMode ? secondaryNegativeColor : primaryColor}
                size={clearButtonSize}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <View style={styles.switchContainer}>
            <Text style={elementTitleStyle}>Zapisz w kalendarzu</Text>
            <Switch
              value={saveToCalendar}
              onValueChange={ChangeSaveToCalendar}
              trackColor={{
                true: primaryColor,
                false: secondaryThreeFourthColor,
              }}
              thumbColor={darkMode ? SECONDARY_HALF_COLOR : secondaryColor}
            />
          </View>
          <View style={styles.spacer} />
          {!id && (
            <TouchableOpacity
              style={[styles.confirmButton, {backgroundColor: primaryColor}]}
              onPress={!id && CreateTask}>
              <Text style={styles.confirmButtonText}>{'UTWÓRZ ZADANIE'}</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </ScrollView>

      <DateTimePickerDialog
        visible={startDatePickerDialogVisible}
        date={startDate}
        OnPressConfirm={(date) => {
          if (date > endDate) {
            snackBarRef.current.ShowSnackBar(
              'Data rozpoczęcia powinna być przed zakończeniem.',
              2000,
              false,
            );
          } else {
            setStartDatePickerDialogVisible(false);
            OnChangeStartDate(date);
          }
        }}
        OnPressCancel={() => {
          setStartDatePickerDialogVisible(false);
        }}
      />
      <DateTimePickerDialog
        visible={endDatePickerDialogVisible}
        date={endDate}
        OnPressConfirm={(date) => {
          if (date < startDate) {
            snackBarRef.current.ShowSnackBar(
              'Data zakończenia powinna być później niż data rozpoczęcia.',
              2000,
              false,
            );
          } else {
            setEndDatePickerDialogVisible(false);
            OnChangeEndDate(date);
          }
        }}
        OnPressCancel={() => {
          setEndDatePickerDialogVisible(false);
        }}
      />
      <CategoryPickerDialog
        options={categories}
        selectedItem={category}
        OnSelectItem={(item) => {
          OnChangeCategory(item);
          setCategoryPickerDialogVisible(false);
        }}
        OnDismiss={() => setCategoryPickerDialogVisible(false)}
        visible={categoryPickerDialogVisible}
      />
      <DateTimePickerDialog
        visible={notificationDatePickerDialogVisible}
        date={notificationDate}
        OnPressConfirm={(date) => {
          if (date < startDate) {
            snackBarRef.current.ShowSnackBar(
              'Data powiadomienia powinna być później niż data rozpoczęcia.',
              2000,
              false,
            );
          } else {
            setNotificationDatePickerDialogVisible(false);
            SetNotification(date);
          }
        }}
        OnPressCancel={() => {
          setNotificationDatePickerDialogVisible(false);
        }}
      />
      <ConfirmDialog
        visible={deleteTaskConfirmDialogVisible}
        title="Usuń"
        description="Czy na pewno chcesz usunąć to zadanie?"
        confirmText="Usuń"
        OnPressConfirm={() => {
          ConfirmDeleteTask();
        }}
        OnPressCancel={() => {
          setDeleteTaskConfirmDialogVisible(false);
        }}
      />
      <SnackBar ref={snackBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  taskContainer: {
    paddingTop: 30,
    paddingHorizontal: 40,
    flex: 1,
  },
  taskInnerContainer: {
    flex: 1,
  },
  spacer: {
    paddingVertical: 17,
  },
  elementTitle: {
    fontSize: 19,
  },
  taskNameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  datesList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
  },
  calendarIcon: {
    justifyContent: 'center',
    marginRight: 10,
  },
  startEndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  noteInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  textInput: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  notificationDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  notificationDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDateText: {
    fontSize: 16,
  },
  inputCancelButton: {
    justifyContent: 'center',
  },
  inputCancelButtonIcon: {
    alignSelf: 'flex-end',
    padding: 2,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  optionText: {
    marginHorizontal: 5,
    fontSize: 17,
  },
  confirmButton: {
    borderRadius: 7,
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 100,
  },
  confirmButtonText: {
    color: darkMode ? secondaryNegativeColor : secondaryColor,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default TaskEditScreen;
