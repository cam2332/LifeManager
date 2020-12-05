import NetInfo from '@react-native-community/netinfo';
import * as SettingsApi from './SettingsApi';

export const IsNetworkAvailable = async () => {
  const response = await NetInfo.fetch();
  return response.isConnected;
};

export const UseNetwork = async () => {
  try {
    const network = await IsNetworkAvailable();
    const isOfflineMode = await SettingsApi.GetIsOfflineMode();
    const isAutoSync = await SettingsApi.GetIsAutoSync();
    const user = await SettingsApi.GetUserData();
    const accessToken = await SettingsApi.GetAccessToken();
    return network && !isOfflineMode && isAutoSync && user && accessToken;
  } catch (err) {
    console.error(err);
    return false;
  }
};
