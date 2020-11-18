import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {
  darkMode,
  primaryColor,
  secondaryColor,
  secondaryNegativeColor,
  SECONDARY_HALF_COLOR,
  secondaryThreeFourthColor,
} from '../AppConfig';
import LogoIcon from '../../resources/LogoIcon.png';
import * as UserApi from '../services/UserApi';
import SnackBar from '../components/SnackBar';
import CustomTextInput from '../components/CustomTextInput';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import ScreenHeader from '../components/ScreenHeader';
import * as SettingsApi from '../services/SettingsApi';

const onPressGoToRegisterScreen = () => {
  NavigationHelperFunctions.SetRegisterRoot();
};

const LoginScreen = (props) => {
  const [loginText, setLoginText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const loginInputRef = useRef();
  const passwordInputRef = useRef();
  const snackBarRef = useRef();

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      props.componentId,
      secondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  useEffect(() => {
    setIsFormValid(
      loginText !== '' &&
        passwordText !== '' &&
        !loginInputRef.current.hasError() &&
        !passwordInputRef.current.hasError(),
    );
  }, [loginText, passwordText]);

  const OnPressLogin = () => {
    UserApi.LoginUser(loginText, passwordText)
      .then(() => {
        NavigationHelperFunctions.SetNoteRoot();
      })
      .catch((error) => {
        if (error) {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
          if (error.additionalInfo === 'password') {
            passwordInputRef.current.setErrorValue(true, 'Nieprawidłowe hasło');
          } else if (error.additionalInfo === '') {
            loginInputRef.current.setErrorValue(
              true,
              'Nazwa użytkownika lub email w użyciu',
            );
          }
        }
      });
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        backgroundColor={secondaryColor}
        title={'Pomiń'}
        titleAlignment={'flex-end'}
        titleFontSize={20}
        textColor={darkMode ? secondaryNegativeColor : primaryColor}
        rightCustomButtonVisible={true}
        rightCustomButton={{
          iconName: 'arrow-forward-sharp',
          onPress: () => {
            SettingsApi.SetIsOfflineMode(true);
            NavigationHelperFunctions.SetNoteRoot();
          },
        }}
        iconsColor={darkMode ? secondaryNegativeColor : primaryColor}
      />
      <View style={styles.sectionLogo}>
        <Image style={styles.image} source={LogoIcon} />
      </View>
      <View style={styles.sectionTitle}>
        <Text style={styles.loginText}>Logowanie</Text>
      </View>
      <View style={{flex: 0.25}} />
      <View style={styles.sectionBody}>
        <CustomTextInput
          ref={loginInputRef}
          viewStyle={styles.textInput}
          color={secondaryNegativeColor}
          underlineColorAndroid={secondaryThreeFourthColor}
          placeholder={'Nazwa użytkownika / Email'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          inputText={loginText}
          onChangeText={(text) => setLoginText(text)}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              loginText.length === 0
                ? loginInputRef.current.setErrorValue(true, 'Wprowadź nazwę')
                : loginInputRef.current.setErrorValue(false, '');
            }
          }}
        />
        <CustomTextInput
          ref={passwordInputRef}
          viewStyle={styles.textInput}
          color={secondaryNegativeColor}
          underlineColorAndroid={secondaryThreeFourthColor}
          placeholder={'Hasło'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          inputText={passwordText}
          onChangeText={(text) => {
            setPasswordText(text);
            text.length < 6
              ? passwordInputRef.current.setErrorValue(
                  true,
                  'Długość hasła powinna wynosić minimum 6 znaków',
                )
              : passwordInputRef.current.setErrorValue(false, '');
          }}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              passwordText.length === 0
                ? passwordInputRef.current.setErrorValue(true, 'Wprowadź hasło')
                : passwordInputRef.current.setErrorValue(false, '');
              passwordText.length < 6
                ? passwordInputRef.current.setErrorValue(
                    true,
                    'Długość hasła powinna wynosić minimum 6 znaków',
                  )
                : passwordInputRef.current.setErrorValue(false, '');
            }
          }}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              backgroundColor: isFormValid
                ? primaryColor
                : darkMode
                ? secondaryThreeFourthColor
                : SECONDARY_HALF_COLOR,
            },
          ]}
          disabled={!isFormValid}
          onPress={() => OnPressLogin()}>
          <Text
            style={[
              styles.loginButtonText,
              {
                color: isFormValid
                  ? darkMode
                    ? secondaryNegativeColor
                    : secondaryColor
                  : darkMode
                  ? SECONDARY_HALF_COLOR
                  : secondaryThreeFourthColor,
              },
            ]}>
            Zaloguj się
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionRegisterHint}
          onPress={onPressGoToRegisterScreen}>
          <View style={styles.registerHintView}>
            <Text style={styles.registerHintText}>{'Nie masz konta?   '}</Text>
            <Text style={styles.registerHintBoldText}>Zarejestruj się</Text>
          </View>
        </TouchableOpacity>
      </View>
      <SnackBar ref={snackBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
  sectionLogo: {
    alignItems: 'center',
    flex: 0.4,
    backgroundColor: secondaryColor,
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 0.15,
    backgroundColor: secondaryColor,
  },
  image: {
    resizeMode: 'contain',
    flex: 0.6,
  },
  loginText: {
    color: primaryColor,
    fontSize: 44,
    alignSelf: 'center',
    marginVertical: 2,
  },
  loginButton: {
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 3,
    width: '65%',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  loginButtonText: {
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 6,
  },
  textInput: {
    alignSelf: 'center',
    width: '65%',
  },
  sectionBody: {
    flex: 0.45,
    justifyContent: 'space-around',
    backgroundColor: secondaryColor,
    paddingBottom: 40,
  },
  sectionRegisterHint: {
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 3,
    width: '65%',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  registerHintView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  registerHintText: {
    color: primaryColor,
    fontSize: 18,
    alignSelf: 'center',
  },
  registerHintBoldText: {
    color: primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
