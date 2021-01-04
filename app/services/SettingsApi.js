import PouchDB from 'pouchdb-react-native';
const settingsDB = new PouchDB('settings');

export const SetAccessToken = async (token) => {
  try {
    await settingsDB.put(
      {
        _rev: '1',
        _id: 'accessToken',
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
    const token = await settingsDB.get('accessToken');
    return token.token;
  } catch (err) {
    console.log('get access token failed', err);
    return undefined;
  }
};

export const DeleteAccessToken = async () => {
  try {
    const token = await settingsDB.get('accessToken');
    token._deleted = true;
    await settingsDB.put(token);
    return true;
  } catch (err) {
    console.log('delete access token failed', err);
    return false;
  }
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
    return undefined;
  }
};

export const DeleteUserData = async () => {
  try {
    const userData = await settingsDB.get('userData');
    userData._deleted = true;
    await settingsDB.put(userData);
    return true;
  } catch (err) {
    console.log('delete user data failed', err);
    return false;
  }
};

export const SetIsOfflineMode = async (isOffline) => {
  try {
    try {
      const isOfflineMode = await settingsDB.get('offlineMode');
      isOfflineMode.value = isOffline;
      await settingsDB.put(isOfflineMode);
    } catch (err) {
      await settingsDB.put(
        {_rev: '1', _id: 'offlineMode', value: isOffline},
        {force: true},
      );
    }
  } catch (err) {
    console.log('set offline mode failed', err);
  }
};

export const GetIsOfflineMode = async () => {
  try {
    const isOfflineMode = await settingsDB.get('offlineMode');
    return isOfflineMode.value;
  } catch (err) {
    console.log('get is offline mode failed', err);
    return false;
  }
};

export const SetIsAutoSync = async (isAutoSync) => {
  try {
    try {
      const isAuto = await settingsDB.get('autoSync');
      isAuto.value = isAutoSync;
      await settingsDB.put(isAuto);
    } catch (err) {
      await settingsDB.put(
        {_rev: '1', _id: 'autoSync', value: isAutoSync},
        {force: true},
      );
    }
  } catch (err) {
    console.log('set AutoSync failed', err);
  }
};

export const GetIsAutoSync = async () => {
  try {
    const isAutoSync = await settingsDB.get('autoSync');
    return isAutoSync.value;
  } catch (err) {
    console.log('get is AutoSync failed', err);
    return true;
  }
};

export const SetPrimaryColor = async (primaryColor) => {
  try {
    try {
      const color = await settingsDB.get('primaryColor');
      color.value = primaryColor;
      await settingsDB.put(color);
    } catch (err) {
      await settingsDB.put(
        {_rev: '1', _id: 'primaryColor', value: primaryColor},
        {force: true},
      );
    }
  } catch (err) {
    console.log('set primary color failed', err);
  }
};

export const GetPrimaryColor = async () => {
  try {
    const primaryColor = await settingsDB.get('primaryColor');
    return primaryColor.value;
  } catch (err) {
    console.log('get primary color failed', err);
    return undefined;
  }
};

export const SetIsDarkMode = async (darkMode) => {
  try {
    try {
      const dark = await settingsDB.get('darkMode');
      dark.value = darkMode;
      await settingsDB.put(dark);
    } catch (err) {
      await settingsDB.put(
        {_rev: '1', _id: 'darkMode', value: darkMode},
        {force: true},
      );
    }
  } catch (err) {
    console.log('set darkMode failed', err);
  }
};

export const GetIsDarkMode = async () => {
  try {
    const darkMode = await settingsDB.get('darkMode');
    return darkMode.value;
  } catch (err) {
    console.log('get darkMode failed', err);
    return false;
  }
};

export const SetLastSynchronizationDate = async (newSynchronizationDate) => {
  try {
    try {
      const synchronizationDate = await settingsDB.get('synchronizationDate');
      synchronizationDate.value = newSynchronizationDate;
      await settingsDB.put(synchronizationDate);
    } catch (err) {
      await settingsDB.put(
        {_rev: '1', _id: 'synchronizationDate', value: newSynchronizationDate},
        {force: true},
      );
    }
  } catch (err) {
    console.log('set synchronization Date failed', err);
  }
};

export const GetLastSynchronizationDate = async () => {
  try {
    const synchronizationDate = await settingsDB.get('synchronizationDate');
    return synchronizationDate.value;
  } catch (err) {
    console.log('get synchronization Date failed', err);
    return undefined;
  }
};

  }
};
