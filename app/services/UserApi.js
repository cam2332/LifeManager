import {serverAddress} from '../AppConfig';
import * as SettingsApi from './SettingsApi';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';

export const RegisterUser = async (login, email, password) => {
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({login, email, password}),
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        if (statusCode === 201) {
          resolve(data);
        } else if (statusCode === 409) {
          reject(data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  });
};

export const LoginUser = async (login, password) => {
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
        deviceName: 'DeviceName',
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(async ([statusCode, data]) => {
        if (statusCode === 200) {
          try {
            await SettingsApi.SetAccessToken(data.token);
            await SettingsApi.SetUserData(data.user);
            await SettingsApi.SetIsOfflineMode(false);
            resolve();
          } catch (err) {
            reject();
          }
        } else if (statusCode === 401) {
          reject(data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  });
};

export const LogoutUser = async () => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'user/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(async ([statusCode, data]) => {
        if (statusCode === 200 || statusCode === 404) {
          resolve();
        } else if (statusCode === 400 || statusCode === 401) {
          await ClearUserTokenAndGoToLoginScreen();
          reject(data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ClearUserTokenAndGoToLoginScreen = async () => {
  await SettingsApi.DeleteAccessToken();
  await SettingsApi.DeleteUserData();
  NavigationHelperFunctions.SetLoginRoot();
};
