import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  BackHandler,
  Modal,
} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {
  darkMode,
  LIGHT_GREY,
  secondaryNegativeColor,
  primaryColor,
  secondaryColor,
  secondaryOneFourthColor,
  SECONDARY_HALF_COLOR,
  secondaryThreeFourthColor,
  dialogBackgroundColor,
} from '../../AppConfig';
import * as LocalizationHelperFunctions from '../../LocalizationHelperFunctions';
import Icon from 'react-native-vector-icons/Ionicons';

const circleSize = 320;
const symbolCircleSize = 40;

const DateTimePickerDialog = (props) => {
  const [dateTime, setDateTime] = useState(true);
  const [selectedDate, setSelectedDate] = useState(props.date || new Date());
  const [visibleDate, setVisibleDate] = useState(
    props.date ||
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds(),
      ),
  );
  const [selectedTime, setSelectedTime] = useState({
    hour:
      (props.date && new Date(props.date).getHours()) || new Date().getHours(),
    minute:
      (props.date && Math.round(new Date(props.date).getMinutes() / 5) * 5) ||
      Math.round(new Date().getMinutes() / 5) * 5,
  });
  const [minuteHourType, setMinuteHourType] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      OnPressBack,
    );
    if (props.visible) {
      setDateTime(true);
      setSelectedDate(props.date || new Date());
      setVisibleDate(
        props.date ||
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds(),
          ),
      );
      setSelectedTime({
        hour:
          (props.date && new Date(props.date).getHours()) ||
          new Date().getHours(),
        minute:
          (props.date &&
            Math.round(new Date(props.date).getMinutes() / 5) * 5) ||
          Math.round(new Date().getMinutes() / 5) * 5,
      });
      setMinuteHourType(false);
    }
    return () => {
      backHandler.remove();
    };
  }, [props.visible]);

  const OnPressBack = () => {
    props.OnPressCancel();
    return true;
  };

  const IncrementVisibleDateByMonth = () => {
    setVisibleDate(
      new Date(visibleDate.setMonth(visibleDate.getMonth() + 1, 1)),
    );
  };

  const DecrementVisibleDateByMonth = () => {
    setVisibleDate(
      new Date(visibleDate.setMonth(visibleDate.getMonth() - 1, 1)),
    );
  };

  const lastDayOfMonth = new Date(
    visibleDate.getFullYear(),
    visibleDate.getMonth() + 1,
    0,
  ).getDate();

  const selectedDayElement = (dayNumber, key) => (
    <View
      style={[styles.dateGridElement, dateSelectedGridElementStyle]}
      key={key}>
      <Text style={[dateGridElementTextStyle, {color: secondaryColor}]}>
        {dayNumber}
      </Text>
    </View>
  );

  const normalDayElement = (dayNumber, key) => (
    <TouchableOpacity
      style={styles.dateGridElement}
      key={key}
      onPress={() => {
        setSelectedDate(
          new Date(
            visibleDate.getFullYear(),
            visibleDate.getMonth(),
            dayNumber,
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds(),
          ),
        );
      }}>
      <Text style={dateGridElementTextStyle}>{dayNumber}</Text>
    </TouchableOpacity>
  );

  const emptyDayElement = (key) => (
    <View style={styles.dateGridElement} key={key}>
      <Text style={dateGridElementTextStyle} />
    </View>
  );

  const dayElement = (isSelected, key, dayNumber) => {
    return dayNumber > 0 && dayNumber <= lastDayOfMonth
      ? isSelected
        ? selectedDayElement(dayNumber, key)
        : normalDayElement(dayNumber, key)
      : emptyDayElement(key);
  };

  const selectedNumberElement = (number, key, x, y) => {
    return (
      <View
        key={key}
        style={[
          styles.numberPoint,
          timeSelectedNumberPointStyle,
          {left: x, top: y},
        ]}>
        <Text
          style={[
            numberPointTextStyle,
            timeSelectedNumberPointTextStyle,
            number > 12 && !minuteHourType && styles.innerNumberPointText,
          ]}>
          {number}
        </Text>
      </View>
    );
  };

  const normalNumberElement = (number, key, x, y) => (
    <TouchableOpacity
      key={key}
      style={[styles.numberPoint, {left: x, top: y}]}
      onPress={() => {
        !minuteHourType &&
          setSelectedTime({
            hour: parseInt(number, 10),
            minute: selectedTime.minute,
          });
        !minuteHourType && setMinuteHourType(true);
        minuteHourType &&
          setSelectedTime({
            hour: selectedTime.hour,
            minute: parseInt(number, 10),
          });
      }}>
      <Text
        style={[
          numberPointTextStyle,
          number > 12 && !minuteHourType && styles.innerNumberPointText,
        ]}>
        {number}
      </Text>
    </TouchableOpacity>
  );

  const numberElement = (isSelected, key, number, x, y) => {
    return isSelected
      ? selectedNumberElement(number, key, x, y)
      : normalNumberElement(number, key, x, y);
  };

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  const backgroundContainerStyle = StyleSheet.flatten([
    styles.backgroundContainer,
    {backgroundColor: dialogBackgroundColor},
  ]);

  const dialogContainerStyle = StyleSheet.flatten([
    styles.dialogContainer,
    {backgroundColor: secondaryThreeFourthColor},
  ]);

  const dateDialogHeaderContainerStyle = StyleSheet.flatten([
    styles.dateDialogHeaderContainer,
    {backgroundColor: primaryColor},
  ]);
  const timeDialogHeaderContainerStyle = StyleSheet.flatten([
    styles.timeDialogHeaderContainer,
    {backgroundColor: primaryColor},
  ]);

  const yearTextStyle = StyleSheet.flatten([
    styles.yearText,
    {color: darkMode ? secondaryNegativeColor : secondaryColor},
  ]);

  const dateTextStyle = StyleSheet.flatten([
    styles.dateText,
    {color: darkMode ? secondaryNegativeColor : secondaryColor},
  ]);

  const dateSelectorContainerStyle = StyleSheet.flatten([
    styles.dateSelectorContainer,
    {backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor},
  ]);

  const dateSelectorHeaderTextStyle = StyleSheet.flatten([
    styles.dateSelectorHeaderText,
    {color: secondaryNegativeColor},
  ]);

  const dateSelectedGridElementStyle = StyleSheet.flatten([
    styles.dateSelectedGridElement,
    {backgroundColor: primaryColor},
  ]);

  const dateGridElementTextStyle = StyleSheet.flatten([
    styles.dateGridElementText,
    {color: secondaryNegativeColor},
  ]);

  const timeTextStyle = StyleSheet.flatten([
    styles.timeText,
    {color: darkMode ? secondaryNegativeColor : secondaryColor},
  ]);

  const activeTimeTextStyle = StyleSheet.flatten([
    {color: darkMode ? secondaryOneFourthColor : secondaryThreeFourthColor},
  ]);

  const timeSelectorContainerStyle = StyleSheet.flatten([
    styles.timeSelectorContainer,
    {backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor},
  ]);

  const timeMainCircleStyle = StyleSheet.flatten([
    styles.timeMainCircle,
    {backgroundColor: darkMode ? secondaryThreeFourthColor : LIGHT_GREY},
  ]);

  const timeSelectedNumberPointStyle = StyleSheet.flatten([
    {backgroundColor: primaryColor},
  ]);

  const timeSelectedNumberPointTextStyle = StyleSheet.flatten([
    {color: darkMode ? secondaryNegativeColor : secondaryColor},
  ]);

  const numberPointTextStyle = StyleSheet.flatten([
    styles.numberPointText,
    {color: secondaryNegativeColor},
  ]);

  const centerPointStyle = StyleSheet.flatten([
    styles.centerPoint,
    {backgroundColor: primaryColor},
  ]);

  const buttonsContainerStyle = StyleSheet.flatten([
    styles.buttonsContainer,
    {backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor},
  ]);

  const confirmButtonTextStyle = StyleSheet.flatten([
    styles.confirmButtonText,
    {color: primaryColor},
  ]);

  const rejectButtonTextStyle = StyleSheet.flatten([
    styles.rejectButtonText,
    {color: primaryColor},
  ]);

  const dateTimeSelectStyle = StyleSheet.flatten([
    styles.dateTimeSelect,
    {
      backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor,
    },
  ]);

  const dateSelectTextStyle = StyleSheet.flatten([
    styles.dateSelectText,
    {
      color: dateTime
        ? darkMode
          ? secondaryNegativeColor
          : primaryColor
        : secondaryNegativeColor,
    },
  ]);

  const timeSelectTextStyle = StyleSheet.flatten([
    styles.timeSelectText,
    {
      color: !dateTime
        ? darkMode
          ? secondaryNegativeColor
          : primaryColor
        : secondaryNegativeColor,
    },
  ]);

  const dateSelectUnderlineStyle = StyleSheet.flatten([
    styles.dateSelectUnderline,
    {
      backgroundColor: dateTime
        ? darkMode
          ? secondaryNegativeColor
          : primaryColor
        : darkMode
        ? secondaryThreeFourthColor
        : secondaryColor,
    },
  ]);

  const timeSelectUnderlineStyle = StyleSheet.flatten([
    styles.timeSelectUnderline,
    {
      backgroundColor: !dateTime
        ? darkMode
          ? secondaryNegativeColor
          : primaryColor
        : darkMode
        ? secondaryThreeFourthColor
        : secondaryColor,
    },
  ]);

  return (
    <Modal
      visible={props.visible}
      transparent={true}
      onRequestClose={OnPressBack}
      animationType="slide">
      <TouchableOpacity
        style={backgroundContainerStyle}
        onPress={() => OnPressBack()}>
        <TouchableWithoutFeedback>
          <View style={dialogContainerStyle}>
            <View>
              <View style={dateTimeSelectStyle}>
                <TouchableOpacity
                  style={styles.dateSelectButton}
                  onPress={() => setDateTime(true)}>
                  <Text style={dateSelectTextStyle}>Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeSelectButton}
                  onPress={() => setDateTime(false)}>
                  <Text style={timeSelectTextStyle}>Czas</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateTimeSelectUnderlineContainer}>
                <View style={dateSelectUnderlineStyle} />
                <View style={timeSelectUnderlineStyle} />
              </View>
            </View>
            {dateTime ? (
              <>
                <View style={dateDialogHeaderContainerStyle}>
                  <Text style={yearTextStyle}>
                    {selectedDate.getFullYear()}
                  </Text>
                  <Text style={dateTextStyle}>
                    {LocalizationHelperFunctions.dateShortPL(selectedDate)}
                  </Text>
                </View>
                <View style={dateSelectorContainerStyle}>
                  <View style={styles.dateSelectorHeaderContainer}>
                    <TouchableOpacity
                      style={styles.dateSelectorHeaderButton}
                      onPress={DecrementVisibleDateByMonth}>
                      <Icon
                        name="chevron-back-sharp"
                        color={secondaryNegativeColor}
                        size={24}
                      />
                    </TouchableOpacity>
                    <Text style={dateSelectorHeaderTextStyle}>
                      {LocalizationHelperFunctions.yearMonthPL(visibleDate)}
                    </Text>
                    <TouchableOpacity
                      style={styles.dateSelectorHeaderButton}
                      onPress={IncrementVisibleDateByMonth}>
                      <Icon
                        name="chevron-forward-sharp"
                        color={secondaryNegativeColor}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateSelectorGrid}>
                    <View style={styles.dateGridHeader}>
                      {LocalizationHelperFunctions.daysOfWeekFirstLetterPL.map(
                        (day, index) => (
                          <View style={styles.dateGridElement} key={index}>
                            <Text style={styles.dateGridHeaderElementText}>
                              {day}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                    <View style={styles.dateGridContainer}>
                      {[...Array(7).keys()]
                        .map((i1) => i1 + 1)
                        .map((item1, index1) => (
                          <View style={styles.dateGridRow} key={item1 - 31}>
                            {[...Array(6).keys()]
                              .map((i2) => item1 + i2 * 7)
                              .map((item2, index2) => {
                                const day = new Date(
                                  visibleDate.getFullYear(),
                                  visibleDate.getMonth(),
                                  1,
                                );
                                const dayNumber =
                                  day.getDay() > 0
                                    ? item2 + 1 - day.getDay()
                                    : item2 - 6;
                                const isSelected =
                                  selectedDate.getDate() === dayNumber &&
                                  visibleDate.getMonth() ===
                                    selectedDate.getMonth() &&
                                  visibleDate.getFullYear() ===
                                    selectedDate.getFullYear();
                                return dayElement(
                                  isSelected,
                                  item1 * item2,
                                  dayNumber,
                                );
                              })}
                          </View>
                        ))}
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={timeDialogHeaderContainerStyle}>
                  <View style={styles.time}>
                    <TouchableOpacity onPress={() => setMinuteHourType(false)}>
                      <Text
                        style={[
                          timeTextStyle,
                          minuteHourType && activeTimeTextStyle,
                        ]}>
                        {selectedTime.hour > 9
                          ? selectedTime.hour
                          : '0' + selectedTime.hour}
                      </Text>
                    </TouchableOpacity>
                    <Text style={timeTextStyle}>:</Text>
                    <TouchableOpacity onPress={() => setMinuteHourType(true)}>
                      <Text
                        style={[
                          timeTextStyle,
                          !minuteHourType && activeTimeTextStyle,
                        ]}>
                        {selectedTime.minute > 9
                          ? selectedTime.minute
                          : '0' + selectedTime.minute}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={timeSelectorContainerStyle}>
                  <View style={timeMainCircleStyle}>
                    <Svg
                      style={{
                        transform: [
                          {
                            rotate: `${
                              minuteHourType
                                ? selectedTime.minute * 6
                                : selectedTime.hour * 30
                            }deg`,
                          },
                        ],
                      }}
                      height={circleSize}
                      width={circleSize}>
                      <Line
                        x1={circleSize / 2}
                        y1={circleSize / 2}
                        x2={circleSize / 2}
                        y2={
                          minuteHourType
                            ? circleSize / 20
                            : selectedTime.hour > 12 ||
                              selectedTime.hour == '00'
                            ? circleSize / 4
                            : circleSize / 10
                        }
                        stroke={primaryColor}
                        strokeWidth="4"
                      />
                    </Svg>
                    {[...Array(12).keys()]
                      .map((i) => i + 1)
                      .map((item, index) => {
                        const degree = item * (360 / 12) - 90;
                        const x =
                          (circleSize / 2 - symbolCircleSize / 2) *
                            Math.cos(degToRad(degree)) +
                          circleSize / 2 -
                          symbolCircleSize / 2;
                        const y =
                          (circleSize / 2 - symbolCircleSize / 2) *
                            Math.sin(degToRad(degree)) +
                          circleSize / 2 -
                          symbolCircleSize / 2;
                        return numberElement(
                          minuteHourType
                            ? selectedTime.minute ===
                                (item * 5 === 60 ? 0 : item * 5)
                            : selectedTime.hour === item,
                          index,
                          minuteHourType
                            ? item * 5 === 60
                              ? '00'
                              : item * 5
                            : item,
                          x,
                          y,
                        );
                      })}
                    {!minuteHourType &&
                      [...Array(12).keys()]
                        .map((i) => i + 1)
                        .map((item, index) => {
                          const degree = item * (360 / 12) - 90;
                          const x =
                            (circleSize / 2 - symbolCircleSize * 1.5) *
                              Math.cos(degToRad(degree)) +
                            circleSize / 2 -
                            symbolCircleSize / 2;
                          const y =
                            (circleSize / 2 - symbolCircleSize * 1.5) *
                              Math.sin(degToRad(degree)) +
                            circleSize / 2 -
                            symbolCircleSize / 2;
                          return numberElement(
                            selectedTime.hour ==
                              (item + 12 === 24 ? '00' : item + 12),
                            index,
                            item + 12 === 24 ? '00' : item + 12,
                            x,
                            y,
                          );
                        })}
                    <View style={centerPointStyle} />
                  </View>
                </View>
              </>
            )}
            <View style={buttonsContainerStyle}>
              <TouchableOpacity
                onPress={() =>
                  props.OnPressConfirm(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      selectedTime.hour,
                      selectedTime.minute,
                      0,
                    ),
                  )
                }
                style={styles.confirmButton}>
                <Text style={confirmButtonTextStyle}>
                  {props.confirmText || 'Potwierdź'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.OnPressCancel()}
                style={styles.rejectButton}>
                <Text style={rejectButtonTextStyle}>
                  {props.rejectText || 'Anuluj'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  dialogContainer: {
    flexDirection: 'column',
    flex: 0.65,
    marginHorizontal: 50,
  },
  dateTimeSelect: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateSelectButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 12,
  },
  dateSelectText: {fontSize: 18},
  timeSelectButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 12,
  },
  dateTimeSelectUnderlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateSelectUnderline: {
    flex: 0.5,
    padding: 2,
  },
  timeSelectUnderline: {
    flex: 0.5,
    padding: 2,
  },
  dateDialogHeaderContainer: {
    alignSelf: 'center',
    flex: 0.15,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 6,
  },
  yearText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 35,
    fontWeight: '900',
  },
  dateSelectorContainer: {
    flex: 0.73,
    paddingHorizontal: 30,
  },
  dateSelectorHeaderContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSelectorHeaderText: {
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '900',
  },
  dateSelectorHeaderButton: {
    padding: 5,
  },
  dateSelectorGrid: {
    justifyContent: 'space-between',
  },
  dateGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateGridHeaderElementText: {
    color: SECONDARY_HALF_COLOR,
    fontSize: 17,
  },
  dateGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateGridRow: {},
  dateGridElement: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  dateSelectedGridElement: {
    borderRadius: 100,
  },
  dateGridElementText: {
    fontSize: 16,
  },

  timeDialogHeaderContainer: {
    alignSelf: 'center',
    flex: 0.15,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 55,
    fontWeight: '900',
  },
  timeSelectorContainer: {
    flex: 0.73,
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  timeMainCircle: {
    alignSelf: 'center',
    width: circleSize,
    height: circleSize,
    borderRadius: 10000,
  },
  numberPoint: {
    width: symbolCircleSize,
    height: symbolCircleSize,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 8,
    borderRadius: 100,
  },
  numberPointText: {
    fontSize: 20,
  },
  innerNumberPointText: {
    fontSize: 17,
  },
  centerPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    left: circleSize / 2 - 5,
    top: circleSize / 2 - 5,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 30,
    flex: 0.12,
  },
  confirmButton: {
    paddingLeft: 15,
    marginVertical: 10,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '900',
  },
  rejectButton: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  rejectButtonText: {
    fontSize: 17,
    fontWeight: '900',
  },
});

export default DateTimePickerDialog;
