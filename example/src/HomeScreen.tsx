import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView>
      <Text>Hello</Text>
      <Button title="Enter" onPress={() => navigation.navigate('Pagecall')} />
    </SafeAreaView>
  );
}

export default HomeScreen;
