/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useRef, useCallback, useState, useEffect } from 'react';
import { PagecallView } from 'react-native-pagecall';
import type { PagecallViewRef } from 'react-native-pagecall';
import { SafeAreaView, View, Button, Text } from 'react-native';

const roomId = '665565dcac238bb80026c1ca';
const accessToken = 'l6cbBU_0NKpsMaUSXJlAnifEUqbsGzB4';

function PagecallScreen({ navigation }) {
  const viewRef = useRef<PagecallViewRef>(null);

  const handleButtonClick = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.sendMessage('Hello from React Native!');
  }, [viewRef]);

  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!latestMessage) return;
    const timer = setTimeout(() => {
      setLatestMessage(null);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [latestMessage]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PagecallView
        roomId={roomId}
        accessToken={accessToken}
        mode="meet"
        style={{ flex: 1 }}
        ref={viewRef}
        onLoad={() => setLoading(false)}
        onTerminate={() => navigation.goBack()}
        onMessage={setLatestMessage}
      />
      {latestMessage && (
        <View
          style={{
            position: 'absolute',
            bottom: 128,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'red' }}>{latestMessage}</Text>
        </View>
      )}
      <View
        style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}
      >
        <Button title="Send Message" onPress={handleButtonClick} />
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

export default PagecallScreen;
