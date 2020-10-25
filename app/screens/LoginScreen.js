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
import {SetRegisterRoot} from '../NavigationHelperFunctions';
import LogoIcon from '../../resources/LogoIcon.png';

const OnPressLogin = (a, b) => {
  console.log(a, b);
};

const onPressGoToRegisterScreen = () => {
  SetRegisterRoot();
};

const LoginScreen = () => {
  const [loginText, setLoginText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const AllFieldsFilled = () => {
    return loginText !== '' && passwordText !== '';
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sectionLogo}>
        <Image style={styles.image} source={LogoIcon} />
      </View>
      <View style={styles.sectionTitle}>
        <Text style={styles.loginText}>Logowanie</Text>
      </View>
      <View style={{flex: 0.25}} />
      <View style={styles.sectionBody}>
        <TextInput
          style={styles.textInput}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Nazwa użytkownika / Email'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setLoginText(text)}
        />
        <TextInput
          style={styles.textInput}
          color={SECONDARY_NEGATIVE_COLOR}
          underlineColorAndroid={'#c4c4c4'}
          placeholder={'Hasło'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(text) => setPasswordText(text)}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              backgroundColor: AllFieldsFilled
                ? PRIMARY_COLOR
                : SECONDARY_COLOR,
            },
          ]}
          onPress={() => OnPressLogin(loginText, passwordText)}>
          <Text
            style={[
              styles.loginButtonText,
              {
                color: AllFieldsFilled
                  ? darkMode
                    ? SECONDARY_NEGATIVE_COLOR
                    : SECONDARY_COLOR
                  : PRIMARY_COLOR,
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
  loginText: {
    color: PRIMARY_COLOR,
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
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
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
    flex: 0.4,
    justifyContent: 'space-around',
    backgroundColor: SECONDARY_COLOR,
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
    color: PRIMARY_COLOR,
    fontSize: 18,
    alignSelf: 'center',
  },
  registerHintBoldText: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
