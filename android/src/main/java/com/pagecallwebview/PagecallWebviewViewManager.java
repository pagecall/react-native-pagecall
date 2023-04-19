package com.pagecallwebview;

import android.graphics.Color;
import android.view.View;

import androidx.annotation.NonNull;
import com.pagecall.PagecallWebView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class PagecallWebviewViewManager extends SimpleViewManager<PagecallWebView> {
  public static final String REACT_CLASS = "PagecallWebviewView";

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  public PagecallWebView createViewInstance(ThemedReactContext reactContext) {
    return new PagecallWebView(reactContext);
  }

  @ReactProp(name = "color")
  public void setColor(PagecallWebView view, String color) {
    view.setBackgroundColor(Color.parseColor(color));
  }

  @ReactProp(name = "uri")
  public void setUri(PagecallWebView view, String uri) {
    PagecallWebView webView = (PagecallWebView) view;
    webView.loadUrl(uri);
  }
}
