import PushNotification from 'react-native-push-notification';
import * as TaskApi from './TaskApi';

export const Configure = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
      CreateChannel('LifeManager', 'LifeManagerChannel1');
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // process the notification
      if (notification.action === 'Wykonaj') {
        TaskApi.ChangeTaskIsDone(notification.task.id, true);
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('iACTION:', notification.action);
      console.log('iNOTIFICATION:', notification);

      // process the action
      if (notification.action === 'Wykonaj') {
        TaskApi.ChangeTaskIsDone(notification.task.id, true);
      }
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });
};

export const CreateChannel = (channelId, channelName) => {
  PushNotification.createChannel(
    {
      channelId: channelId,
      channelName: channelName,
    },
    (created) => {
      return created;
    },
  );
};

export const CreateTaskNotification = (task) => {
  const id = Math.floor(Math.random() * 10000000) + 10000;
  PushNotification.localNotificationSchedule({
    id: id + '',
    message: task.note,
    date: new Date(task.notificationDate),
    channelId: 'LifeManager',
    title: task.title,
    task,
    ...(task.category && task.category.color && {color: task.category.color}),
    smallIcon: 'ic_notif_logoicon',
    largeIcon: '',
    actions: ['Wykonaj'],
    allowWhileIdle: true,
    invokeApp: false,
  });
  return id;
};

export const CancelNotification = (notificationId) => {
  PushNotification.cancelLocalNotifications({
    id: notificationId + '',
  });
};
