import {UniqueId} from '../HelperFunctions';
import {serverAddress} from '../AppConfig';
import * as NetworkApi from './NetworkApi';
import * as SettingsApi from './SettingsApi';
import PouchDB from 'pouchdb-react-native';
const taskDB = new PouchDB('tasks');

const MergeLocalTaskDataArray = (array, localArray) => {
  let merged = [];
  for (let i = 0; i < array.length; i++) {
    const localTaskIndex = localArray.findIndex(
      (lTask) => lTask.id === array[i].id,
    );
    if (localTaskIndex !== -1) {
      merged.push({
        ...array[i],
        ...localArray[localTaskIndex],
      });
    } else {
      merged.push(array[i]);
    }
  }
  return merged;
};

export const LocalUpdateTask = async (task) => {
  try {
    const localTask = await taskDB.get(task.id);
    localTask.title = task.title;
    localTask.startDate = task.startDate;
    localTask.endDate = task.endDate;
    localTask.categoryId = task.categoryId;
    localTask.note = task.note;
    localTask.notificationDate = task.notificationDate;
    localTask.notificationId = task.notificationId;
    localTask.saveToCalendar = task.saveToCalendar;
    localTask.calendarEventId = task.calendarEventId;
    localTask.done = task.done;
    localTask.favorite = task.favorite;
    localTask.lastEditDate = task.lastEditDate || new Date();
    const updatedTask = await taskDB.put(localTask);
    return updatedTask.ok;
  } catch (err) {
    return {};
  }
};

const LocalCreateTask = async (task) => {
  try {
    const createdTask = await taskDB.put({
      _id: task.id || UniqueId(),
      title: task.title,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      categoryId: task.categoryId || '',
      note: task.note || '',
      notificationId: task.notificationId || '',
      notificationDate: task.notificationDate || '',
      saveToCalendar: task.saveToCalendar || false,
      calendarEventId: task.calendarEventId || '',
      done: task.done || false,
      favorite: task.favorite || false,
      lastEditDate: task.lastEditDate || new Date(),
    });
    return {id: createdTask.id, ...task};
  } catch (err) {
    return {};
  }
};

const RemoteCreateTask = async (task) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'task/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title,
        ...(task.startDate && {startDate: task.startDate}),
        ...(task.endDate && {endDate: task.endDate}),
        ...(task.categoryId && {categoryId: task.categoryId}),
        ...(task.note && {note: task.note}),
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(async ([statusCode, data]) => {
        if (statusCode === 201) {
          await LocalCreateTask(task);
          resolve(data);
        } else if (statusCode === 400 || statusCode === 401) {
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

export const CreateTask = async (task) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let createdTask;
    if (isConnected) {
      createdTask = await RemoteCreateTask(task);
    } else {
      createdTask = await LocalCreateTask(task);
    }
    resolve(createdTask);
  });
};

const LocalChangeTaskTitle = async (taskId, newTitle) => {
  try {
    const task = await taskDB.get(taskId);
    task.title = newTitle;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskTitle = async (taskId, newTitle) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}/title/${newTitle}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskTitle(taskId, newTitle);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskTitle = async (taskId, newTitle) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskTitle(taskId, newTitle);
    } else {
      await LocalChangeTaskTitle(taskId, newTitle);
    }
    resolve();
  });
};

const LocalChangeTaskStartDate = async (taskId, newStartDate) => {
  try {
    const task = await taskDB.get(taskId);
    task.startDate = newStartDate;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskStartDate = async (taskId, newStartDate) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}/start-date/${newStartDate}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskStartDate(taskId, newStartDate);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskStartDate = async (taskId, newStartDate) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskStartDate(taskId, newStartDate);
    } else {
      await LocalChangeTaskStartDate(taskId, newStartDate);
    }
    resolve();
  });
};

const LocalChangeTaskEndDate = async (taskId, newEndDate) => {
  try {
    const task = await taskDB.get(taskId);
    task.endDate = newEndDate;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskEndDate = async (taskId, newEndDate) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}/end-date/${newEndDate}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskEndDate(taskId, newEndDate);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskEndDate = async (taskId, newEndDate) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskEndDate(taskId, newEndDate);
    } else {
      await LocalChangeTaskEndDate(taskId, newEndDate);
    }
    resolve();
  });
};

const LocalChangeTaskCategoryId = async (taskId, newCategoryId) => {
  try {
    const task = await taskDB.get(taskId);
    task.categoryId = newCategoryId;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskCategoryId = async (taskId, newCategoryId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `task/${taskId}/category-id/${newCategoryId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskCategoryId(taskId, newCategoryId);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskCategoryId = async (taskId, newCategoryId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskCategoryId(taskId, newCategoryId);
    } else {
      await LocalChangeTaskCategoryId(taskId, newCategoryId);
    }
    resolve();
  });
};

const LocalChangeTaskNote = async (taskId, newNote) => {
  try {
    const task = await taskDB.get(taskId);
    task.note = newNote;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskNote = async (taskId, newNote) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}/note/${newNote}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskNote(taskId, newNote);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskNote = async (taskId, newNote) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskNote(taskId, newNote);
    } else {
      await LocalChangeTaskNote(taskId, newNote);
    }
    resolve();
  });
};

const LocalChangeTaskIsFavorite = async (taskId, isFavorite) => {
  try {
    const task = await taskDB.get(taskId);
    task.favorite = isFavorite;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskIsFavorite = async (taskId, isFavorite) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `task/${taskId}/favorite/${isFavorite.toString()}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskIsFavorite(taskId, isFavorite);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskIsFavorite = async (taskId, isFavorite) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskIsFavorite(taskId, isFavorite);
    } else {
      await LocalChangeTaskIsFavorite(taskId, isFavorite);
    }
    resolve();
  });
};

const LocalChangeTaskIsDone = async (taskId, isDone) => {
  try {
    const task = await taskDB.get(taskId);
    task.done = isDone;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeTaskIsDone = async (taskId, isDone) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}/done/${isDone.toString()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeTaskIsDone(taskId, isDone);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
          reject(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const ChangeTaskIsDone = async (taskId, isDone) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeTaskIsDone(taskId, isDone);
    } else {
      await LocalChangeTaskIsDone(taskId, isDone);
    }
    resolve();
  });
};

const LocalChangeTaskNotification = async (
  taskId,
  notificationId,
  notificationDate,
) => {
  try {
    const task = await taskDB.get(taskId);
    task.notificationId = notificationId;
    task.notificationDate = notificationDate;
    task.lastEditDate = new Date();
    const updatedTask = await taskDB.put(task);
    return updatedTask.ok;
  } catch (err) {
    return false;
  }
};

export const ChangeTaskNotification = async (
  taskId,
  notificationId,
  notificationDate,
) => {
  return new Promise(async (resolve, reject) => {
    await LocalChangeTaskNotification(taskId, notificationId, notificationDate);
    resolve();
  });
};

export const LocalGetAllTasks = async () => {
  const tasks = await taskDB.allDocs({include_docs: true});
  return tasks.rows.map((row) => {
    row.doc.id = row.doc._id;
    if (row.doc.categoryId && row.doc.categoryId === '') {
      row.doc.categoryId = undefined;
    }
    delete row.doc._id;
    return row.doc;
  });
};

const RemoteGetAllTasks = async () => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'task/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const statusCode = response.status;
        return Promise.all([statusCode, response]);
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 200) {
          const data = await response.json();
          let localTasksData;
          try {
            localTasksData = await LocalGetAllTasks();
            resolve(MergeLocalTaskDataArray(data, localTasksData));
          } catch (err) {
            resolve(data);
          }
        } else if (statusCode === 404) {
          resolve([]);
        } else if (statusCode === 400 || statusCode === 401) {
          const data = await response.json();
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

export const GetAllTasks = async () => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let tasks = [];
    if (isConnected) {
      tasks = await RemoteGetAllTasks();
    } else {
      tasks = await LocalGetAllTasks();
    }
    resolve(tasks);
  });
};

const LocalGetTasksByTitle = async (title) => {
  const tasks = await LocalGetAllTasks();
  return (
    tasks.filter((task) =>
      task.title.toLowerCase().includes(title.toLowerCase()),
    ) || []
  );
};

const RemoteGetTasksByTitle = async (title) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `task/search?title=${encodeURIComponent(title)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;

        return Promise.all([statusCode, response]);
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 200) {
          const data = response.json();
          const localTasksData = await LocalGetTasksByTitle(title);
          resolve(MergeLocalTaskDataArray(data, localTasksData));
        } else if (statusCode === 404) {
          resolve([]);
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

export const GetTasksByTitle = async (title) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let tasks = [];
    if (isConnected) {
      tasks = await RemoteGetTasksByTitle(title);
    } else {
      tasks = await LocalGetTasksByTitle(title);
    }
    resolve(tasks);
  });
};

const LocalGetTasksByCategoryId = async (categoryId) => {
  const tasks = await LocalGetAllTasks();
  if (categoryId === 'favorite') {
    return tasks.filter((task) => task.favorite) || [];
  } else if (categoryId === 'planned') {
    return tasks.filter((task) => task.startDate || task.endDate) || [];
  } else if (categoryId === 'notification') {
    return (
      tasks.filter((task) => task.notificationId && task.notificationDate) || []
    );
  }
  return tasks.filter((task) => task.categoryId === categoryId) || [];
};

const RemoteGetTasksByCategoryId = async (categoryId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress +
        `task/search?categoryId=${encodeURIComponent(categoryId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;

        return Promise.all([statusCode, response]);
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 200) {
          const data = response.json();
          const localTasksData = await LocalGetTasksByCategoryId(categoryId);
          resolve(MergeLocalTaskDataArray(data, localTasksData));
        } else if (statusCode === 404) {
          resolve([]);
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

export const GetTasksByCategoryId = async (categoryId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let tasks = [];
    if (isConnected) {
      tasks = await RemoteGetTasksByCategoryId(categoryId);
    } else {
      tasks = await LocalGetTasksByCategoryId(categoryId);
    }
    resolve(tasks);
  });
};

const LocalGetTasksByTitleAndCategoryId = async (title, categoryId) => {
  const tasks = await LocalGetAllTasks();
  if (categoryId === 'favorite') {
    return (
      tasks.filter(
        (task) =>
          task.favorite &&
          task.title.toLowerCase().includes(title.toLowerCase()),
      ) || []
    );
  } else if (categoryId === 'planned') {
    return (
      tasks.filter(
        (task) =>
          (task.startDate || task.endDate) &&
          task.title.toLowerCase().includes(title.toLowerCase()),
      ) || []
    );
  } else if (categoryId === 'notification') {
    return (
      tasks.filter(
        (task) =>
          task.notificationId &&
          task.notificationDate &&
          task.title.toLowerCase().includes(title.toLowerCase()),
      ) || []
    );
  }
  return (
    tasks.filter(
      (task) =>
        task.categoryId === categoryId &&
        task.title.toLowerCase().includes(title.toLowerCase()),
    ) || []
  );
};

const RemoteGetTasksByTitleAndCategoryId = async (title, categoryId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress +
        `task/search?categoryId=${encodeURIComponent(
          categoryId,
        )}&title=${encodeURIComponent(title)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;

        return Promise.all([statusCode, response]);
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 200) {
          const data = response.json();
          const localTasksData = await LocalGetTasksByTitleAndCategoryId(
            title,
            categoryId,
          );
          resolve(MergeLocalTaskDataArray(data, localTasksData));
        } else if (statusCode === 404) {
          resolve([]);
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

export const GetTasksByTitleAndCategoryId = async (title, categoryId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let tasks = [];
    if (isConnected) {
      tasks = await RemoteGetTasksByTitleAndCategoryId(title, categoryId);
    } else {
      tasks = await LocalGetTasksByTitleAndCategoryId(title, categoryId);
    }
    resolve(tasks);
  });
};

const LocalDeleteTask = async (taskId) => {
  try {
    const task = await taskDB.get(taskId);
    task._deleted = true;
    const deletedTask = await taskDB.put(task);
    return deletedTask.ok;
  } catch (err) {
    return false;
  }
};

const RemoteDeleteTask = async (taskId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if ((statusCode = 204)) {
          await LocalDeleteTask(taskId);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
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

export const DeleteTask = async (taskId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteDeleteTask(taskId);
    } else {
      await LocalDeleteTask(taskId);
    }
    resolve();
  });
};

const LocalDeleteTasks = async (tasksIds) => {
  try {
    const tasks = await taskDB.allDocs({include_docs: true, keys: tasksIds});
    const deletedDocs = [];
    tasks.rows.forEach((row) => {
      row.doc._deleted = true;
      tasksIds.includes(row.id) && deletedDocs.push(row.doc);
    });
    const deletedTasks = await taskDB.bulkDocs(deletedDocs);
    return deletedTasks.every((task) => task.ok);
  } catch (err) {
    return false;
  }
};

const RemoteDeleteTasks = async (tasksIds) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `task/?ids=${encodeURIComponent(noteIds)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalDeleteTasks(tasksIds);
          resolve();
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
          const data = await response.json();
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

export const DeleteTasks = async (tasksIds) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteDeleteTasks(tasksIds);
    } else {
      await LocalDeleteTasks(tasksIds);
    }
    resolve();
  });
};
