package com.pagecallview;

import android.app.Activity;
import android.content.Intent;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.pagecall.PagecallWebView;

import java.util.Map;

public class PagecallViewManager extends SimpleViewManager<View> implements ActivityEventListener {
  public static final String REACT_CLASS = "PagecallView";

  private PagecallWebView webView;

  public PagecallViewManager(ReactApplicationContext reactContext) {
    super();
    reactContext.addActivityEventListener(this);
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
    this.webView = new PagecallWebView(reactContext.getCurrentActivity()) {
      @Override
      protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        this.destroy();
      }
    };
    this.webView.listenMessage(message -> {
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
    view.loadUrl(uri);
  }

  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put("onNativeEvent", MapBuilder.of("registrationName", "onNativeEvent"))
      .build();
  }

  // ActivityEventListener
  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
    if (this.webView != null) {
      this.webView.onActivityResult(requestCode, resultCode, intent);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    // ActivityEventListener delegate interface를 만족하기 위한 stub
  }
}
