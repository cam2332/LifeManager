import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
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

const OnPressGoToLoginScreen = () => {
  NavigationHelperFunctions.SetLoginRoot();
};

const RegisterScreen = (props) => {
  const [loginText, setLoginText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [confirmPasswordText, setConfirmPasswordText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const loginInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
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
        emailText !== '' &&
        passwordText !== '' &&
        confirmPasswordText !== '' &&
        passwordText === confirmPasswordText &&
        !loginInputRef.current.hasError() &&
        !emailInputRef.current.hasError() &&
        !passwordInputRef.current.hasError() &&
        !confirmPasswordInputRef.current.hasError(),
    );
  }, [loginText, emailText, passwordText, confirmPasswordText]);

  const OnPressRegister = () => {
    UserApi.RegisterUser(loginText, emailText, passwordText)
      .then((data) => {
        // Auto login after successful registration
        UserApi.LoginUser(loginText, passwordText)
          .then(() => {
            NavigationHelperFunctions.SetNoteRoot();
          })
          .catch((error) => {
            if (error) {
              snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
            }
          });
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(error.message, 2000, '', false);
        if (error.additionalInfo === 'login') {
          loginInputRef.current.setErrorValue(
            true,
            'Nazwa użytkownika w użyciu',
          );
        } else if (error.additionalInfo === 'email') {
          emailInputRef.current.setErrorValue(true, 'Adres email w użyciu');
        } else if (error.additionalInfo === '') {
          loginInputRef.current.setErrorValue(
            true,
            'Nazwa użytkownika w użyciu',
          );
          emailInputRef.current.setErrorValue(true, 'Adres email w użyciu');
        }
      });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sectionLogo}>
        <Image style={styles.image} source={LogoIcon} />
      </View>
      <View style={styles.sectionTitle}>
        <Text style={styles.registerText}>Rejestracja</Text>
      </View>
      <View style={styles.sectionBody}>
        <CustomTextInput
          ref={loginInputRef}
          viewStyle={styles.textInput}
          color={secondaryNegativeColor}
          underlineColorAndroid={secondaryThreeFourthColor}
          placeholder={'Nazwa użytkownika'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          inputText={loginText}
          onChangeText={(text) => {
            setLoginText(text);
            loginText.length === 0
              ? loginInputRef.current.setErrorValue(true, 'Wprowadź nazwę')
              : loginInputRef.current.setErrorValue(false, '');
          }}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              loginText.length === 0
                ? loginInputRef.current.setErrorValue(true, 'Wprowadź nazwę')
                : loginInputRef.current.setErrorValue(false, '');
            }
          }}
        />
        <CustomTextInput
          ref={emailInputRef}
          viewStyle={styles.textInput}
          color={secondaryNegativeColor}
          underlineColorAndroid={secondaryThreeFourthColor}
          placeholder={'Email'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          inputText={emailText}
          onChangeText={(text) => {
            setEmailText(text);
            const regex = new RegExp(/\S+@\S+\.\S+/);
            text.length === 0
              ? emailInputRef.current.setErrorValue(
                  true,
                  'Wprowadź prawidłowy email',
                )
              : emailInputRef.current.setErrorValue(false, '');
            !regex.test(text)
              ? emailInputRef.current.setErrorValue(
                  true,
                  'Wprowadź prawidłowy email',
                )
              : emailInputRef.current.setErrorValue(false, '');
          }}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              const regex = new RegExp(/\S+@\S+\.\S+/);
              emailText.length === 0
                ? emailInputRef.current.setErrorValue(
                    true,
                    'Wprowadź prawidłowy email',
                  )
                : emailInputRef.current.setErrorValue(false, '');
              !regex.test(emailText)
                ? emailInputRef.current.setErrorValue(
                    true,
                    'Wprowadź prawidłowy email',
                  )
                : emailInputRef.current.setErrorValue(false, '');
            }
          }}
        />
        <CustomTextInput
          ref={passwordInputRef}
          viewStyle={styles.inputText}
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
            confirmPasswordText !== text
              ? confirmPasswordInputRef.current.setErrorValue(
                  true,
                  'Hasła muszą być identyczne',
                )
              : confirmPasswordInputRef.current.setErrorValue(false, '');
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
              confirmPasswordText !== passwordText
                ? confirmPasswordInputRef.current.setErrorValue(
                    true,
                    'Hasła muszą być identyczne',
                  )
                : confirmPasswordInputRef.current.setErrorValue(false, '');
            }
          }}
          secureTextEntry={true}
        />
        <CustomTextInput
          ref={confirmPasswordInputRef}
          viewStyle={styles.inputText}
          color={secondaryNegativeColor}
          underlineColorAndroid={secondaryThreeFourthColor}
          placeholder={'Powtórz hasło'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          inputText={confirmPasswordText}
          onChangeText={(text) => {
            setConfirmPasswordText(text);
            passwordText !== text
              ? confirmPasswordInputRef.current.setErrorValue(
                  true,
                  'Hasła muszą być identyczne',
                )
              : confirmPasswordInputRef.current.setErrorValue(false, '');
          }}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              confirmPasswordText.length === 0
                ? confirmPasswordInputRef.current.setErrorValue(
                    true,
                    'Wprowadź hasło',
                  )
                : confirmPasswordInputRef.current.setErrorValue(false, '');
            }
          }}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[
            styles.registerButton,
            {
              backgroundColor: isFormValid
                ? primaryColor
                : darkMode
                ? secondaryThreeFourthColor
                : SECONDARY_HALF_COLOR,
            },
          ]}
          disabled={!isFormValid}
          onPress={OnPressRegister}>
          <Text
            style={[
              styles.registerButtonText,
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
            Zarejestruj
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionLoginHint}
          onPress={OnPressGoToLoginScreen}>
          <View style={styles.loginHintView}>
            <Text style={styles.loginHintText}>{'Masz konto?   '}</Text>
            <Text style={styles.loginHintBoldText}>Zaloguj się</Text>
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
    flex: 0.2,
    backgroundColor: secondaryColor,
  },
  image: {
    resizeMode: 'contain',
    flex: 0.6,
  },
  registerText: {
    color: primaryColor,
    fontSize: 44,
    alignSelf: 'center',
    marginVertical: 2,
  },
  textInput: {
    alignSelf: 'center',
    width: '65%',
  },
  sectionLoginHint: {
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 3,
    width: '65%',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  loginHintView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  loginHintText: {
    color: primaryColor,
    fontSize: 18,
    alignSelf: 'center',
  },
  loginHintBoldText: {
    color: primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  registerButton: {
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 3,
    width: '65%',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  registerButtonText: {
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 6,
  },
  sectionBody: {
    flex: 0.65,
    justifyContent: 'space-around',
    backgroundColor: secondaryColor,
    paddingBottom: 40,
  },
  inputText: {
    alignSelf: 'center',
    width: '65%',
  },
});

export default RegisterScreen;
