import PouchDB from 'pouchdb-react-native';
const settingsDB = new PouchDB('settings');

export const SetAccessToken = async (token) => {
  try {
    await settingsDB.put(
      {
        _rev: '1',
        _id: 'access_token',
        date: new Date(),
        token: token,
      },
      {force: true},
    );
  } catch (err) {
    console.log('set access token failed', err);
  }
};

export const GetAccessToken = async () => {
  try {
    const token = await settingsDB.get('access_token');
    return token.token;
  } catch (err) {
    console.log('get access token failed', err);
  }
};

export const DeleteAccessToken = () => {
  settingsDB.destroy();
};

export const SetUserData = async (user) => {
  try {
    await settingsDB.put(
      {
        _rev: '1',
        _id: 'userData',
        userId: user.id,
        login: user.login,
        email: user.email,
        displayName: user.displayName,
        profileImageUrl: user.profileImageUrl,
      },
      {force: true},
    );
  } catch (err) {
    console.log('set user data failed', err);
  }
};

export const GetUserData = async () => {
  try {
    const userData = await settingsDB.get('userData');
    delete userData._id;
    delete userData._rev;
    return userData;
  } catch (err) {
    console.log('get user data failed', err);
  }
};

export const SetIsOfflineMode = async (isOffline) => {
  try {
    await settingsDB.put(
      {_rev: '1', _id: 'offlineMode', value: isOffline},
      {force: true},
    );
  } catch (err) {
    console.log('set offline mode failed', err);
  }
};

export const GetIsOfflineMode = async () => {
  try {
    const isOfflineMode = await settingsDB.get('offlineMode');
    delete isOfflineMode._id;
    delete isOfflineMode._rev;
    return isOfflineMode;
  } catch (err) {
    console.log('get is offline mode failed', err);
  }
};
