import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  darkMode,
  SECONDARY_NEGATIVE_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_THREE_FOURTH_COLOR,
  DIALOG_BACKGROUND_COLOR,
} from '../../AppConfig';

const ConfirmDialog = (props) => {
  return props.visible ? (
    <View style={styles.backgroundContainer}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogContent}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.description}>{props.description}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => props.OnPressConfirm()}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>
                {props.confirmText || 'Potwierdź'}
              </Text>
            </TouchableOpacity>
            {!props.onlyConfirmButtonVisible && (
              <TouchableOpacity
                onPress={() => props.OnPressCancel()}
                style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>
                  {props.rejectText || 'Anuluj'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 40,
  },
  dialogContent: {
    backgroundColor: darkMode ? SECONDARY_THREE_FOURTH_COLOR : SECONDARY_COLOR,
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  title: {
    color: SECONDARY_NEGATIVE_COLOR,
    fontSize: 19,
    fontWeight: '700',
    marginVertical: 10,
  },
  description: {
    color: SECONDARY_NEGATIVE_COLOR,
    fontSize: 15,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
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

export default ConfirmDialog;
