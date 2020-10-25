import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  darkMode,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_NEGATIVE_COLOR,
  SECONDARY_HALF_COLOR,
} from '../AppConfig';
import {SetLoginRoot} from '../NavigationHelperFunctions';
import LogoIcon from '../../resources/LogoIcon.png';

const OnPressRegister = (a, b) => {
  console.log(a, b);
};

const OnPressGoToLoginScreen = () => {
  SetLoginRoot();
};

const RegisterScreen = () => {
  const [loginText, setLoginText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [confirmPasswordText, setConfirmPasswordText] = useState('');

  const AllFieldsFilled = () => {
    return (
      loginText !== '' &&
      emailText !== '' &&
      passwordText !== '' &&
      confirmPasswordText !== ''
    );
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
        <TextInput
          style={styles.textInput}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Nazwa użytkownika'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setLoginText(text)}
        />
        <TextInput
          style={styles.textInput}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Email'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setEmailText(text)}
        />
        <TextInput
          style={styles.inputText}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Hasło'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setPasswordText(text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.inputText}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Powtórz hasło'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setConfirmPasswordText(text)}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[
            styles.registerButton,
            {
              backgroundColor: AllFieldsFilled
                ? PRIMARY_COLOR
                : SECONDARY_COLOR,
            },
          ]}
          onPress={OnPressRegister}>
          <Text
            style={[
              styles.registerButtonText,
              {
                color: AllFieldsFilled
                  ? darkMode
                    ? SECONDARY_NEGATIVE_COLOR
                    : SECONDARY_COLOR
                  : PRIMARY_COLOR,
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
  },
  sectionLogo: {
    alignItems: 'center',
    flex: 0.4,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 0.2,
    backgroundColor: SECONDARY_COLOR,
  },
  image: {
    resizeMode: 'contain',
    flex: 0.6,
  },
  registerText: {
    color: PRIMARY_COLOR,
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
    color: PRIMARY_COLOR,
    fontSize: 18,
    alignSelf: 'center',
  },
  loginHintBoldText: {
    color: PRIMARY_COLOR,
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
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
  },
  registerButtonText: {
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 6,
  },
  sectionBody: {
    flex: 0.65,
    justifyContent: 'space-around',
    backgroundColor: SECONDARY_COLOR,
    paddingBottom: 40,
  },
  inputText: {
    alignSelf: 'center',
    width: '65%',
  },
});

export default RegisterScreen;
