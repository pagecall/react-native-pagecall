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
    implementation 'com.pagecall:pagecall-android-sdk:0.0.25'
}

```

Ensure that you have a valid GitHub username and personal access token configured in your environment variables or project properties.
