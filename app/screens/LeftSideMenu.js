import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import {
  darkMode,
  primaryColor,
  secondaryColor,
  SECONDARY_HALF_COLOR,
  secondaryNegativeColor,
} from '../AppConfig';

const mainOptions = [
  {
    text: 'Notatki',
    iconName: 'create-sharp',
    stack: () => OpenNoteMainScreen(),
  },
  {
    text: 'Zadania',
    iconName: 'checkmark-done-sharp',
    stack: () => OpenTaskMainScreen(),
  },
];

const options = [
  {
    text: 'Ustawienia',
    iconName: 'settings-sharp',
    stack: () => OpenSettingsScreen(),
  },
  {
    text: 'Informacje o aplikacji',
    iconName: 'information-circle-sharp',
    stack: () => OpenAppInfoScreen(),
  },
];

const OpenNoteMainScreen = () => {
  NavigationHelperFunctions.SetNoteRoot();
};

const OpenTaskMainScreen = () => {
  NavigationHelperFunctions.SetTaskRoot();
};

const OpenSettingsScreen = () => {
  NavigationHelperFunctions.SetSettingsRoot();
};

const OpenAppInfoScreen = () => {
  NavigationHelperFunctions.SetAppInfoRoot();
};

const LeftSideMenu = () => {
  const [textSize, setTextSize] = useState(15);
  const [iconSize, setIconSize] = useState(29);
  const [iconColor, setIconColor] = useState(
    darkMode ? secondaryNegativeColor : primaryColor,
  );
  const [textColor, setTextColor] = useState(
    darkMode ? secondaryNegativeColor : SECONDARY_HALF_COLOR,
  );

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      NavigationHelperFunctions.LEFT_SIDE_MENU_ID,
      secondaryColor,
    );
  });

  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: secondaryColor,
        },
      ]}>
      <FlatList
        data={mainOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity style={styles.optionElement} onPress={item.stack}>
            <Icon
              style={styles.optionElementIcon}
              name={item.iconName}
              color={iconColor}
              size={iconSize}
            />
            <Text
              style={{
                color: textColor,
                fontSize: textSize,
              }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        style={styles.bottomList}
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity style={styles.optionElement} onPress={item.stack}>
            <Icon
              style={styles.optionElementIcon}
              name={item.iconName}
              color={iconColor}
              size={iconSize}
            />
            <Text
              style={{
                color: textColor,
                fontSize: textSize,
              }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  optionElement: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionElementIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    width: '20%',
  },
  bottomList: {
    flexDirection: 'column-reverse',
  },
});

export default LeftSideMenu;
