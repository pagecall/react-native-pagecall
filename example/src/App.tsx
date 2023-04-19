import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { PagecallWebView } from '@pagecall/react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <PagecallWebView
        color="#32a852"
        style={styles.box}
        uri="https://demo.pagecall.net/join/six-canvas/230417a?chime=0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: '100%',
    height: '100%',
  },
});
