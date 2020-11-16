import {serverAddress} from '../AppConfig';
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('mydb');

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
      .then(([statusCode, data]) => {
        if (statusCode === 200) {
          db.post({token: data.token}, (err, res) => {
            if (!err) {
              resolve();
            } else {
              reject();
            }
          });
        } else if (statusCode === 401) {
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  });
};
