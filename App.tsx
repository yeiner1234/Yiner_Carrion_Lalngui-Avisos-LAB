import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureNotificationPermission, showLocalNotification,
 getExpoPushToken } from './src/notifications/localNotifications';
import { requestPushFromServer } from './src/notifications/pushServer';

export default function App() {
 const handleNotify = async () => {
 try {
 const allowed = await ensureNotificationPermission();
 if (!allowed) {
 Alert.alert('Permiso denegado', 'No se puede enviar la notificación sin permiso.');
 return;
 }
 await showLocalNotification();
 } catch (e) {
 console.log('Error_Notification', e);
 Alert.alert('Error', 'No se pudo preparar la NotiFY :/.');
 }
 };

 const [serverStatus, setServerStatus] = useState('Sin solicitud remota');

 const handleServerPush = async () => {
 try {
 setServerStatus('Preparando token...');
 const token = await getExpoPushToken();
 setServerStatus('Solicitando al servidor...');
 const ticketId = await requestPushFromServer(token);
 setServerStatus(`Expo aceptó el envío (${ticketId}). Revisa avisos.`);
 } catch (error) {
 console.error('Error de push remoto:', error);
 setServerStatus(error instanceof Error ? error.message : String(error));
 }
 };

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
 <Pressable style={[styles.button, styles.pushButton]}
 onPress={handleServerPush}>
 <Text style={styles.buttonText}>Pedir push al servidor</Text>
 </Pressable>
 <Text style={styles.serverStatus}>{serverStatus}</Text>
 </View>
 );
}
const styles = StyleSheet.create({
 container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
 title: { fontSize: 25, fontWeight: 'bold', marginBottom: 12 },
 description: { textAlign: 'center', marginBottom: 24 },
 button: { backgroundColor: '#087f8c', padding: 16, borderRadius: 12 },
 buttonText: { color: 'white', fontWeight: 'bold' },
 pushButton: { marginTop: 14, backgroundColor: '#3b5bdb' },
 serverStatus: { marginTop: 14, textAlign: 'center' },
});
