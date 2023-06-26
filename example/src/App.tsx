/* eslint-disable react-native/no-inline-styles, @typescript-eslint/no-shadow */
import React from 'react';
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
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
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'meet' | 'replay' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('roomId').then((roomId) => {
      if (!roomId) return;
      setRoomId(roomId);
    });
    AsyncStorage.getItem('query').then((query) => {
      if (!query) return;
      setQuery(query);
    });
  }, []);

  useEffect(() => {
    if (!mode) return;
    Promise.all([
      roomId
        ? AsyncStorage.setItem('roomId', roomId)
        : AsyncStorage.removeItem('roomId'),
      query
        ? AsyncStorage.setItem('query', query)
        : AsyncStorage.removeItem('query'),
    ]).catch(console.error);
  }, [roomId, query, mode]);

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

  const queryParams = useMemo(() => {
    const params: { [key: string]: string } = {};
    query.split('&').forEach((queryItem) => {
      const [key, value] = queryItem.split('=');
      if (!key || !value) return;
      params[key] = value;
    });
    return params;
  }, [query]);

  const [isLoading, setLoading] = useState(false);

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
          <Text>Query (Only for debug)</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={textInputStyle}
            autoCapitalize="none"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ marginRight: 16 }}>
              <Button
                title="Meet"
                onPress={() => {
                  setLoading(true);
                  setMode('meet');
                }}
              />
            </View>
            <View>
              <Button
                title="Replay"
                onPress={() => {
                  setLoading(true);
                  setMode('replay');
                }}
              />
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
        queryParams={queryParams}
        style={{ flex: 1 }}
        ref={viewRef}
        onLoad={() => setLoading(false)}
        onTerminate={() => setMode(null)}
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
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1361FF',
          }}
        >
          <Text style={{ color: 'white' }}>Now loading...</Text>
        </View>
      )}
      <View
        style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}
      >
        <Button title="Send Message" onPress={handleButtonClick} />
        <Button title="Close" onPress={() => setMode(null)} />
      </View>
    </SafeAreaView>
  );
}
