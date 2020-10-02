import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DarkMode,
  SecondaryNegativeColor,
  PrimaryColor,
  SecondaryColor,
  SecondaryThreeFourthColor,
  DialogBackgroundColor,
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
    backgroundColor: DialogBackgroundColor,
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
    backgroundColor: DarkMode ? SecondaryThreeFourthColor : SecondaryColor,
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  title: {
    color: SecondaryNegativeColor,
    fontSize: 19,
    fontWeight: '700',
    marginVertical: 10,
  },
  description: {
    color: SecondaryNegativeColor,
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

export default ConfirmDialog;
