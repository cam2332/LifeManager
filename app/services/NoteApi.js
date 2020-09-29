import {Notes} from './mocks/NoteMock';

export const GetAllNotes = async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  }).then(() => {
    return Notes;
  });
};

export const DeleteNotes = async (notesId) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  }).then(() => {
    return true;
  });
};

export const GetAllNotesByTitle = async (title) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  }).then(() => {
    return Notes.filter((note) => {
      return note.title.toLowerCase().includes(title.toLowerCase());
    });
  });
};
