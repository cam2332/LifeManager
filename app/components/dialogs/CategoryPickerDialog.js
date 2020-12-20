import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  darkMode,
  secondaryThreeFourthColor,
  secondaryColor,
  secondaryNegativeColor,
  dialogBackgroundColor,
} from '../../AppConfig';
import CategorySpinner from '../CategorySpinner';

const CategoryPickerDialog = (props) => {
  return props.visible ? (
    <TouchableOpacity
      style={styles.backgroundContainer}
      onPress={props.OnDismiss}>
      <View style={styles.dialogContainer}>
        <View
          style={[
            styles.dialogContent,
            {
              backgroundColor: darkMode
                ? secondaryThreeFourthColor
                : secondaryColor,
            },
          ]}>
          <Text style={[styles.title, {color: secondaryNegativeColor}]}>
            {'Wybierz kategorię'}
          </Text>
          <CategorySpinner
            selectedItem={props.selectedItem}
            OnSelectItem={props.OnSelectItem}
            options={props.options}
          />
        </View>
      </View>
    </TouchableOpacity>
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
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    marginVertical: 10,
  },
});

export default CategoryPickerDialog;
