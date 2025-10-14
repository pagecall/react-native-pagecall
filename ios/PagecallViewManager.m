#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PagecallViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(stringifiedValue, NSString)
RCT_EXPORT_VIEW_PROPERTY(onNativeEvent, RCTDirectEventBlock)
RCT_EXTERN_METHOD(sendMessage:(nonnull NSNumber *)viewID message:(NSString *)message)
RCT_EXTERN_METHOD(dispose: (nonnull NSNumber *)viewID)

@end
