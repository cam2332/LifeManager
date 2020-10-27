import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  BLACK,
  WHITE,
  darkMode,
  SetDarkMode,
  Colors,
  UpdateColors,
  PRIMARY_COLOR,
  SetPrimaryColor,
  PRIMARY_DARK_COLOR,
  SetPrimaryDarkColor,
  SECONDARY_COLOR,
  SECONDARY_HALF_COLOR,
  SECONDARY_THREE_FOURTH_COLOR,
  SECONDARY_NEGATIVE_COLOR,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';

const SettingsScreen = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [primaryColor, setPrimaryColor] = useState({
    Normal: PRIMARY_COLOR,
    Dark: PRIMARY_DARK_COLOR,
  });
  const [isDarkMode, setDarkMode] = useState(darkMode);
  const [offlineMode, setOfflineMode] = useState(false);
  const [automaticSync, setAutomaticSync] = useState(true);

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      SECONDARY_COLOR,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  const optionTextStyle = StyleSheet.flatten([
    styles.optionText,
    {color: SECONDARY_NEGATIVE_COLOR},
  ]);

  const subOptionTextStyle = StyleSheet.flatten([
    styles.optionSubText,
    {color: SECONDARY_NEGATIVE_COLOR},
  ]);

  const sectionTitleStyle = StyleSheet.flatten([
    styles.sectionTitle,
    {color: PRIMARY_COLOR},
  ]);
  const spacerLineStyle = StyleSheet.flatten([
    styles.spacerLine,
    {backgroundColor: SECONDARY_THREE_FOURTH_COLOR},
  ]);

  const logoutButtonStyle = StyleSheet.flatten([
    styles.logoutButton,
    {backgroundColor: PRIMARY_COLOR},
  ]);

  const mainContainerStyle = StyleSheet.flatten([
    styles.mainContainer,
    {backgroundColor: SECONDARY_COLOR},
  ]);

  return (
    <View style={mainContainerStyle}>
      <ScreenHeader
        title="Ustawienia"
        textColor={darkMode ? SECONDARY_NEGATIVE_COLOR : PRIMARY_COLOR}
        iconsColor={darkMode ? SECONDARY_NEGATIVE_COLOR : PRIMARY_COLOR}
        backgroundColor={
          darkMode ? SECONDARY_THREE_FOURTH_COLOR : SECONDARY_COLOR
        }
        borderColor={darkMode ? SECONDARY_THREE_FOURTH_COLOR : PRIMARY_COLOR}
        sideMenuButtonVisible={true}
      />
      <ScrollView style={styles.settingsContainer}>
        <View style={spacerLineStyle} />
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Konto</Text>
          {isLoggedIn && (
            <>
              <View>
                <View style={styles.accountInfoRow}>
                  <Text style={optionTextStyle}>Login</Text>
                  <Text style={optionTextStyle}>Login</Text>
                </View>
                <View style={styles.accountInfoRow}>
                  <Text style={optionTextStyle}>Email</Text>
                  <Text style={optionTextStyle}>Email</Text>
                </View>
              </View>
              <TouchableOpacity
                style={logoutButtonStyle}
                onPress={() => {
                  setIsLoggedIn(false);
                }}>
                <Text style={styles.logoutButtonText}>Wyloguj</Text>
              </TouchableOpacity>
            </>
          )}
          {!isLoggedIn && (
            <TouchableOpacity
              style={logoutButtonStyle}
              onPress={() => {
                setIsLoggedIn(true);
              }}>
              <Text style={styles.logoutButtonText}>Zaloguj</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={spacerLineStyle} />
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Wygląd</Text>
          <Text style={optionTextStyle}>Kolor przewodni</Text>
          <ScrollView contentContainerStyle={styles.primaryColorSelector}>
            {Object.entries(Colors).map(([name, color]) => (
              <TouchableOpacity
                key={name}
                activeOpacity={0.9}
                onPress={() => {
                  SetPrimaryColor(color.Normal);
                  console.log(PRIMARY_COLOR);
                  SetPrimaryDarkColor(color.Dark);
                  setPrimaryColor({
                    Normal: color.Normal,
                    Dark: color.Dark,
                  });
                }}
                style={[
                  styles.colorButtonBox,
                  styles.flexDirectionRow,
                  {
                    borderColor:
                      primaryColor.Normal === color.Normal
                        ? SECONDARY_NEGATIVE_COLOR
                        : SECONDARY_COLOR,
                  },
                ]}>
                <View
                  style={[
                    styles.halfWidthColorBox,
                    {backgroundColor: color.Normal},
                  ]}
                />
                <View
                  style={[
                    styles.halfWidthColorBox,
                    {backgroundColor: color.Dark},
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={optionTextStyle}>Kolor tła</Text>
          <View style={styles.secondaryColorSelector}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                SetDarkMode(false);
                setDarkMode(false);
                UpdateColors();
              }}
              style={[
                styles.colorButtonBox,
                styles.colorBox,
                {
                  borderColor:
                    isDarkMode === false
                      ? SECONDARY_NEGATIVE_COLOR
                      : SECONDARY_COLOR,
                },
                {backgroundColor: WHITE},
              ]}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                SetDarkMode(true);
                setDarkMode(true);
                UpdateColors();
              }}
              style={[
                styles.colorButtonBox,
                styles.colorBox,
                {
                  borderColor:
                    isDarkMode === true
                      ? SECONDARY_NEGATIVE_COLOR
                      : SECONDARY_COLOR,
                },
                {backgroundColor: BLACK},
              ]}
            />
          </View>
        </View>
        <View style={spacerLineStyle} />
        {isLoggedIn && (
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>Synchronizacja</Text>
            <TouchableOpacity style={styles.paddingVertical10}>
              <Text style={optionTextStyle}>Synchronizuj</Text>
              <Text style={subOptionTextStyle}>
                Ostatnia synchronizacja: {new Date().toLocaleString()}
              </Text>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
              <Text style={optionTextStyle}>Tryb offline</Text>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{
                  true: PRIMARY_COLOR,
                  false: SECONDARY_THREE_FOURTH_COLOR,
                }}
                thumbColor={darkMode ? SECONDARY_HALF_COLOR : SECONDARY_COLOR}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={optionTextStyle}>Automatyczna synchronizacja</Text>
              <Switch
                value={automaticSync}
                onValueChange={setAutomaticSync}
                trackColor={{
                  true: PRIMARY_COLOR,
                  false: SECONDARY_THREE_FOURTH_COLOR,
                }}
                thumbColor={darkMode ? SECONDARY_HALF_COLOR : SECONDARY_COLOR}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  settingsContainer: {
    marginTop: 25,
    marginHorizontal: 17,
  },
  section: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flex: 1,
  },
  spacerLine: {
    height: 1,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryColorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  secondaryColorSelector: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 10,
  },
  optionSubText: {
    fontSize: 13,
    marginTop: -10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: PRIMARY_COLOR,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: darkMode ? SECONDARY_NEGATIVE_COLOR : SECONDARY_COLOR,
    fontSize: 19,
  },
  halfWidthColorBox: {
    height: 30,
    width: 34,
  },
  colorBox: {
    height: 30,
    width: 68,
  },
  colorButtonBox: {
    marginVertical: 10,
    marginHorizontal: 6,
    alignSelf: 'center',
    borderWidth: 2,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
});

export default SettingsScreen;
