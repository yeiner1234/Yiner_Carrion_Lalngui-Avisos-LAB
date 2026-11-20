import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureNotificationPermission, showLocalNotification } from './src/notifications/localNotifications';
export default function App() {
const handleNotify = async() => {
try{
  const allowed = await ensureNotificationPermission();
  if(!allowed){
    Alert.alert('Permiso denegado', 'No se puede enviar la notificación sin permiso.');
    return;
  }
await showLocalNotification();
}
catch(e) {
  console.log('Error_Notification', e);
  Alert.alert('Error', 'No se pudo preparar la NotiFY :/.');

}


}


 return (
 <View style={styles.container}>
 <Text style={styles.title}>Laboratorio de avisos</Text>
 <Text style={styles.description}>
 Pulsa el botón para probar una notificación.
 </Text>
 <Pressable
 style={styles.button}
 onPress={() => handleNotify()}
 >
 <Text style={styles.buttonText}>Enviar notificación</Text>
 </Pressable>
 </View>
 );
}
const styles = StyleSheet.create({
 container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
 title: { fontSize: 25, fontWeight: 'bold', marginBottom: 12 },
 description: { textAlign: 'center', marginBottom: 24 },
 button: { backgroundColor: '#087f8c', padding: 16, borderRadius: 12 },
 buttonText: { color: 'white', fontWeight: 'bold' },
});
