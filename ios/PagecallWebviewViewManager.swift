import Pagecall

@objc(PagecallWebviewViewManager)
class PagecallWebviewViewManager: RCTViewManager {

  override func view() -> (PagecallWebviewView) {
    return PagecallWebviewView()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

class PagecallWebviewView : UIView {

  private let webview = Pagecall.PagecallWebView()

  @objc var color: String = "" {
    didSet {
      self.backgroundColor = hexStringToUIColor(hexColor: color)
    }
  }

  @objc var uri: String = "" {
    didSet {
      guard let url = URL(string: uri) else { return }
      webview.load(URLRequest(url: url))
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(webview)
    webview.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
    webview.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
    webview.topAnchor.constraint(equalTo: topAnchor).isActive = true
    webview.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
    webview.translatesAutoresizingMaskIntoConstraints = false
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
