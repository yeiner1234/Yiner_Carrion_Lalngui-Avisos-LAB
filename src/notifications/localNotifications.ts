import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';



const CHANNEL_ID = 'laboratorio';

  Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner:true,
        shouldShowList: true,
    }),


  });


  export async function ensureNotificationPermission(): Promise<boolean> {
        if(Platform.OS === 'android') {
        try {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Avisos del laboratorio',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#087f8c',
        enableVibrate: true,
        showBadge: false,
    });
    } catch (e) {
      console.log('No se pudo crear el canal (Expo Go):', e);
    }
        
        }
            let permission = await Notifications.getPermissionsAsync();
        if(!permission.granted) {
            permission = await Notifications.requestPermissionsAsync();
    }
    return permission.granted   ||
            permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}




export async function showLocalNotification(): Promise<void>{
    await Notifications.scheduleNotificationAsync({
        content: {
            title:'Expo Notify',
            body: `Noty programada el ${new Date().toLocaleString('es-ES')}`,
            sound: 'default',
        }, 
        trigger:{
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
            channelId: CHANNEL_ID,
        },
    });
}

export async function getExpoPushToken(): Promise<string> {
 const allowed = await ensureNotificationPermission();
 if (!allowed) throw new Error('Permiso denegado');
 const projectId = Constants.expoConfig?.extra?.eas?.projectId ??
 Constants.easConfig?.projectId;
 if (!projectId) throw new Error('Falta projectId de EAS');
 const result = await Notifications.getExpoPushTokenAsync({ projectId });
 return result.data;
}
