import React from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import type { HostComponent } from 'react-native';
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react';

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

let mountCount = 0;

export const PagecallView = forwardRef<PagecallViewRef, PagecallViewProps>(
  (props, ref) => {
    const viewRef = useRef<HostComponent<PagecallViewProps>>(null);

    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        const view = viewRef.current;
        if (view) {
          const viewID = findNodeHandle(view);
          if (viewID) {
            NativeModules.PagecallViewManager?.sendMessage?.(viewID, message);
          }
        }
      },
    }));

    useEffect(() => {
      mountCount += 1;
      if (mountCount > 1)
        console.error(
          'PagecallView is not supposed to be rendered twice or more at the same time. Please make sure the previous view is unmounted.'
        );
      return () => {
        NativeModules.PagecallViewManager?.dispose?.();
        mountCount -= 1;
      };
    }, []);

    const onNativeEvent = useCallback((event) => {
      if (props.onMessage) {
        const message = event.nativeEvent?.message;
        if (typeof message !== 'string') {
          console.warn('message is not string. event: ', event);
          return;
        }
        props.onMessage(message);
      }
    }, [props.onMessage]);

    return (
      <PagecallViewView
        {...props}
        ref={viewRef}
        style={props.style}
        onNativeEvent={onNativeEvent}
      />
    );
  }
);
