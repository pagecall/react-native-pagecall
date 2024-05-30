package com.pagecallview;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.UIManagerModule;

import com.pagecall.PagecallWebView;

public class PagecallModule extends ReactContextBaseJavaModule {
  private static final String REACT_CLASS = "PagecallViewManager";
  public PagecallModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @ReactMethod
  public void sendMessage(int viewID, String message) {
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(nativeViewHierarchyManager -> {
      PagecallWebView webView = (PagecallWebView) nativeViewHierarchyManager.resolveView(viewID);
      if (webView != null) {
        Log.d("PagecallModule", "sendMessage: " + message);
        webView.sendMessage(message);
      } else {
        Log.e("PagecallModule", "webView could not be resolved with viewID " + viewID);
      }
    });
  }
}
