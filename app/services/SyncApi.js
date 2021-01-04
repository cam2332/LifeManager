import {serverAddress} from '../AppConfig';
import * as NetworkApi from './NetworkApi';
import * as SettingsApi from './SettingsApi';
import * as NoteApi from './NoteApi';
import * as TaskApi from './TaskApi';
import * as CategoryApi from './CategoryApi';

export const Sync = async () => {
  const isConnected = await NetworkApi.IsNetworkAvailable();
  if (!isConnected) {
    return false;
  }
  const token = await SettingsApi.GetAccessToken();
  const notes = await NoteApi.LocalGetAllNotes();
  const tasks = await TaskApi.LocalGetAllTasks();
  const categories = await CategoryApi.LocalGetCategories();

  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'sync/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notes: notes,
        tasks: tasks,
        categories: categories,
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        return Promise.all([statusCode, response]);
      })
      .then(([statusCode, response]) => {
        if (statusCode === 200) {
          const {
            notes: remoteNotes,
            tasks: remoteTasks,
            categories: remoteCategories,
          } = response.json();
          remoteNotes &&
            remoteNotes.length > 0 &&
            remoteNotes.forEach((note) => {
              NoteApi.LocalUpdateNote(note);
            });
          remoteTasks &&
            remoteTasks.length > 0 &&
            remoteTasks.forEach((task) => {
              TaskApi.LocalUpdateTask(task);
            });
          remoteCategories &&
            remoteCategories.length > 0 &&
            remoteCategories.forEach((category) => {
              CategoryApi.LocalAddCategory(category);
            });
          resolve();
        } else if (statusCode === 204) {
          resolve();
        } else if (statusCode === 400 || statusCode === 401) {
          const data = response.json();
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
