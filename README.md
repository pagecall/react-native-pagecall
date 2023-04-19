# @pagecall/react-native-webview

A React Native module that provides a simple WebView component to integrate Pagecall's audio feature into your application. Note that video feature is not supported yet.  

It uses following native SDKs  

- [pagecall-android-sdk](https://github.com/pagecall/pagecall-android-sdk)
- [pagecall-ios-sdk](https://github.com/pagecall/pagecall-ios-sdk)

[Visit Pagecall](https://pagecall.com)

## Installation

```sh
npm install @pagecall/react-native-webview
```

or 

```sh
yarn add @pagecall/react-native-webview
```

## Usage

```jsx
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { PagecallWebView } from '@pagecall/react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <PagecallWebView
        color="#32a852"
        style={styles.box}
        uri="https://app.pagecall.com/meet?room_id={room_id}&access_token={access_token}"
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
    implementation 'com.pagecall:pagecall-android-sdk:0.0.1'
}

```

Ensure that you have a valid GitHub username and personal access token configured in your environment variables or project properties.
