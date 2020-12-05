import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  darkMode,
  secondaryNegativeColor,
  primaryColor,
  secondaryColor,
  secondaryThreeFourthColor,
  dialogBackgroundColor,
} from '../../AppConfig';
import ColorSelector from '../ColorSelector';

const ColorSelectorDialog = (props) => {
  return props.visible ? (
    <View style={styles.backgroundContainer}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogContent}>
          <Text style={styles.title}>{'Wybierz kolor'}</Text>
          <Text style={styles.description}>{props.description}</Text>
          <ColorSelector
            numberOfColumns={7}
            selectedColor={props.selectedColor}
            OnSelectColor={props.OnSelectColor}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => props.OnPressExit()}
              style={styles.exitButton}>
              <Text style={styles.exitButtonText}>{'Zamknij'}</Text>
            </TouchableOpacity>
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
    backgroundColor: dialogBackgroundColor,
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
    backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor,
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  title: {
    color: secondaryNegativeColor,
    fontSize: 19,
    fontWeight: '700',
    marginVertical: 10,
  },
  description: {
    color: secondaryNegativeColor,
    fontSize: 15,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
  },
  exitButton: {
    paddingTop: 10,
    paddingLeft: 15,
    marginVertical: 10,
  },
  exitButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: primaryColor,
  },
});

export default ColorSelectorDialog;
