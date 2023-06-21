/* eslint-disable react-native/no-inline-styles, @typescript-eslint/no-shadow */
import React from 'react';
import { useRef, useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView, View, Button, TextInput, Text } from 'react-native';
import { PagecallView } from 'react-native-pagecall';
import type { PagecallViewRef } from 'react-native-pagecall';

const textInputStyle = {
  borderWidth: 1,
  marginTop: 4,
  padding: 8,
  width: 280,
  borderRadius: 8,
  marginBottom: 16,
};
export default function App() {
  const viewRef = useRef<PagecallViewRef>(null);
  const [roomId, setRoomId] = useState('');
  const [build, setBuild] = useState('');
  const [mode, setMode] = useState<'meet' | 'replay' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('roomId').then((roomId) => {
      if (!roomId) return;
      setRoomId(roomId);
    });
    AsyncStorage.getItem('build').then((build) => {
      if (!build) return;
      setBuild(build);
    });
  }, []);

  useEffect(() => {
    if (!mode) return;
    Promise.all([
      roomId
        ? AsyncStorage.setItem('roomId', roomId)
        : AsyncStorage.removeItem('roomId'),
      build
        ? AsyncStorage.setItem('build', build)
        : AsyncStorage.removeItem('build'),
    ]).catch(console.error);
  }, [roomId, build, mode]);

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

  if (!mode) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <View>
          <Text>Room ID</Text>
          <TextInput
            value={roomId}
            onChangeText={setRoomId}
            autoFocus
            style={textInputStyle}
            autoCapitalize="none"
          />
          <Text>Build (Only for debug)</Text>
          <TextInput
            value={build}
            onChangeText={setBuild}
            style={textInputStyle}
            autoCapitalize="none"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ marginRight: 16 }}>
              <Button title="Meet" onPress={() => setMode('meet')} />
            </View>
            <View>
              <Button title="Replay" onPress={() => setMode('replay')} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PagecallView
        roomId={roomId}
        mode={mode}
        queryParams={build ? { build } : undefined}
        style={{ flex: 1 }}
        ref={viewRef}
        onMessage={setLatestMessage}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
        }}
      >
        <Text>{latestMessage}</Text>
      </View>
      <View
        style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}
      >
        <Button title="Send Message" onPress={handleButtonClick} />
        <Button title="Close" onPress={() => setMode(null)} />
      </View>
    </SafeAreaView>
  );
}
