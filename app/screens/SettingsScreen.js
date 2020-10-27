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
  primaryColor,
  SetPrimaryColor,
  primaryDarkColor,
  SetPrimaryDarkColor,
  secondaryColor,
  SECONDARY_HALF_COLOR,
  secondaryThreeFourthColor,
  secondaryNegativeColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';

const SettingsScreen = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [localPrimaryColor, setPrimaryColor] = useState({
    Normal: primaryColor,
    Dark: primaryDarkColor,
  });
  const [isDarkMode, setDarkMode] = useState(darkMode);
  const [offlineMode, setOfflineMode] = useState(false);
  const [automaticSync, setAutomaticSync] = useState(true);

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      secondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  const optionTextStyle = StyleSheet.flatten([
    styles.optionText,
    {color: secondaryNegativeColor},
  ]);

  const subOptionTextStyle = StyleSheet.flatten([
    styles.optionSubText,
    {color: secondaryNegativeColor},
  ]);

  const sectionTitleStyle = StyleSheet.flatten([
    styles.sectionTitle,
    {color: primaryColor},
  ]);
  const spacerLineStyle = StyleSheet.flatten([
    styles.spacerLine,
    {backgroundColor: secondaryThreeFourthColor},
  ]);

  const logoutButtonStyle = StyleSheet.flatten([
    styles.logoutButton,
    {backgroundColor: primaryColor},
  ]);

  const mainContainerStyle = StyleSheet.flatten([
    styles.mainContainer,
    {backgroundColor: secondaryColor},
  ]);

  return (
    <View style={mainContainerStyle}>
      <ScreenHeader
        title="Ustawienia"
        textColor={darkMode ? secondaryNegativeColor : primaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : primaryColor}
        backgroundColor={darkMode ? secondaryThreeFourthColor : secondaryColor}
        borderColor={darkMode ? secondaryThreeFourthColor : primaryColor}
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
                      localPrimaryColor.Normal === color.Normal
                        ? secondaryNegativeColor
                        : secondaryColor,
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
                      ? secondaryNegativeColor
                      : secondaryColor,
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
                      ? secondaryNegativeColor
                      : secondaryColor,
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
                  true: primaryColor,
                  false: secondaryThreeFourthColor,
                }}
                thumbColor={darkMode ? SECONDARY_HALF_COLOR : secondaryColor}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={optionTextStyle}>Automatyczna synchronizacja</Text>
              <Switch
                value={automaticSync}
                onValueChange={setAutomaticSync}
                trackColor={{
                  true: primaryColor,
                  false: secondaryThreeFourthColor,
                }}
                thumbColor={darkMode ? SECONDARY_HALF_COLOR : secondaryColor}
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
    backgroundColor: primaryColor,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: darkMode ? secondaryNegativeColor : secondaryColor,
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
