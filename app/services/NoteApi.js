import {UniqueId} from '../HelperFunctions';
import {serverAddress} from '../AppConfig';
import * as NetworkApi from './NetworkApi';
import * as SettingsApi from './SettingsApi';
import PouchDB from 'pouchdb-react-native';
const noteDB = new PouchDB('notes');

export const LocalUpdateNote = async (note) => {
  try {
    const localNote = await noteDB.get(note.id);
    localNote.title = note.title;
    localNote.text = note.text;
    localNote.createDate = note.createDate;
    localNote.lastEditDate = note.lastEditDate;
    localNote.color = note.color;
    const updatedNote = await noteDB.put(localNote);
    return updatedNote.ok;
  } catch (err) {
    return {};
  }
};

const LocalCreateNote = async (note) => {
  try {
    const createdNote = await noteDB.put({
      _id: note.id || UniqueId(),
      title: note.title || '',
      text: note.text || '',
      createDate: note.createDate || new Date(),
      lastEditDate: note.lastEditDate || new Date(),
      color: note.color || '#0788D9',
    });
    return {id: createdNote.id, ...note};
  } catch (err) {
    return {};
  }
};

const RemoteCreateNote = async (note) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'note/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        title: note.title || '',
        text: note.text || '',
        color: note.color || '#0788D9',
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(async ([statusCode, data]) => {
        if (statusCode === 201) {
          await LocalCreateNote(data);
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

export const CreateNote = async (note) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let createdNote;
    if (isConnected) {
      createdNote = await RemoteCreateNote(note);
    } else {
      createdNote = await LocalCreateNote(note);
    }
    resolve(createdNote);
  });
};

const LocalChangeNoteTitle = async (noteId, newTitle) => {
  try {
    const note = await noteDB.get(noteId);
    note.title = newTitle;
    note.lastEditDate = new Date();
    const updatedNote = await noteDB.put(note);
    return updatedNote.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeNoteTitle = async (noteId, newTitle) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `note/${noteId}/title/${encodeURIComponent(newTitle)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeNoteTitle(noteId, newTitle);
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

export const ChangeNoteTitle = async (noteId, newTitle) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeNoteTitle(noteId, newTitle);
    } else {
      await LocalChangeNoteTitle(noteId, newTitle);
    }
    resolve();
  });
};

const LocalChangeNoteText = async (noteId, newText) => {
  try {
    const note = await noteDB.get(noteId);
    note.text = newText;
    note.lastEditDate = new Date();
    const updatedNote = await noteDB.put(note);
    return updatedNote.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeNoteText = async (noteId, newText) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `note/${noteId}/text/${encodeURIComponent(newText)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeNoteText(noteId, newText);
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

export const ChangeNoteText = async (noteId, newText) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeNoteText(noteId, newText);
    } else {
      await LocalChangeNoteText(noteId, newText);
    }
    resolve();
  });
};

const LocalChangeNoteColor = async (noteId, newColor) => {
  try {
    const note = await noteDB.get(noteId);
    note.color = newColor;
    note.lastEditDate = new Date();
    const updatedNote = await noteDB.put(note);
    console.log('change note color', updatedNote);
    return updatedNote.ok;
  } catch (err) {
    return false;
  }
};

const RemoteChangeNoteColor = async (noteId, newColor) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(
      serverAddress + `note/${noteId}/color/${encodeURIComponent(newColor)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalChangeNoteColor(noteId, newColor);
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

export const ChangeNoteColor = async (noteId, newColor) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteChangeNoteColor(noteId, newColor);
    } else {
      await LocalChangeNoteColor(noteId, newColor);
    }
    resolve();
  });
};

const LocalGetAllNotes = async () => {
  const notes = await noteDB.allDocs({include_docs: true});
  return notes.rows.map((row) => {
    row.doc.id = row.doc._id;
    delete row.doc._id;
    return row.doc;
  });
};

const RemoteGetAllNotes = async () => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'note/', {
      method: 'GET',
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
      .then(([statusCode, data]) => {
        if (statusCode === 200) {
          resolve(data);
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
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

export const GetAllNotes = async () => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let notes = [];
    if (isConnected) {
      notes = await RemoteGetAllNotes();
    } else {
      notes = await LocalGetAllNotes();
    }
    resolve(notes);
  });
};

const LocalGetNotesByTitleAndText = async (text) => {
  const notes = await LocalGetAllNotes();
  return (
    notes.filter(
      (note) =>
        note.title.toLowerCase().includes(text.toLowerCase()) ||
        note.text.toLowerCase().includes(text.toLowerCase()),
    ) || []
  );
};

const RemoteGetNotesByTitleAndText = async (text) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `note/search/${encodeURIComponent(text)}`, {
      method: 'GET',
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
      .then(([statusCode, data]) => {
        if (statusCode === 200) {
          resolve(data);
        } else if (
          statusCode === 404 ||
          statusCode === 400 ||
          statusCode === 401
        ) {
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

export const GetNotesByTitleAndText = async (title) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    let notes = [];
    if (isConnected) {
      notes = await RemoteGetNotesByTitleAndText(title);
    } else {
      notes = await LocalGetNotesByTitleAndText(title);
    }
    resolve(notes);
  });
};

const LocalDeleteNote = async (noteId) => {
  try {
    const note = await noteDB.get(noteId);
    note._deleted = true;
    const deletedNote = await noteDB.put(note);
    return deletedNote.ok;
  } catch (err) {
    return false;
  }
};

const RemoteDeleteNote = async (noteId) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + `note/${encodeURIComponent(noteId)}`, {
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
          await LocalDeleteNote(noteId);
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

export const DeleteNote = async (noteId) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteDeleteNote(noteId);
    } else {
      await LocalDeleteNote(noteId);
    }
    resolve();
  });
};

const LocalDeleteNotes = async (notesIds) => {
  try {
    const notes = await noteDB.allDocs({include_docs: true, keys: notesIds});
    const deletedDocs = [];
    notes.rows.forEach((row) => {
      row.doc._deleted = true;
      notesIds.includes(row.id) && deletedDocs.push(row.doc);
    });
    const deletedNotes = await noteDB.bulkDocs(deletedDocs);
    return deletedNotes.every((note) => note.ok);
  } catch (err) {
    return false;
  }
};

const RemoteDeleteNotes = async (notesIds) => {
  const token = await SettingsApi.GetAccessToken();
  return new Promise((resolve, reject) => {
    return fetch(serverAddress + 'note/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(notesIds),
    })
      .then((response) => {
        const statusCode = response.status;
        return [statusCode, response];
      })
      .then(async ([statusCode, response]) => {
        if (statusCode === 204) {
          await LocalDeleteNotes(notesIds);
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

export const DeleteNotes = async (notesIds) => {
  return new Promise(async (resolve, reject) => {
    const isConnected = await NetworkApi.UseNetwork();
    if (isConnected) {
      await RemoteDeleteNotes(notesIds);
    } else {
      await LocalDeleteNotes(notesIds);
    }
    resolve();
  });
};
