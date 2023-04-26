import Pagecall

@objc(PagecallWebviewViewManager)
class PagecallWebviewViewManager: RCTViewManager {
  var pagecallView: PagecallWebviewView?

  override func view() -> (PagecallWebviewView) {
    let view = PagecallWebviewView()
    self.pagecallView = view;
    return view;
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

class PagecallWebviewView : UIView {
  let webView = Pagecall.PagecallWebView()

  @objc var uri: String = "" {
    didSet {
      guard let url = URL(string: uri) else { return }
      webView.load(URLRequest(url: url))
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(webView)
    webView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
    webView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
    webView.topAnchor.constraint(equalTo: topAnchor).isActive = true
    webView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
    webView.translatesAutoresizingMaskIntoConstraints = false
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  func hexStringToUIColor(hexColor: String) -> UIColor {
    let stringScanner = Scanner(string: hexColor)

    if(hexColor.hasPrefix("#")) {
      stringScanner.scanLocation = 1
    }
    var color: UInt32 = 0
    stringScanner.scanHexInt32(&color)

    let r = CGFloat(Int(color >> 16) & 0x000000FF)
    let g = CGFloat(Int(color >> 8) & 0x000000FF)
    let b = CGFloat(Int(color) & 0x000000FF)

    return UIColor(red: r / 255.0, green: g / 255.0, blue: b / 255.0, alpha: 1)
  }
}
