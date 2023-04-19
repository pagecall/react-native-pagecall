import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-pagecall-webview' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type PagecallWebProps = {
  color: string;
  uri: string;
  style: ViewStyle;
};

const ComponentName = 'PagecallWebviewView';

export const PagecallWebView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<PagecallWebProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
