import PushNotification from 'react-native-push-notifications';

PushNotification.configure({
  onNotification: function(notification){
      console.log('LOCAL NOTIFICATION ==>', notification)
  },

  popInitialNotification: true,
  requestPermissions: true
})

export const LocalNotification = (item1, item2) =>{
    PushNotification.localNotification({
        autoCancel : true,
        bigText :item2,
        subText: "",
        title: item1,
        message: item2,
        vibrate: true,
        vibration : 300,
        playSound : true,
        soundName : 'default',
        actions : ["Yes", "No"]
    })
}