/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useRef, useCallback, useState } from 'react';

import { View, Button } from 'react-native';
import { PagecallView } from 'react-native-pagecall';
import type { PagecallViewRef } from 'react-native-pagecall';

const uri = 'https://demo.pagecall.net/join/six-canvas/230417a?chime=0';

export default function App() {
  const viewRef = useRef<PagecallViewRef>(null);
  const [isOpen, setOpen] = useState(false);

  const handleButtonClick = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.sendMessage('Hello from React Native!');
  }, [viewRef]);

  const handleMessage = useCallback((message: string) => {
    console.log('Received message from PagecallView:', message);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isOpen ? (
        <PagecallView
          uri={uri}
          style={{ flex: 1 }}
          ref={viewRef}
          onMessage={handleMessage}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button title="Open" onPress={() => setOpen(true)} />
        </View>
      )}
      <View
        style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}
      >
        <Button title="Send Message" onPress={handleButtonClick} />
        <Button title="Close" onPress={() => setOpen(false)} />
      </View>
    </View>
  );
}
