import React from 'react';
import { useRef, useCallback } from 'react';

import { Button, StyleSheet, View } from 'react-native';
import {
  PagecallWebView,
  PagecallWebViewRef,
} from '@pagecall/react-native-webview';

export default function App() {
  const webViewRef = useRef<PagecallWebViewRef>(null);

  const handleButtonClick = useCallback(() => {
    if (!webViewRef.current) return;
    webViewRef.current.sendMessage('Hello from React Native!');
  }, [webViewRef]);

  const handleMessage = useCallback((message: string) => {
    console.log('Received message from PagecallWebView:', message);
  }, []);

  return (
    <View style={styles.container}>
      <PagecallWebView
        ref={webViewRef}
        style={styles.webView}
        uri="https://demo.pagecall.net/join/six-canvas/230417a?chime=0"
        onMessage={handleMessage}
      />
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
  webView: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});
