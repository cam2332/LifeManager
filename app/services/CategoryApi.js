import {UniqueId} from '../HelperFunctions';
import {serverAddress} from '../AppConfig';
import * as NetworkApi from './NetworkApi';
import * as SettingsApi from './SettingsApi';
import PouchDB from 'pouchdb-react-native';
const categoryDB = new PouchDB('categories');

export const LocalGetCategories = async () => {
  const categories = await categoryDB.allDocs({include_docs: true});
  return categories.rows.map((row) => {
    row.doc.id = row.doc._id;
    delete row.doc._id;
    return row.doc;
  });
};

const RemoteGetCategories = async () => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'category/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return Promise.all([statusCode, response]);
      })
      .then(([statusCode, response]) => {
        if (statusCode === 200) {
          const data = response.json();
          resolve(data);
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

export const GetCategories = async () => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let categories = [];
    if (isConnected) {
      categories = await RemoteGetCategories();
    } else {
      categories = await LocalGetCategories();
    }
    resolve(categories);
  });
};

const LocalGetCategoryById = async (categoryId) => {
  try {
    const category = await categoryDB.get(categoryId);
    return category;
  } catch (err) {
    console.log('get category by id failed', err);
    return undefined;
  }
};

const RemoteGetCategoryById = async (categoryId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `category/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return Promise.all([statusCode, response]);
      })
      .then(([statusCode, response]) => {
        if (statusCode === 200) {
          const data = response.json();
          resolve(data);
        } else if (statusCode === 404) {
          resolve(undefined);
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

export const GetCategoryById = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let category;
    if (isConnected) {
      category = await RemoteGetCategoryById(categoryId);
    } else {
      category = await LocalGetCategoryById(categoryId);
    }
    resolve(category);
  });
};

export const LocalAddCategory = async (category) => {
  try {
    const createdCategory = await categoryDB.put({
      _id: category.id || UniqueId(),
      text: category.text,
      color: category.color,
      icon: category.icon,
    });
    return {id: createdCategory.id, ...category};
  } catch (err) {
    return {};
  }
};

const RemoteAddCategory = async (category) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'category/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        text: category.text || '',
        color: category.color || '',
        icon: category.icon || '',
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(async ([statusCode, data]) => {
        if (statusCode === 201) {
          await LocalAddCategory(data);
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

export const AddCategory = async (category) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let createdCategory;
    if (isConnected) {
      createdCategory = await RemoteAddCategory(category);
    } else {
      createdCategory = await LocalAddCategory(category);
    }
    resolve(createdCategory);
  });
};

const LocalDeleteCategory = async (categoryId) => {
  try {
    const category = await categoryDB.get(categoryId);
    category._deleted = true;
    const deletedCategory = await categoryDB.put(category);
    return deletedCategory.ok;
  } catch (err) {
    return false;
  }
};

const RemoteDeleteCategory = async (categoryId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `category/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalDeleteCategory(categoryId);
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

export const DeleteCategory = async (categoryId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteDeleteCategory(categoryId);
    } else {
      await LocalDeleteCategory(categoryId);
    }
    resolve();
  });
};
