import React from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  NativeModules,
  findNodeHandle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-pagecall-webview' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export type PagecallWebViewRef = {
  sendMessage: (message: string) => void;
};

type PagecallWebViewSharedProps = {
  uri: string;
  style?: ViewStyle;
  ref?: React.Ref<React.ComponentClass<PagecallWebViewProps>>;
};

type PagecallWebViewExternalProps = {
  uri: string;
  style?: ViewStyle;
  onMessage?: (message: string) => void;
};

type PagecallWebViewInternalProps = {
  onNativeEvent?: (event: { nativeEvent: { message: string } }) => void;
};
export type PagecallWebViewProps = PagecallWebViewSharedProps &
  PagecallWebViewExternalProps;

const ComponentName = 'PagecallWebviewView';

const PagecallWebviewView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<
        PagecallWebViewSharedProps & PagecallWebViewInternalProps
      >(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const PagecallWebView = forwardRef<
  PagecallWebViewRef,
  PagecallWebViewProps
>((props, ref) => {
  const viewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      if (
        viewRef.current &&
        NativeModules.PagecallWebviewViewManager?.sendMessage
      ) {
        const viewID = findNodeHandle(viewRef.current);
        if (viewID) {
          NativeModules.PagecallWebviewViewManager.sendMessage(viewID, message);
        }
      }
    },
  }));

  return (
    <PagecallWebviewView
      {...props}
      ref={viewRef}
      style={props.style}
      onNativeEvent={(event) => {
        if (props.onMessage) {
          props.onMessage(event.nativeEvent?.message);
        }
      }}
    />
  );
});
