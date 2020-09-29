import {UniqueId} from '../../HelperFunctions';

const time = new Date();
export const Notes = [
  {
    id: UniqueId(),
    title: 'Random note title',
    text: `Random note text, random note text,
random note text, random 
note text, random note text, random note text`,
    createDate: time.setHours(time.getHours() - 12),
    lastEditDate: time.setHours(time.getHours() + 10),
  },
  {
    id: UniqueId(),
    title: '',
    text: '',
    createDate: null,
    lastEditDate: null,
  },
  {
    id: UniqueId(),
    title: 'Random title',
    text: 'Random note text, random note text',
    createDate: time.setHours(time.getHours() - 12),
    lastEditDate: time.setHours(time.getHours() + 10),
  },
];
