import React from 'react';
import { useRef, useCallback } from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { PagecallView } from 'react-native-pagecall';
import type { PagecallViewRef } from 'react-native-pagecall';

const uri = "https://app.pagecall.com/meet?room_id=644788c75e874a1f1ce27bd4"

export default function App() {
  const viewRef = useRef<PagecallViewRef>(null);

  const handleButtonClick = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.sendMessage('Hello from React Native!');
  }, [viewRef]);

  const handleMessage = useCallback((message: string) => {
    console.log('Received message from PagecallView:', message);
  }, []);

  return (
    <View style={styles.container}>
      <PagecallView uri={uri} style={styles.pagecallView} ref={viewRef} onMessage={handleMessage} />
      <View style={styles.buttonContainer}>
        <Button title="Send Message" onPress={handleButtonClick} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagecallView: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});
