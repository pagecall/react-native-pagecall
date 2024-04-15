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

Please refer to the example. You can easily grasp it by looking at [App.tsx](/example/src/App.tsx).

## iOS setup

Configure the minimum iOS version to 14 for installing the WebRTC package.

In your ios/Podfile, make the following adjustment:

```diff
- platform :ios, min_ios_version_supported
+ platform :ios, '14.0'
```

## Android setup

Configure the minimum Android minSdkVersion to 24 for installing the WebRTC package.

In your android/build.gradle, make the following adjustment:

```diff
ext {
    buildToolsVersion = "34.0.0"
-   minSdkVersion = 21
+   minSdkVersion = 24
    compileSdkVersion = 33
    compileSdkVersion = 33
    targetSdkVersion = 33
    ndkVersion = "25.1.8937393"
    kotlinVersion = "1.8.0"
}
```

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
    implementation 'com.pagecall:pagecall-android-sdk:0.0.39'
}

```

Ensure that you have a valid GitHub username and personal access token configured in your environment variables or project properties.
