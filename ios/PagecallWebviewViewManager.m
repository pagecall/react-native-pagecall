#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PagecallWebviewViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXTERN_METHOD(sendMessage:(nonnull NSNumber *)viewID message:(NSString *)message)

@end
