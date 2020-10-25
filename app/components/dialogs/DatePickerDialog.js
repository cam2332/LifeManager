import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  darkMode,
  SECONDARY_NEGATIVE_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_HALF_COLOR,
  SECONDARY_THREE_FOURTH_COLOR,
  DIALOG_BACKGROUND_COLOR,
} from '../../AppConfig';
import * as LocalizationHelperFunctions from '../../LocalizationHelperFunctions';
import Icon from 'react-native-vector-icons/Ionicons';

const DatePickerDialog = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDate, setVisibleDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
    ),
  );

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
    <View style={[styles.gridElement, styles.selectedGridElement]} key={key}>
      <Text style={[styles.gridElementText, styles.selectedGridElementText]}>
        {dayNumber}
      </Text>
    </View>
  );

  const normalDayElement = (dayNumber, key) => (
    <TouchableOpacity
      style={styles.gridElement}
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
      <Text style={styles.gridElementText}>{dayNumber}</Text>
    </TouchableOpacity>
  );

  const emptyDayElement = (key) => (
    <View style={styles.gridElement} key={key}>
      <Text style={styles.gridElementText} />
    </View>
  );

  const dayElement = (isSelected, key, dayNumber) => {
    return dayNumber > 0 && dayNumber <= lastDayOfMonth
      ? isSelected
        ? selectedDayElement(dayNumber, key)
        : normalDayElement(dayNumber, key)
      : emptyDayElement(key);
  };

  return props.visible ? (
    <View style={styles.backgroundContainer}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogHeaderContainer}>
          <Text style={styles.yearText}>{selectedDate.getFullYear()}</Text>
          <Text style={styles.dateText}>
            {LocalizationHelperFunctions.dateShortPL(selectedDate)}
          </Text>
        </View>
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeaderContainer}>
            <TouchableOpacity
              style={styles.selectorHeaderButton}
              onPress={DecrementVisibleDateByMonth}>
              <Icon
                name="chevron-back-sharp"
                color={SECONDARY_NEGATIVE_COLOR}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.selectorHeaderText}>
              {LocalizationHelperFunctions.yearMonthPL(visibleDate)}
            </Text>
            <TouchableOpacity
              style={styles.selectorHeaderButton}
              onPress={IncrementVisibleDateByMonth}>
              <Icon
                name="chevron-forward-sharp"
                color={SECONDARY_NEGATIVE_COLOR}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.selectorGrid}>
            <View style={styles.gridHeader}>
              {LocalizationHelperFunctions.daysOfWeekFirstLetterPL.map(
                (day, index) => (
                  <View style={styles.gridElement} key={index}>
                    <Text style={styles.gridHeaderElementText}>{day}</Text>
                  </View>
                ),
              )}
            </View>
            <View style={styles.gridContainer}>
              {[...Array(7).keys()]
                .map((i1) => i1 + 1)
                .map((item1, index1) => (
                  <View style={styles.gridRow} key={item1 - 31}>
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
                          visibleDate.getMonth() === selectedDate.getMonth() &&
                          visibleDate.getFullYear() ===
                            selectedDate.getFullYear();
                        return dayElement(isSelected, item1 * item2, dayNumber);
                      })}
                  </View>
                ))}
            </View>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => props.OnPressConfirm(selectedDate)}
            style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>
              {props.confirmText || 'Potwierdź'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.OnPressCancel()}
            style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>
              {props.rejectText || 'Anuluj'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: DIALOG_BACKGROUND_COLOR,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  dialogContainer: {
    flexDirection: 'column',
    flex: 0.6,
    marginHorizontal: 50,
    backgroundColor: SECONDARY_THREE_FOURTH_COLOR,
  },
  dialogHeaderContainer: {
    backgroundColor: PRIMARY_COLOR,
    alignSelf: 'center',
    flex: 0.15,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 6,
  },
  yearText: {
    color: darkMode ? SECONDARY_NEGATIVE_COLOR : SECONDARY_COLOR,
    fontSize: 20,
  },
  dateText: {
    color: darkMode ? SECONDARY_NEGATIVE_COLOR : SECONDARY_COLOR,
    fontSize: 35,
    fontWeight: '900',
  },
  selectorContainer: {
    backgroundColor: darkMode ? SECONDARY_THREE_FOURTH_COLOR : SECONDARY_COLOR,
    flex: 0.73,
    paddingHorizontal: 30,
  },
  selectorHeaderContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorHeaderText: {
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '900',
    color: SECONDARY_NEGATIVE_COLOR,
  },
  selectorHeaderButton: {
    padding: 5,
  },
  selectorGrid: {
    justifyContent: 'space-between',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridHeaderElementText: {
    color: SECONDARY_HALF_COLOR,
    fontSize: 17,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridRow: {},
  gridElement: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  selectedGridElement: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 100,
  },
  gridElementText: {
    fontSize: 16,
    color: SECONDARY_NEGATIVE_COLOR,
  },
  selectedGridElementText: {
    color: SECONDARY_COLOR,
  },
  buttonsContainer: {
    backgroundColor: darkMode ? SECONDARY_THREE_FOURTH_COLOR : SECONDARY_COLOR,
    flexDirection: 'row-reverse',
    paddingHorizontal: 30,
    flex: 0.12,
  },
  confirmButton: {
    paddingTop: 10,
    paddingLeft: 15,
    marginVertical: 10,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: darkMode ? PRIMARY_COLOR : PRIMARY_COLOR,
  },
  rejectButton: {
    paddingTop: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  rejectButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: darkMode ? PRIMARY_COLOR : PRIMARY_COLOR,
  },
});

export default DatePickerDialog;
