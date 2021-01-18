import RNCalendarEvents from 'react-native-calendar-events';

let calendarId;
export const Configure = async () => {
  try {
    const permissions = await RNCalendarEvents.checkPermissions();
    if (permissions !== 'authorized') {
      RNCalendarEvents.requestPermissions();
    }
    (await RNCalendarEvents.findCalendars()).forEach((calendar) => {
      if (calendar.allowsModifications) {
        calendarId = calendar.id;
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const SaveEvent = async (title, details) => {
  try {
    const eventId = await RNCalendarEvents.saveEvent(title, {
      ...details,
      calendarId: calendarId,
    });
    return eventId;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const UpdateEvent = async (id, title, details?) => {
  await RNCalendarEvents.saveEvent(title, {...details, id});
};

export const DeleteEvent = async (id) => {
  try {
    const success = await RNCalendarEvents.removeEvent(id);
    return success;
  } catch (error) {
    return Promise.reject(error);
  }
};
