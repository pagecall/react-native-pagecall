# react-native-pagecall

A React Native module that provides a simple WebView component to integrate Pagecall's audio feature into your application. Note that video feature is not supported yet.  

It uses following native SDKs  

- [pagecall-android-sdk](https://github.com/pagecall/pagecall-android-sdk)
- [pagecall-ios-sdk](https://github.com/pagecall/pagecall-ios-sdk)

[Visit Pagecall](https://pagecall.com)

## Installation

```sh
npm install react-native-pagecall
```

or 

```sh
yarn add react-native-pagecall
```

## Usage

```jsx
import React from 'react';
import { useRef, useCallback } from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { PagecallView } from 'react-native-pagecall';
import type { PagecallViewRef } from 'react-native-pagecall';

const uri = 'https://demo.pagecall.net/join/six-canvas/230417a?chime=0';

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
      <PagecallView
        uri={uri}
        style={styles.pagecallView}
        ref={viewRef}
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
  pagecallView: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});
```

## Android setup

To use this module in an Android project, you need to add the dependency of `pagecall-android-sdk` manually:  

In your android/app/build.gradle file, add the following:  

```groovy
allprojects {
    repositories {
        maven {
            url 'https://maven.pkg.github.com/pagecall/pagecall-android-sdk'
            credentials {
                username = project.findProperty("GITHUB_USERNAME") ?: System.getenv("GITHUB_USERNAME")
                password = project.findProperty("GITHUB_TOKEN") ?: System.getenv("GITHUB_TOKEN")
            }
        }
    }
}

dependencies {
    ...
    implementation 'com.pagecall:pagecall-android-sdk:0.0.12'
}

```

Ensure that you have a valid GitHub username and personal access token configured in your environment variables or project properties.
