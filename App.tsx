import React, { useEffect } from 'react';
import { Alert, Text, View,Button, StyleSheet, ScrollView } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {
  useEffect(() => {
    requestPermissionsAndroid();
  }, []);

  const requestPermissionsAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getToken();
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('FMC token is here', JSON.stringify(remoteMessage));
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const onDisplayNotification = async (remoteMessages: any) => {

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessages.notification.title,
      body: remoteMessages.notification.body,
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', 
        pressAction: {
          id: 'default',
        },
      },
    });
  }


  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>Notify App</Text>

      <View style={styles.dashboard}>
        <Text style={styles.dashboardHeading}>Welcome to Notify</Text>
        <Text style={styles.subheading}>this is a andriod emulator</Text>
        <Text style={styles.subheading}>Pushing Notifications...</Text>
      </View>
      <View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#141414',
    flexGrow: 1,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  dashboard: {
    marginTop: 10,
  },
  dashboardHeading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007AFF',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default App;
