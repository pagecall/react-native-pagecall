package com.pagecall;

import android.graphics.Color;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.pagecall.PagecallWebView;

import java.util.Map;

public class PagecallViewManager extends SimpleViewManager<View> {
  public static final String REACT_CLASS = "PagecallView";

  private ReactApplicationContext reactContext;

  public PagecallViewManager(ReactApplicationContext reactContext) {
    super();
    this.reactContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  public View createViewInstance(ThemedReactContext reactContext) {
    PagecallWebView.setWebContentsDebuggingEnabled(true);
    PagecallWebView webView = new PagecallWebView(reactContext);
    webView.listenMessage(message -> {
      reactContext
        .getJSModule(RCTEventEmitter.class)
        .receiveEvent(webView.getId(), "onNativeEvent", createMessageEvent(message));
    });
    return webView;
  }

  private WritableMap createMessageEvent(String message) {
    WritableMap event = Arguments.createMap();
    event.putString("message", message);
    return event;
  }

  @ReactProp(name = "uri")
  public void setUri(PagecallWebView view, String uri) {
    PagecallWebView webView = (PagecallWebView) view;
    webView.loadUrl(uri);
  }

  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put("onNativeEvent", MapBuilder.of("registrationName", "onNativeEvent"))
      .build();
  }
}
