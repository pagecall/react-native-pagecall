package com.pagecallview;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebResourceError;

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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
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

  private static Integer instanceCount = 0;

  @Override
  @NonNull
  public View createViewInstance(ThemedReactContext reactContext) {
    instanceCount += 1;
    Log.d("PagecallViewManager", "createViewInstance " + instanceCount);
    PagecallWebView.setWebContentsDebuggingEnabled(true);
    this.webView = new PagecallWebView(reactContext.getCurrentActivity());
    this.webView.setListener(this);
    return webView;
  }

  @Override
  public void onDropViewInstance(View view) {
    instanceCount -= 1;
    Log.d("PagecallViewManager", "dropViewInstance " + instanceCount);
    super.onDropViewInstance(view);
    if (view instanceof PagecallWebView) {
      ((PagecallWebView) view).destroy();
    }
  }

  @ReactProp(name = "uri")
  public void setUri(PagecallWebView view, String uri) {
    view.loadUrl(uri);
  }

  @ReactProp(name = "stringifiedValue")
  public void setStringifiedValue(PagecallWebView view, String stringifiedValue) {
    if (stringifiedValue != null) {
      final String script =
        "(function(window) {" +
          "    try {" +
          "        if (window.PagecallUI) {" +
          "            const values = JSON.parse('" + stringifiedValue.replace("'", "\\'") + "');" +
          "            for (const key in values) {" +
          "                window.PagecallUI.set(key, values[key]);" +
          "            }" +
          "        }" +
          "        return 'Success';" +
          "    } catch (e) {" +
          "        return 'Error: ' + e.message;" +
          "    }" +
          "})(window);";

      view.evaluateJavascript(script, value -> {
        if (value.startsWith("\"Error:")) {
          Log.e("PagecallViewManager", "JavaScript Error: " + value);
        }
      });
    }
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
  private WritableMap jsonObjectToWritableMap(JSONObject jsonObject) throws JSONException {
    WritableMap writableMap = Arguments.createMap();

    Iterator<String> iterator = jsonObject.keys();
    while (iterator.hasNext()) {
      String key = iterator.next();
      Object value = jsonObject.get(key);
      if (value instanceof String) {
        writableMap.putString(key, (String) value);
      } else if (value instanceof Boolean) {
        writableMap.putBoolean(key, (Boolean) value);
      } else if (value instanceof Integer) {
        writableMap.putInt(key, (Integer) value);
      } else if (value instanceof Double) {
        writableMap.putDouble(key, (Double) value);
      } else if (value instanceof JSONObject) {
        writableMap.putMap(key, this.jsonObjectToWritableMap((JSONObject) value));
      }
    }

    return writableMap;
  }

  private WritableMap createNativeEvent(String type, JSONObject payload) throws JSONException {
    WritableMap event = Arguments.createMap();
    event.putString("type", type);
    event.putMap("payload", this.jsonObjectToWritableMap(payload));
    return event;
  }
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
    Log.d("PagecallViewManager", "onLoaded");
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("load"));
  }

  @Override
  public void onMessage(String message) {
    Log.d("PagecallViewManager", "onMessage: " + message);
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("message", "message", message));
  }

  @Override
  public void onEvent(JSONObject payload) {
    Log.d("PagecallViewManager", "onEvent");
    try {
      reactContext
        .getJSModule(RCTEventEmitter.class)
        .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("event", payload));
    } catch (JSONException error) {
      Log.e("PagecallViewManager", error.toString());
    }
  }

  @Override
  public void onTerminated(TerminationReason terminationReason) {
    String reason = terminationReason.getValue();
    Log.d("PagecallViewManager", "onTerminated: " + reason);
    if (terminationReason == TerminationReason.OTHER) {
      reason = terminationReason.getOtherReason();
    }

    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("terminate", "reason", reason));
  }

  @Override
  public void onError(WebResourceError error) {
    Log.d("PagecallViewManager", "onError");
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(webView.getId(), "onNativeEvent", createNativeEvent("error", "message", error.getDescription().toString()));
  }
}
