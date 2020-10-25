import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SetNoteRoot, UpdateStatusBarColor} from '../NavigationHelperFunctions';
import {
  darkMode,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_HALF_COLOR,
  SECONDARY_NEGATIVE_COLOR,
} from '../AppConfig';

const mainOptions = [
  {
    text: 'Notatki',
    iconName: 'create-sharp',
    stack: OpenNoteMainScreen,
  },
];
const options = [
];

const OpenNoteMainScreen = () => {
  SetNoteRoot;
};

const LeftSideMenu = () => {
  const [textSize, setTextSize] = useState(15);
  const [iconSize, setIconSize] = useState(29);
  const [iconColor, setIconColor] = useState(
    darkMode ? SECONDARY_NEGATIVE_COLOR : PRIMARY_COLOR,
  );
  const [textColor, setTextColor] = useState(
    darkMode ? SECONDARY_NEGATIVE_COLOR : SECONDARY_HALF_COLOR,
  );

  useEffect(() => {
    UpdateStatusBarColor('LeftSideMenu', SECONDARY_COLOR);
  });

  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: SECONDARY_COLOR,
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
