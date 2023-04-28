import React from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import { forwardRef, useRef, useImperativeHandle } from 'react';

const LINKING_ERROR =
  `The package 'react-native-pagecall' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export type PagecallViewRef = {
  sendMessage: (message: string) => void;
};

type PagecallSharedProps = {
  uri: string;
  style?: ViewStyle;
  ref?: React.Ref<React.ComponentClass<PagecallViewProps>>;
};

type PagecallExternalProps = {
  onMessage?: (message: string) => void;
};

export type PagecallViewProps = PagecallSharedProps & PagecallExternalProps;

type PagecallInternalProps = {
  onNativeEvent?: (event: { nativeEvent: { message: string } }) => void;
};

const ComponentName = 'PagecallView';

const PagecallViewView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<PagecallSharedProps & PagecallInternalProps>(
        ComponentName
      )
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const PagecallView = forwardRef<PagecallViewRef, PagecallViewProps>(
  (props, ref) => {
    const viewRef = useRef(null);

    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        if (viewRef.current && NativeModules.PagecallViewManager?.sendMessage) {
          const viewID = findNodeHandle(viewRef.current);
          if (viewID) {
            NativeModules.PagecallViewManager.sendMessage(viewID, message);
          }
        }
      },
    }));

    return (
      <PagecallViewView
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
  }
);
