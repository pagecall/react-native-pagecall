#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PagecallWebviewViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)

@end
