import {serverAddress} from '../AppConfig';

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
          resolve([statusCode, data]);
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
