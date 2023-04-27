import Pagecall

@objc(PagecallWebviewViewManager)
class PagecallWebviewViewManager: RCTViewManager {
  var pagecallView: PagecallWebviewView?
    
  override init() {
      super.init()
  }
    
  override func view() -> (PagecallWebviewView) {
    let view = PagecallWebviewView()
    self.pagecallView = view
    return view
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(sendMessage:message:)
  func sendMessage(_ viewID: NSNumber, message: String) {
      let uiManager = bridge.module(for: RCTUIManager.self) as! RCTUIManager
      DispatchQueue.main.async {
          if let pagecallWebviewView = uiManager.view(forReactTag: viewID) as? PagecallWebviewView {
              pagecallWebviewView.webView.sendMessage(message: message, completionHandler: nil)
          }
      }
  }
}

class PagecallWebviewView: UIView, PagecallWebViewDelegate {

  let webView = Pagecall.PagecallWebView()
  var stopListen: (() -> Void)?

  @objc var uri: String = "" {
    didSet {
      guard let url = URL(string: uri) else { return }
      webView.load(URLRequest(url: url))
    }
  }
    
  override init(frame: CGRect) {
    super.init(frame: frame)
    commonInit()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
    @objc var onNativeEvent: RCTDirectEventBlock?
    
  private func commonInit() {
     self.addSubview(webView)
     webView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
     webView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
     webView.topAnchor.constraint(equalTo: topAnchor).isActive = true
     webView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
     webView.translatesAutoresizingMaskIntoConstraints = false
     webView.delegate = self
   }

  func pagecallDidLoad(_ webView: Pagecall.PagecallWebView) {
      stopListen?()
      stopListen = webView.listenMessage { message in
        self.onNativeEvent?(["message": message])
      }
  }
  deinit {
    stopListen?()
  }
}
