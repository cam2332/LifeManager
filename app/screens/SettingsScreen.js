import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
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
import * as LocalizationHelperFunctions from '../LocalizationHelperFunctions';
import * as SettingsApi from '../services/SettingsApi';
import * as UserApi from '../services/UserApi';
import * as SyncApi from '../services/SyncApi';

const SettingsScreen = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localPrimaryColor, setPrimaryColor] = useState({
    Normal: primaryColor,
    Dark: primaryDarkColor,
  });
  const [isDarkMode, setDarkMode] = useState(darkMode);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [userData, setUserData] = useState(undefined);
  const [synchronizationDate, setSynchronizationDate] = useState(undefined);

  const UpdateUserStatus = async () => {
    const user = await SettingsApi.GetUserData();
    setUserData(user);
    setIsLoggedIn((await SettingsApi.GetAccessToken()) && user);
  };

  const UpdateOfflineMode = async () => {
    setOfflineMode(await SettingsApi.GetIsOfflineMode());
  };

  const UpdateAutoSync = async () => {
    setAutoSync(await SettingsApi.GetIsAutoSync());
  };

  const UpdateLastSyncDate = async () => {
    const date = await SettingsApi.GetLastSynchronizationDate();
    setSynchronizationDate(new Date(date));
  };

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      secondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);

    UpdateUserStatus();
    UpdateOfflineMode();
    UpdateAutoSync();
    UpdateLastSyncDate();
  }, []);

  const OnPressLogin = () => {
    NavigationHelperFunctions.SetLoginRoot();
  };

  const OnPressLogout = () => {
    UserApi.LogoutUser()
      .then(async () => {
        await UserApi.ClearUserTokenAndGoToLoginScreen();
      })
      .catch(async (error) => {
        await UserApi.ClearUserTokenAndGoToLoginScreen();
      });
  };

  const Synchronize = () => {
    SyncApi.Sync()
      .then(async () => {
        setSynchronizationDate(new Date());
        await SettingsApi.SetLastSynchronizationDate(new Date());
      })
      .catch((error) => {
      });
  };

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
        textColor={darkMode ? secondaryNegativeColor : secondaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : secondaryColor}
        backgroundColor={darkMode ? secondaryThreeFourthColor : primaryColor}
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
                  <Text style={optionTextStyle}>{userData.login}</Text>
                </View>
                <View style={styles.accountInfoRow}>
                  <Text style={optionTextStyle}>Email</Text>
                  <Text style={optionTextStyle}>{userData.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={logoutButtonStyle}
                onPress={() => {
                  OnPressLogout();
                }}>
                <Text style={styles.logoutButtonText}>Wyloguj</Text>
              </TouchableOpacity>
            </>
          )}
          {!isLoggedIn && (
            <TouchableOpacity
              style={logoutButtonStyle}
              onPress={() => {
                OnPressLogin();
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
                onPress={async () => {
                  SetPrimaryColor(color.Normal);
                  SetPrimaryDarkColor(color.Dark);
                  setPrimaryColor({
                    Normal: color.Normal,
                    Dark: color.Dark,
                  });
                  await SettingsApi.SetPrimaryColor(color.Normal);
                  NavigationHelperFunctions.SetSettingsRoot();
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
              onPress={async () => {
                SetDarkMode(false);
                setDarkMode(false);
                UpdateColors();
                await SettingsApi.SetIsDarkMode(false);
                NavigationHelperFunctions.SetSettingsRoot();
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
              onPress={async () => {
                SetDarkMode(true);
                setDarkMode(true);
                UpdateColors();
                await SettingsApi.SetIsDarkMode(true);
                NavigationHelperFunctions.SetSettingsRoot();
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
            <TouchableOpacity
              style={styles.paddingVertical10}
              onPress={() => {
                Synchronize();
              }}>
              <Text style={optionTextStyle}>Synchronizuj</Text>
              {synchronizationDate && (
                <Text style={subOptionTextStyle}>
                  Ostatnia synchronizacja:{' '}
                  {(synchronizationDate &&
                    `${LocalizationHelperFunctions.datePL(
                      synchronizationDate,
                    )} ${LocalizationHelperFunctions.time(
                      synchronizationDate,
                    )}`) ||
                    ''}
                </Text>
              )}
            </TouchableOpacity>
            <View style={styles.switchContainer}>
              <Text style={optionTextStyle}>Tryb offline</Text>
              <Switch
                value={offlineMode}
                onValueChange={async (value) => {
                  await SettingsApi.SetIsOfflineMode(value);
                  setOfflineMode(value);
                }}
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
                value={autoSync}
                onValueChange={async (value) => {
                  SettingsApi.SetIsAutoSync(value);
                  setAutoSync(value);
                }}
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
