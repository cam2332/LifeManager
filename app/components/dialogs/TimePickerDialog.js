import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DarkMode,
  SecondaryNegativeColor,
  PrimaryColor,
  SecondaryColor,
  SecondaryThreeFourthColor,
  DialogBackgroundColor,
} from '../../AppConfig';
import Svg, {Line} from 'react-native-svg';

const circleSize = 280;
const symbolCircleSize = 40;
const circleBackgroundColorLight = '#efefef';

const TimePickerDialog = (props) => {
  const [selectedTime, setSelectedTime] = useState({
    hour: new Date().getHours(),
    minute: Math.round(new Date().getMinutes() / 5) * 5,
  });
  const [minuteHourType, setMinuteHourType] = useState(false);

  const selectedNumberElement = (number, key, x, y) => {
    return (
      <View
        key={key}
        style={[
          styles.numberPoint,
          styles.selectedNumberPoint,
          {left: x, top: y},
        ]}>
        <Text style={[styles.numberPointText, styles.selectedNumberPointText]}>
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
          styles.numberPointText,
          number > 12 && styles.innerNumberPointText,
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

  return props.visible ? (
    <View style={styles.backgroundContainer}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogHeaderContainer}>
          <View style={styles.time}>
            <TouchableOpacity onPress={() => setMinuteHourType(false)}>
              <Text
                style={[
                  styles.timeText,
                  minuteHourType && styles.activeTimeText,
                ]}>
                {selectedTime.hour > 9
                  ? selectedTime.hour
                  : '0' + selectedTime.hour}
              </Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>:</Text>
            <TouchableOpacity onPress={() => setMinuteHourType(true)}>
              <Text
                style={[
                  styles.timeText,
                  !minuteHourType && styles.activeTimeText,
                ]}>
                {selectedTime.minute > 9
                  ? selectedTime.minute
                  : '0' + selectedTime.minute}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.selectorContainer}>
          <View style={styles.mainCircle}>
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
                    : selectedTime.hour > 12
                    ? circleSize / 4
                    : circleSize / 10
                }
                stroke={PrimaryColor}
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
                    ? selectedTime.minute === (item * 5 === 60 ? 0 : item * 5)
                    : selectedTime.hour === item,
                  index,
                  minuteHourType ? (item * 5 === 60 ? '00' : item * 5) : item,
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
                    selectedTime.hour === item + 12,
                    index,
                    item + 12,
                    x,
                    y,
                  );
                })}
            <View style={styles.centerPoint} />
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => props.OnPressConfirm(selectedTime)}
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
    backgroundColor: DialogBackgroundColor,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  dialogContainer: {
    flexDirection: 'column',
    flex: 0.5,
    marginHorizontal: 70,
    backgroundColor: SecondaryThreeFourthColor,
  },
  dialogHeaderContainer: {
    backgroundColor: PrimaryColor,
    alignSelf: 'center',
    flex: 0.15,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timeText: {
    color: SecondaryColor,
    fontSize: 50,
    fontWeight: '900',
  },
  activeTimeText: {
    color: SecondaryThreeFourthColor,
  },
  selectorContainer: {
    backgroundColor: DarkMode ? SecondaryThreeFourthColor : SecondaryColor,
    flex: 0.73,
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  mainCircle: {
    alignSelf: 'center',
    width: circleSize,
    height: circleSize,
    borderRadius: 10000,
    backgroundColor: circleBackgroundColorLight,
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
  selectedNumberPoint: {
    backgroundColor: PrimaryColor,
  },
  numberPointText: {
    fontSize: 20,
    color: SecondaryNegativeColor,
  },
  innerNumberPointText: {
    fontSize: 17,
  },
  selectedNumberPointText: {
    color: SecondaryColor,
  },
  centerPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    left: circleSize / 2 - 5,
    top: circleSize / 2 - 5,
    borderRadius: 10,
    backgroundColor: PrimaryColor,
  },
  buttonsContainer: {
    backgroundColor: DarkMode ? SecondaryThreeFourthColor : SecondaryColor,
    flexDirection: 'row-reverse',
    paddingHorizontal: 30,
    paddingVertical: 10,
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
    color: DarkMode ? PrimaryColor : PrimaryColor,
  },
  rejectButton: {
    paddingTop: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  rejectButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: DarkMode ? PrimaryColor : PrimaryColor,
  },
});

export default TimePickerDialog;
