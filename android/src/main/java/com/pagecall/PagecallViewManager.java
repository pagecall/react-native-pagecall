package com.pagecallview;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.pagecall.PagecallWebView;
import com.pagecall.TerminationReason;

import java.util.Map;

public class PagecallViewManager extends SimpleViewManager<View> implements ActivityEventListener, PagecallWebView.Listener {
  public static final String REACT_CLASS = "PagecallView";

  private PagecallWebView webView;

  private ReactContext reactContext;

  public PagecallViewManager(ReactApplicationContext reactContext) {
    super();
    this.reactContext = reactContext;
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
    this.webView.setListener(this);
    return webView;
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

  // PagecallWebView.Listener implementations
  private WritableMap createNativeEvent(String type, String payloadKey, String payloadValue) {
    WritableMap event = Arguments.createMap();
    event.putString("type", type);
    event.putString(payloadKey, payloadValue);
    return event;
  }
  private WritableMap createNativeEvent(String type) {
    WritableMap event = Arguments.createMap();
    event.putString("type", type);
    return event;
  }

  @Override
  public void onLoaded() {
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("load"));
  }

  @Override
  public void onMessage(String message) {
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("message", "message", message));
  }

  @Override
  public void onTerminated(TerminationReason terminationReason) {
    String reason = terminationReason.getValue();
    if (terminationReason == TerminationReason.OTHER) {
      reason = terminationReason.getOtherReason();
    }

    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("terminate", "reason", reason));
  }
}
