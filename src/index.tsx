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
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';

const LINKING_ERROR =
  `The package 'react-native-pagecall' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export type PagecallViewRef = {
  sendMessage: (message: string) => void;
};

type PagecallSharedProps = {
  style?: ViewStyle;
  ref?: React.Ref<React.ComponentClass<PagecallViewProps>>;
};

type PagecallExternalProps = {
  roomId: string;
  mode?: 'meet' | 'replay';
  accessToken?: string;
  queryParams?: { [key: string]: string };
  value?: { [key: string]: unknown };

  /**
   * Called when the meeting room loading is complete and the entrance page is displayed.
   */
  onLoad?: () => void;
  /**
   * Called when an error occurs during entrance or during the meeting.
   */
  onError?: (error: Error) => void;
  /**
   * Called when the session is intentionally or externally (e.g., kicked out by an admin) terminated.
   */
  onTerminate?: (reason: string) => void;
  /**
   * Called when a remote message is received in the meeting room.
   */
  onMessage?: (message: string) => void;
  /**
   * Called when a local event occurs in the meeting room.
   */
  onEvent?: (payload: unknown) => void;
  onAudioSessionLost?: () => void;
};

export type PagecallViewProps = PagecallSharedProps & PagecallExternalProps;

type NativeEventPayload =
  | {
      type: 'load';
    }
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'terminate';
      reason: string;
    }
  | {
      type: 'message';
      message: string;
    }
  | {
      type: 'event';
      payload: { [key: string]: unknown };
    }
  | {
      type: 'audioSessionLost';
    };

type PagecallInternalProps = {
  onNativeEvent?: (event: NativeEventPayload) => void;
  uri: string;
  stringifiedValue?: string;
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

const baseUrl = 'https://app.pagecall.com';
const emptyQueryParams = Object.freeze({});

export const PagecallView = forwardRef<PagecallViewRef, PagecallViewProps>(
  (
    {
      roomId,
      mode = 'meet',
      accessToken,
      queryParams = emptyQueryParams,
      value,
      onLoad,
      onError,
      onTerminate,
      onMessage,
      onEvent,
      onAudioSessionLost,
      ...props
    },
    ref
  ) => {
    const viewRef = useRef<HostComponent<PagecallViewProps>>(null);
    const uri = useMemo(() => {
      const queryString = Object.entries({
        ...queryParams,
        access_token: accessToken,
      }).reduce((queryParam, [key, val]) => {
        if (val == null) return queryParam;
        return `${queryParam}&${key}=${encodeURI(val)}`;
      }, `room_id=${roomId}`);
      return `${baseUrl}/${mode}?${queryString}`;
    }, [roomId, mode, accessToken, queryParams]);

    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        const view = viewRef.current;
        if (view) {
          const viewId = findNodeHandle(view);
          if (viewId) {
            NativeModules.PagecallViewManager?.sendMessage?.(viewId, message);
          }
        }
      },
    }));

    useEffect(() => {
      mountCount += 1;
      console.log('PagecallView mounted', mountCount);
      if (mountCount > 1)
        console.error(
          'PagecallView is not supposed to be rendered twice or more at the same time. Please make sure the previous view is unmounted.'
        );
      const view = viewRef.current;
      const viewId = view && findNodeHandle(view);
      return () => {
        mountCount -= 1;
        console.log('PagecallView unmounted', mountCount);
        if (mountCount > 0) return;
        if (!viewId) {
          console.warn('PagecallView does not have viewId');
          return;
        }
        console.log('PagecallView is being disposed');
        NativeModules.PagecallViewManager?.dispose?.(viewId);
      };
    }, []);

    const [isLoaded, setLoaded] = useState(false);

    const eventHandlers = {
      onLoad,
      onError,
      onTerminate,
      onMessage,
      onEvent,
      onAudioSessionLost,
    };
    const eventHandlersRef = useRef(eventHandlers);
    eventHandlersRef.current = eventHandlers;

    const onNativeEvent = useCallback((event) => {
      const currentEventHandlers = eventHandlersRef.current;
      const data = event.nativeEvent;
      if (!data) return;
      console.debug('PagecallWebView nativeEvent', data);
      switch (data.type) {
        case 'load': {
          currentEventHandlers.onLoad?.();
          setLoaded(true);
          return;
        }
        case 'error': {
          currentEventHandlers.onError?.(new Error(data.message));
          return;
        }
        case 'terminate': {
          currentEventHandlers.onTerminate?.(data.reason);
          return;
        }
        case 'message': {
          currentEventHandlers.onMessage?.(data.message);
          return;
        }
        case 'event': {
          currentEventHandlers.onEvent?.(data.payload);
          return;
        }
        case 'audioSessionLost': {
          currentEventHandlers.onAudioSessionLost?.();
          return;
        }
      }
    }, []);

    const stringifiedValue = useMemo(() => {
      if (!isLoaded || !value) return undefined;
      return JSON.stringify(value);
    }, [isLoaded, value]);

    return (
      <PagecallViewView
        {...props}
        uri={uri}
        stringifiedValue={stringifiedValue}
        ref={viewRef}
        style={props.style}
        onNativeEvent={onNativeEvent}
      />
    );
  }
);
