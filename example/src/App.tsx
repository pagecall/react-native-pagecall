import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { PagecallView } from 'react-native-pagecall';

export default function App() {
  return (
    <View style={styles.container}>
      <PagecallView color="#32a852" style={styles.box} />
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
